<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ElectoralService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Controlador para gerenciar calendário eleitoral
 * Responsável por CRUD do sistema eleitoral CAU
 */
class ElectoralController extends Controller
{
    private $electoralService;
    
    public function __construct(ElectoralService $electoralService)
    {
        $this->electoralService = $electoralService;
    }
    
    /**
     * Lista todos os períodos eleitorais
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $status = $request->get('status');
        
        $periods = $this->electoralService->listElectoralPeriods($perPage, $status);
        
        return response()->json([
            'success' => true,
            'data' => $periods,
            'message' => 'Períodos eleitorais listados com sucesso'
        ]);
    }
    
    /**
     * Cria novo período eleitoral
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
            'tipo_eleicao' => 'required|in:nacional,estadual,federal',
            'status' => 'required|in:planejamento,ativo,encerrado'
        ]);
        
        try {
            $period = $this->electoralService->createElectoralPeriod($validatedData);
            
            return response()->json([
                'success' => true,
                'data' => $period,
                'message' => 'Período eleitoral criado com sucesso'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar período eleitoral: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Atualiza período eleitoral existente
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nome' => 'string|max:255',
            'data_inicio' => 'date',
            'data_fim' => 'date|after:data_inicio',
            'tipo_eleicao' => 'in:nacional,estadual,federal',
            'status' => 'in:planejamento,ativo,encerrado'
        ]);
        
        try {
            $period = $this->electoralService->updateElectoralPeriod($id, $validatedData);
            
            if (!$period) {
                return response()->json([
                    'success' => false,
                    'message' => 'Período eleitoral não encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $period,
                'message' => 'Período eleitoral atualizado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar período eleitoral: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove período eleitoral
     */
    public function destroy($id)
    {
        try {
            $deleted = $this->electoralService->deleteElectoralPeriod($id);
            
            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Período eleitoral não encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Período eleitoral removido com sucesso'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao remover período eleitoral: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Ativa período eleitoral
     */
    public function activate($id)
    {
        try {
            $result = $this->electoralService->activateElectoralPeriod($id);
            
            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Período eleitoral ativado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao ativar período eleitoral: ' . $e->getMessage()
            ], 500);
        }
    }
}