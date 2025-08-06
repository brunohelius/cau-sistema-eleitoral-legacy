@extends('layouts.app')

@section('title', 'Calendário Eleitoral - CAU')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3 class="card-title">
                        <i class="fas fa-calendar-alt"></i>
                        Calendário Eleitoral
                    </h3>
                    
                    @can('create_electoral_period')
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPeriodModal">
                        <i class="fas fa-plus"></i>
                        Novo Período
                    </button>
                    @endcan
                </div>
                
                <div class="card-body">
                    <!-- Filtros -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <label for="statusFilter" class="form-label">Status</label>
                            <select id="statusFilter" class="form-select" v-model="filters.status" @change="loadPeriods">
                                <option value="">Todos</option>
                                <option value="planejamento">Planejamento</option>
                                <option value="ativo">Ativo</option>
                                <option value="encerrado">Encerrado</option>
                            </select>
                        </div>
                        
                        <div class="col-md-3">
                            <label for="typeFilter" class="form-label">Tipo</label>
                            <select id="typeFilter" class="form-select" v-model="filters.type" @change="loadPeriods">
                                <option value="">Todos</option>
                                <option value="nacional">Nacional</option>
                                <option value="estadual">Estadual</option>
                                <option value="federal">Federal</option>
                            </select>
                        </div>
                        
                        <div class="col-md-4">
                            <label for="searchFilter" class="form-label">Buscar</label>
                            <input type="text" id="searchFilter" class="form-control" 
                                   v-model="filters.search" 
                                   @input="debounceSearch"
                                   placeholder="Nome do período...">
                        </div>
                        
                        <div class="col-md-2 d-flex align-items-end">
                            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                                <i class="fas fa-times"></i>
                                Limpar
                            </button>
                        </div>
                    </div>
                    
                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                    
                    <!-- Tabela de Períodos -->
                    <div v-else class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Data Início</th>
                                    <th>Data Fim</th>
                                    <th>Status</th>
                                    <th>Dias Restantes</th>
                                    <th class="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="period in periods" :key="period.id">
                                    <td>
                                        <strong>{{ period.nome }}</strong>
                                        <br>
                                        <small class="text-muted">{{ period.regulamento_resolucao }}</small>
                                    </td>
                                    <td>
                                        <span class="badge" :class="getTypeBadgeClass(period.tipo_eleicao)">
                                            {{ period.tipo_eleicao | capitalize }}
                                        </span>
                                    </td>
                                    <td>{{ period.data_inicio | formatDate }}</td>
                                    <td>{{ period.data_fim | formatDate }}</td>
                                    <td>
                                        <span class="badge" :class="getStatusBadgeClass(period.status)">
                                            {{ period.status | capitalize }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="period.dias_restantes >= 0" class="text-success">
                                            {{ period.dias_restantes }} dias
                                        </span>
                                        <span v-else class="text-danger">
                                            Expirado
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <div class="btn-group" role="group">
                                            <!-- Visualizar -->
                                            <button class="btn btn-sm btn-outline-info" 
                                                    @click="viewPeriod(period)"
                                                    title="Visualizar">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            
                                            <!-- Ativar (se em planejamento) -->
                                            <button v-if="period.status === 'planejamento'" 
                                                    class="btn btn-sm btn-outline-success"
                                                    @click="activatePeriod(period)"
                                                    title="Ativar"
                                                    :disabled="activating === period.id">
                                                <i v-if="activating === period.id" class="fas fa-spinner fa-spin"></i>
                                                <i v-else class="fas fa-play"></i>
                                            </button>
                                            
                                            <!-- Editar (se não ativo) -->
                                            <button v-if="period.status !== 'ativo'" 
                                                    class="btn btn-sm btn-outline-warning"
                                                    @click="editPeriod(period)"
                                                    title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            
                                            <!-- Excluir (se planejamento) -->
                                            <button v-if="period.status === 'planejamento'" 
                                                    class="btn btn-sm btn-outline-danger"
                                                    @click="deletePeriod(period)"
                                                    title="Excluir">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                
                                <tr v-if="periods.length === 0">
                                    <td colspan="7" class="text-center py-4">
                                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">Nenhum período eleitoral encontrado</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Paginação -->
                        <nav v-if="pagination.total > pagination.per_page" aria-label="Navegação de páginas">
                            <pagination
                                :data="pagination"
                                @pagination-change-page="loadPeriods">
                            </pagination>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal Criar/Editar Período -->
<div class="modal fade" id="createPeriodModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    {{ editingPeriod ? 'Editar Período' : 'Novo Período' }} Eleitoral
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            
            <form @submit.prevent="savePeriod">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="periodName" class="form-label">Nome *</label>
                            <input type="text" id="periodName" class="form-control"
                                   v-model="periodForm.nome"
                                   :class="{ 'is-invalid': errors.nome }"
                                   required>
                            <div v-if="errors.nome" class="invalid-feedback">{{ errors.nome[0] }}</div>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="periodType" class="form-label">Tipo *</label>
                            <select id="periodType" class="form-select"
                                    v-model="periodForm.tipo_eleicao"
                                    :class="{ 'is-invalid': errors.tipo_eleicao }"
                                    required>
                                <option value="">Selecione</option>
                                <option value="nacional">Nacional</option>
                                <option value="estadual">Estadual</option>
                                <option value="federal">Federal</option>
                            </select>
                            <div v-if="errors.tipo_eleicao" class="invalid-feedback">{{ errors.tipo_eleicao[0] }}</div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <label for="startDate" class="form-label">Data Início *</label>
                            <input type="date" id="startDate" class="form-control"
                                   v-model="periodForm.data_inicio"
                                   :class="{ 'is-invalid': errors.data_inicio }"
                                   required>
                            <div v-if="errors.data_inicio" class="invalid-feedback">{{ errors.data_inicio[0] }}</div>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="endDate" class="form-label">Data Fim *</label>
                            <input type="date" id="endDate" class="form-control"
                                   v-model="periodForm.data_fim"
                                   :class="{ 'is-invalid': errors.data_fim }"
                                   required>
                            <div v-if="errors.data_fim" class="invalid-feedback">{{ errors.data_fim[0] }}</div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <label for="periodStatus" class="form-label">Status *</label>
                            <select id="periodStatus" class="form-select"
                                    v-model="periodForm.status"
                                    :class="{ 'is-invalid': errors.status }"
                                    required>
                                <option value="planejamento">Planejamento</option>
                                <option value="ativo" :disabled="!canActivate">Ativo</option>
                                <option value="encerrado">Encerrado</option>
                            </select>
                            <div v-if="errors.status" class="invalid-feedback">{{ errors.status[0] }}</div>
                            <small class="form-text text-muted">
                                Períodos ativos são exclusivos - apenas um pode estar ativo por vez
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="saving">
                        <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                        {{ editingPeriod ? 'Atualizar' : 'Criar' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
const { createApp } = Vue;

createApp({
    data() {
        return {
            periods: [],
            pagination: {},
            loading: false,
            saving: false,
            activating: null,
            editingPeriod: null,
            filters: {
                status: '',
                type: '',
                search: ''
            },
            periodForm: {
                nome: '',
                tipo_eleicao: '',
                data_inicio: '',
                data_fim: '',
                status: 'planejamento'
            },
            errors: {},
            canActivate: true,
            searchTimeout: null
        }
    },
    
    mounted() {
        this.loadPeriods();
    },
    
    methods: {
        async loadPeriods(page = 1) {
            this.loading = true;
            
            try {
                const response = await axios.get('/api/electoral/periods', {
                    params: {
                        page: page,
                        per_page: 15,
                        ...this.filters
                    }
                });
                
                this.periods = response.data.data.data;
                this.pagination = {
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    per_page: response.data.data.per_page,
                    total: response.data.data.total
                };
                
            } catch (error) {
                this.$toast.error('Erro ao carregar períodos eleitorais');
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        
        async activatePeriod(period) {
            if (!confirm(`Deseja ativar o período "${period.nome}"?\n\nIsto desativará todos os outros períodos.`)) {
                return;
            }
            
            this.activating = period.id;
            
            try {
                await axios.post(`/api/electoral/periods/${period.id}/activate`);
                this.$toast.success('Período ativado com sucesso');
                this.loadPeriods();
                
            } catch (error) {
                this.$toast.error('Erro ao ativar período: ' + (error.response?.data?.message || error.message));
            } finally {
                this.activating = null;
            }
        },
        
        editPeriod(period) {
            this.editingPeriod = period.id;
            this.periodForm = { ...period };
            this.errors = {};
            
            // Abre modal
            const modal = new bootstrap.Modal(document.getElementById('createPeriodModal'));
            modal.show();
        },
        
        async savePeriod() {
            this.saving = true;
            this.errors = {};
            
            try {
                if (this.editingPeriod) {
                    await axios.put(`/api/electoral/periods/${this.editingPeriod}`, this.periodForm);
                    this.$toast.success('Período atualizado com sucesso');
                } else {
                    await axios.post('/api/electoral/periods', this.periodForm);
                    this.$toast.success('Período criado com sucesso');
                }
                
                // Fecha modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('createPeriodModal'));
                modal.hide();
                
                this.resetForm();
                this.loadPeriods();
                
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {};
                } else {
                    this.$toast.error('Erro ao salvar período: ' + (error.response?.data?.message || error.message));
                }
            } finally {
                this.saving = false;
            }
        },
        
        async deletePeriod(period) {
            if (!confirm(`Deseja excluir o período "${period.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
                return;
            }
            
            try {
                await axios.delete(`/api/electoral/periods/${period.id}`);
                this.$toast.success('Período excluído com sucesso');
                this.loadPeriods();
                
            } catch (error) {
                this.$toast.error('Erro ao excluir período: ' + (error.response?.data?.message || error.message));
            }
        },
        
        viewPeriod(period) {
            // Implementar modal de visualização
            console.log('View period:', period);
        },
        
        resetForm() {
            this.editingPeriod = null;
            this.periodForm = {
                nome: '',
                tipo_eleicao: '',
                data_inicio: '',
                data_fim: '',
                status: 'planejamento'
            };
            this.errors = {};
        },
        
        clearFilters() {
            this.filters = {
                status: '',
                type: '',
                search: ''
            };
            this.loadPeriods();
        },
        
        debounceSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.loadPeriods();
            }, 500);
        },
        
        getStatusBadgeClass(status) {
            const classes = {
                'planejamento': 'bg-warning',
                'ativo': 'bg-success',
                'encerrado': 'bg-secondary'
            };
            return classes[status] || 'bg-light';
        },
        
        getTypeBadgeClass(type) {
            const classes = {
                'nacional': 'bg-primary',
                'estadual': 'bg-info',
                'federal': 'bg-dark'
            };
            return classes[type] || 'bg-light';
        }
    },
    
    filters: {
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('pt-BR');
        },
        
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
}).mount('#app');
</script>
@endsection