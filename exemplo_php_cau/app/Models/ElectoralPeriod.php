<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Model para período eleitoral CAU
 * Representa um ciclo completo de eleições
 */
class ElectoralPeriod extends Model
{
    use SoftDeletes;
    
    protected $table = 'electoral_periods';
    
    protected $fillable = [
        'nome',
        'data_inicio',
        'data_fim',
        'tipo_eleicao',
        'status',
        'regulamento_resolucao',
        'created_by',
        'updated_by',
        'activated_at',
        'activated_by'
    ];
    
    protected $dates = [
        'data_inicio',
        'data_fim',
        'activated_at',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    
    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'activated_at' => 'datetime'
    ];
    
    const STATUS_PLANEJAMENTO = 'planejamento';
    const STATUS_ATIVO = 'ativo';
    const STATUS_ENCERRADO = 'encerrado';
    
    const TIPO_NACIONAL = 'nacional';
    const TIPO_ESTADUAL = 'estadual';
    const TIPO_FEDERAL = 'federal';
    
    /**
     * Relacionamento com chapas eleitorais
     */
    public function chapas()
    {
        return $this->hasMany(Chapa::class, 'electoral_period_id');
    }
    
    /**
     * Relacionamento com configurações do período
     */
    public function settings()
    {
        return $this->hasMany(ElectoralPeriodSetting::class, 'electoral_period_id');
    }
    
    /**
     * Relacionamento com denúncias do período
     */
    public function denuncias()
    {
        return $this->hasMany(Denuncia::class, 'electoral_period_id');
    }
    
    /**
     * Relacionamento com usuário que criou
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Relacionamento com usuário que ativou
     */
    public function activatedBy()
    {
        return $this->belongsTo(User::class, 'activated_by');
    }
    
    /**
     * Scope para períodos ativos
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ATIVO);
    }
    
    /**
     * Scope para períodos em planejamento
     */
    public function scopePlanning($query)
    {
        return $query->where('status', self::STATUS_PLANEJAMENTO);
    }
    
    /**
     * Scope para períodos encerrados
     */
    public function scopeClosed($query)
    {
        return $query->where('status', self::STATUS_ENCERRADO);
    }
    
    /**
     * Verifica se período está ativo
     */
    public function isActive()
    {
        return $this->status === self::STATUS_ATIVO;
    }
    
    /**
     * Verifica se período está em planejamento
     */
    public function isPlanning()
    {
        return $this->status === self::STATUS_PLANEJAMENTO;
    }
    
    /**
     * Verifica se período foi encerrado
     */
    public function isClosed()
    {
        return $this->status === self::STATUS_ENCERRADO;
    }
    
    /**
     * Verifica se está no período de inscrição de chapas
     */
    public function isInscriptionPeriod()
    {
        if (!$this->isActive()) {
            return false;
        }
        
        $prazoInscricao = $this->getSetting('prazo_inscricao_chapas', 30);
        $dataLimite = $this->data_inicio->addDays($prazoInscricao);
        
        return now()->lte($dataLimite);
    }
    
    /**
     * Verifica se está no período de impugnações
     */
    public function isImpugnationPeriod()
    {
        if (!$this->isActive()) {
            return false;
        }
        
        $prazoInscricao = $this->getSetting('prazo_inscricao_chapas', 30);
        $prazoImpugnacao = $this->getSetting('prazo_impugnacao', 10);
        
        $inicioImpugnacao = $this->data_inicio->addDays($prazoInscricao);
        $fimImpugnacao = $inicioImpugnacao->addDays($prazoImpugnacao);
        
        return now()->between($inicioImpugnacao, $fimImpugnacao);
    }
    
    /**
     * Calcula dias restantes do período
     */
    public function getDaysRemaining()
    {
        if ($this->isClosed()) {
            return 0;
        }
        
        return now()->diffInDays($this->data_fim, false);
    }
    
    /**
     * Obtém configuração específica do período
     */
    public function getSetting($key, $default = null)
    {
        $setting = $this->settings()->where('key', $key)->first();
        
        return $setting ? $setting->value : $default;
    }
    
    /**
     * Define configuração do período
     */
    public function setSetting($key, $value)
    {
        return $this->settings()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
    
    /**
     * Retorna estatísticas do período
     */
    public function getStatistics()
    {
        return [
            'total_chapas' => $this->chapas()->count(),
            'chapas_ativas' => $this->chapas()->where('status', 'ativa')->count(),
            'total_denuncias' => $this->denuncias()->count(),
            'denuncias_pendentes' => $this->denuncias()->where('status', 'pendente')->count(),
            'dias_restantes' => $this->getDaysRemaining(),
            'periodo_inscricao' => $this->isInscriptionPeriod(),
            'periodo_impugnacao' => $this->isImpugnationPeriod()
        ];
    }
    
    /**
     * Validações customizadas
     */
    public function validate()
    {
        $errors = [];
        
        // Valida datas
        if ($this->data_fim <= $this->data_inicio) {
            $errors[] = 'Data de fim deve ser posterior à data de início';
        }
        
        // Valida duração mínima
        if ($this->data_inicio->diffInDays($this->data_fim) < 90) {
            $errors[] = 'Período deve ter no mínimo 90 dias';
        }
        
        return $errors;
    }
}