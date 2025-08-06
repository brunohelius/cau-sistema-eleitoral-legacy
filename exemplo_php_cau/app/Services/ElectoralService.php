<?php

namespace App\Services;

use App\Models\ElectoralPeriod;
use App\Repositories\ElectoralRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Serviço para lógica de negócio do sistema eleitoral
 * Implementa regras específicas do CAU conforme Resolution 179/2022
 */
class ElectoralService
{
    private $electoralRepository;
    
    public function __construct(ElectoralRepository $electoralRepository)
    {
        $this->electoralRepository = $electoralRepository;
    }
    
    /**
     * Lista períodos eleitorais com filtros
     */
    public function listElectoralPeriods($perPage = 15, $status = null)
    {
        $query = $this->electoralRepository->query();
        
        if ($status) {
            $query->where('status', $status);
        }
        
        return $query->orderBy('data_inicio', 'desc')->paginate($perPage);
    }
    
    /**
     * Cria novo período eleitoral
     * Aplica validações específicas do CAU
     */
    public function createElectoralPeriod(array $data)
    {
        // Validação: não pode haver sobreposição de períodos ativos
        $this->validatePeriodOverlap($data['data_inicio'], $data['data_fim']);
        
        // Validação: período mínimo conforme regulamento
        $this->validateMinimumPeriod($data['data_inicio'], $data['data_fim']);
        
        DB::beginTransaction();
        
        try {
            $period = $this->electoralRepository->create([
                'nome' => $data['nome'],
                'data_inicio' => $data['data_inicio'],
                'data_fim' => $data['data_fim'],
                'tipo_eleicao' => $data['tipo_eleicao'],
                'status' => $data['status'],
                'regulamento_resolucao' => '179/2022', // CAU Resolution
                'created_by' => auth()->id()
            ]);
            
            // Cria configurações padrão do período
            $this->createDefaultPeriodSettings($period);
            
            DB::commit();
            
            Log::info('Período eleitoral criado', [
                'period_id' => $period->id,
                'user_id' => auth()->id()
            ]);
            
            return $period;
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar período eleitoral', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }
    
    /**
     * Atualiza período eleitoral
     */
    public function updateElectoralPeriod($id, array $data)
    {
        $period = $this->electoralRepository->find($id);
        
        if (!$period) {
            return null;
        }
        
        // Validação: período ativo não pode ser alterado
        if ($period->status === 'ativo' && isset($data['data_inicio'])) {
            throw new \Exception('Período ativo não pode ter datas alteradas');
        }
        
        // Valida sobreposição se datas foram alteradas
        if (isset($data['data_inicio']) || isset($data['data_fim'])) {
            $this->validatePeriodOverlap(
                $data['data_inicio'] ?? $period->data_inicio,
                $data['data_fim'] ?? $period->data_fim,
                $id
            );
        }
        
        DB::beginTransaction();
        
        try {
            $period = $this->electoralRepository->update($id, array_merge($data, [
                'updated_by' => auth()->id()
            ]));
            
            DB::commit();
            
            Log::info('Período eleitoral atualizado', [
                'period_id' => $id,
                'user_id' => auth()->id()
            ]);
            
            return $period;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Remove período eleitoral
     */
    public function deleteElectoralPeriod($id)
    {
        $period = $this->electoralRepository->find($id);
        
        if (!$period) {
            return false;
        }
        
        // Validação: período ativo não pode ser removido
        if ($period->status === 'ativo') {
            throw new \Exception('Período ativo não pode ser removido');
        }
        
        // Validação: verifica se tem chapas cadastradas
        if ($period->chapas()->count() > 0) {
            throw new \Exception('Período com chapas cadastradas não pode ser removido');
        }
        
        DB::beginTransaction();
        
        try {
            $this->electoralRepository->delete($id);
            
            DB::commit();
            
            Log::info('Período eleitoral removido', [
                'period_id' => $id,
                'user_id' => auth()->id()
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Ativa período eleitoral
     * Desativa todos os outros períodos
     */
    public function activateElectoralPeriod($id)
    {
        $period = $this->electoralRepository->find($id);
        
        if (!$period) {
            throw new \Exception('Período não encontrado');
        }
        
        // Validação: período deve estar em planejamento
        if ($period->status !== 'planejamento') {
            throw new \Exception('Apenas períodos em planejamento podem ser ativados');
        }
        
        // Validação: data de início não pode ser no passado
        if ($period->data_inicio < now()) {
            throw new \Exception('Data de início não pode ser no passado');
        }
        
        DB::beginTransaction();
        
        try {
            // Desativa todos os outros períodos
            $this->electoralRepository->deactivateAll();
            
            // Ativa o período selecionado
            $period = $this->electoralRepository->update($id, [
                'status' => 'ativo',
                'activated_at' => now(),
                'activated_by' => auth()->id()
            ]);
            
            // Dispara eventos do sistema
            $this->triggerElectoralPeriodActivation($period);
            
            DB::commit();
            
            Log::info('Período eleitoral ativado', [
                'period_id' => $id,
                'user_id' => auth()->id()
            ]);
            
            return $period;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Validação: sobreposição de períodos
     */
    private function validatePeriodOverlap($dataInicio, $dataFim, $excludeId = null)
    {
        $query = $this->electoralRepository->query()
            ->where(function ($q) use ($dataInicio, $dataFim) {
                $q->whereBetween('data_inicio', [$dataInicio, $dataFim])
                  ->orWhereBetween('data_fim', [$dataInicio, $dataFim])
                  ->orWhere(function ($q2) use ($dataInicio, $dataFim) {
                      $q2->where('data_inicio', '<=', $dataInicio)
                         ->where('data_fim', '>=', $dataFim);
                  });
            })
            ->whereIn('status', ['planejamento', 'ativo']);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        if ($query->exists()) {
            throw new \Exception('Há sobreposição com outro período eleitoral');
        }
    }
    
    /**
     * Validação: período mínimo (90 dias conforme CAU)
     */
    private function validateMinimumPeriod($dataInicio, $dataFim)
    {
        $inicio = \Carbon\Carbon::parse($dataInicio);
        $fim = \Carbon\Carbon::parse($dataFim);
        
        if ($fim->diffInDays($inicio) < 90) {
            throw new \Exception('Período eleitoral deve ter no mínimo 90 dias');
        }
    }
    
    /**
     * Cria configurações padrão do período
     */
    private function createDefaultPeriodSettings($period)
    {
        // Implementa configurações específicas do CAU
        $settings = [
            'prazo_inscricao_chapas' => 30,
            'prazo_impugnacao' => 10,
            'prazo_recurso' => 5,
            'quorum_minimo' => 0.1, // 10% conforme regulamento
            'permite_candidatura_avulsa' => false
        ];
        
        foreach ($settings as $key => $value) {
            $period->settings()->create([
                'key' => $key,
                'value' => $value
            ]);
        }
    }
    
    /**
     * Dispara eventos de ativação
     */
    private function triggerElectoralPeriodActivation($period)
    {
        // Notifica todos os profissionais cadastrados
        // Ativa sistema de chapas
        // Configura prazos automáticos
        
        event('electoral.period.activated', $period);
    }
}