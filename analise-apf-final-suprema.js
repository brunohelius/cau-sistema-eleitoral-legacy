#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class AnalisadorAPFSupremo {
    constructor() {
        this.basePath = '/Users/brunosouza/Development/AI POC/cau-sistema-eleitoral-legacy/extracted-backend';
        this.controllersPath = path.join(this.basePath, 'app/Http/Controllers');
        
        this.funcoes = {
            entradasExternas: [],
            saidasExternas: [],
            consultasExternas: []
        };
        
        this.entidades = [
            'Calendario', 'ChapaEleicao', 'Denuncia', 'Impugnacao', 'ImpugnacaoResultado',
            'Julgamento', 'JulgamentoFinal', 'JulgamentoImpugnacao', 'JulgamentoDenuncia',
            'JulgamentoRecurso', 'Recurso', 'RecursoImpugnacao', 'RecursoDenuncia',
            'MembroChapa', 'MembroComissao', 'Profissional', 'Conselheiro', 'Email',
            'Documento', 'Arquivo', 'Filial', 'Atividade', 'PedidoSubstituicao',
            'PedidoImpugnacao', 'SubstituicaoJulgamento', 'DefesaImpugnacao',
            'AlegacaoFinal', 'ParecerFinal', 'Substituicao', 'Contrarrazao'
        ];
    }

    analisarTodosControllers() {
        console.log('🔍 Analisando todos os controllers...');
        
        const controllers = fs.readdirSync(this.controllersPath)
            .filter(file => file.endsWith('.php') && file !== 'Controller.php');
        
        let totalMetodosAnalisados = 0;
        
        controllers.forEach(controllerFile => {
            console.log(`📂 Analisando ${controllerFile}...`);
            const controllerPath = path.join(this.controllersPath, controllerFile);
            const controllerContent = fs.readFileSync(controllerPath, 'utf8');
            const controllerName = controllerFile.replace('Controller.php', '');
            
            const metodos = this.extrairMetodosSimples(controllerContent);
            
            metodos.forEach(metodo => {
                totalMetodosAnalisados++;
                this.classificarFuncao(controllerName, metodo, controllerContent);
            });
        });
        
        console.log(`✅ ${totalMetodosAnalisados} métodos analisados em ${controllers.length} controllers`);
    }

    extrairMetodosSimples(content) {
        const metodos = [];
        const lines = content.split('\n');
        let currentMethod = null;
        let braceCount = 0;
        let methodBody = [];
        let inMethod = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Detectar início de método público
            const methodMatch = line.match(/public\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/);
            if (methodMatch && !line.includes('__construct')) {
                currentMethod = {
                    nome: methodMatch[1],
                    parametros: this.processarParametros(methodMatch[2]),
                    linha: i + 1
                };
                methodBody = [];
                braceCount = 0;
                inMethod = false;
            }
            
            if (currentMethod) {
                methodBody.push(line);
                
                // Contar chaves para determinar fim do método
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                
                if (openBraces > 0 && !inMethod) {
                    inMethod = true;
                }
                
                if (inMethod) {
                    braceCount += openBraces - closeBraces;
                    
                    if (braceCount === 0 && openBraces === 0 && closeBraces > 0) {
                        currentMethod.corpo = methodBody.join('\n');
                        metodos.push(currentMethod);
                        currentMethod = null;
                        methodBody = [];
                    }
                }
            }
        }
        
        return metodos;
    }

    processarParametros(parametrosStr) {
        if (!parametrosStr || !parametrosStr.trim()) return [];
        
        return parametrosStr.split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);
    }

    classificarFuncao(controller, metodo, controllerContent) {
        const nomeCompleto = `${controller}.${metodo.nome}`;
        
        const analise = {
            nome: nomeCompleto,
            controller,
            metodo: metodo.nome,
            parametros: metodo.parametros,
            alrsReferenciados: this.identificarALRs(metodo.corpo || ''),
            derEntrada: metodo.parametros.length,
            derSaida: this.calcularDERSaida(metodo.corpo || ''),
            linhas: (metodo.corpo || '').split('\n').length
        };

        // Classificação por tipo de função
        if (this.isEntradaExterna(metodo, controllerContent)) {
            analise.tipo = 'EE';
            analise.descricao = this.gerarDescricaoEE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeEE(analise);
            analise.pontosFuncao = this.calcularPontosEE(analise.complexidade);
            this.funcoes.entradasExternas.push(analise);
            
        } else if (this.isSaidaExterna(metodo, controllerContent)) {
            analise.tipo = 'SE';
            analise.descricao = this.gerarDescricaoSE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeSE(analise);
            analise.pontosFuncao = this.calcularPontosSE(analise.complexidade);
            this.funcoes.saidasExternas.push(analise);
            
        } else {
            analise.tipo = 'CE';
            analise.descricao = this.gerarDescricaoCE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeCE(analise);
            analise.pontosFuncao = this.calcularPontosCE(analise.complexidade);
            this.funcoes.consultasExternas.push(analise);
        }
    }

    isEntradaExterna(metodo, controllerContent) {
        const entradasPatterns = [
            'store', 'create', 'save', 'insert', 'add', 'update', 'edit', 'alterar',
            'cadastrar', 'incluir', 'excluir', 'delete', 'destroy', 'salvar',
            'aceitar', 'rejeitar', 'aprovar', 'concluir', 'finalizar', 'inativar',
            'confirmar', 'processar', 'enviar', 'upload', 'post', 'put', 'patch'
        ];
        
        const metodoLower = metodo.nome.toLowerCase();
        const corpoLower = (metodo.corpo || '').toLowerCase();
        
        return entradasPatterns.some(pattern => metodoLower.includes(pattern)) ||
               corpoLower.includes('save(') || 
               corpoLower.includes('persist(') ||
               corpoLower.includes('->store(') ||
               corpoLower.includes('insert') ||
               corpoLower.includes('->create(');
    }

    isSaidaExterna(metodo, controllerContent) {
        const saidasPatterns = [
            'export', 'download', 'print', 'generate', 'gerar', 'report', 'pdf', 
            'excel', 'csv', 'xml', 'relatorio', 'extrair', 'imprimir', 'termo', 
            'diploma', 'certidao', 'declaracao', 'documento', 'doc'
        ];
        
        const metodoLower = metodo.nome.toLowerCase();
        const corpoLower = (metodo.corpo || '').toLowerCase();
        
        return saidasPatterns.some(pattern => metodoLower.includes(pattern)) ||
               corpoLower.includes('pdf') ||
               corpoLower.includes('excel') ||
               corpoLower.includes('->download') ||
               corpoLower.includes('response()->download') ||
               corpoLower.includes('mpdf') ||
               corpoLower.includes('dompdf');
    }

    identificarALRs(corpo) {
        const alrs = new Set();
        
        this.entidades.forEach(entidade => {
            const regex = new RegExp(`\\b${entidade}\\b`, 'gi');
            if (regex.test(corpo)) {
                alrs.add(entidade);
            }
        });
        
        // Buscar por patterns de banco de dados
        const patterns = [
            /from\s+(\w+)/gi,
            /join\s+(\w+)/gi,
            /->(\w+)\(\)/gi,
            /app\(\)->make\((\w+)/gi
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(corpo)) !== null) {
                if (match[1] && match[1].length > 2) {
                    alrs.add(match[1]);
                }
            }
        });
        
        return Array.from(alrs).slice(0, 10); // Limitar para evitar excessos
    }

    calcularDERSaida(corpo) {
        let der = 5; // Valor base
        
        // Padrões que indicam mais elementos de dados
        const patterns = [
            /return\s*\[/gi,
            /response\(\)/gi,
            /json\(/gi,
            /->select\(/gi,
            /->get\(/gi,
            /->toArray\(/gi
        ];
        
        patterns.forEach(pattern => {
            const matches = corpo.match(pattern) || [];
            der += matches.length * 2;
        });
        
        // Contar campos potenciais em arrays/objetos
        const fieldMatches = corpo.match(/['"][a-zA-Z_][a-zA-Z0-9_]*['"](\s*=>|\s*:)/g) || [];
        der += fieldMatches.length;
        
        return Math.min(der, 50); // Limitar máximo
    }

    calcularComplexidadeEE(analise) {
        const der = analise.derEntrada + 3; // Base mínima
        const alr = Math.max(analise.alrsReferenciados.length, 1);
        
        if (der <= 4 && alr <= 1) return 'Baixa';
        if (der <= 15 && alr <= 2) return 'Baixa';
        if (der > 15 && alr <= 2) return 'Média';
        if (alr > 2) return 'Alta';
        
        return 'Média';
    }

    calcularComplexidadeSE(analise) {
        const der = analise.derSaida;
        const alr = Math.max(analise.alrsReferenciados.length, 1);
        
        if (der <= 5 && alr <= 1) return 'Baixa';
        if (der <= 19 && alr <= 2) return 'Baixa';
        if (der > 19 && alr <= 2) return 'Média';
        if (alr > 2) return 'Alta';
        
        return 'Média';
    }

    calcularComplexidadeCE(analise) {
        const der = analise.derSaida;
        const alr = Math.max(analise.alrsReferenciados.length, 1);
        
        if (der <= 5 && alr <= 1) return 'Baixa';
        if (der <= 19 && alr <= 3) return 'Baixa';
        if (der > 19 && alr <= 3) return 'Média';
        if (alr > 3) return 'Alta';
        
        return 'Média';
    }

    calcularPontosEE(complexidade) {
        const pontos = { 'Baixa': 3, 'Média': 4, 'Alta': 6 };
        return pontos[complexidade] || 3;
    }

    calcularPontosSE(complexidade) {
        const pontos = { 'Baixa': 4, 'Média': 5, 'Alta': 7 };
        return pontos[complexidade] || 4;
    }

    calcularPontosCE(complexidade) {
        const pontos = { 'Baixa': 3, 'Média': 4, 'Alta': 6 };
        return pontos[complexidade] || 3;
    }

    gerarDescricaoEE(controller, metodo) {
        const patterns = {
            'store': 'Cadastra novo registro',
            'create': 'Cria novo registro',
            'save': 'Salva dados',
            'update': 'Atualiza registro',
            'delete': 'Remove registro',
            'upload': 'Faz upload de arquivo',
            'confirmar': 'Confirma operação'
        };

        for (const [pattern, desc] of Object.entries(patterns)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Processamento de entrada - ${this.formatarNomeModulo(controller)}`;
    }

    gerarDescricaoSE(controller, metodo) {
        const patterns = {
            'export': 'Exporta dados',
            'download': 'Faz download',
            'print': 'Imprime documento',
            'pdf': 'Gera PDF',
            'excel': 'Gera planilha Excel',
            'relatorio': 'Gera relatório'
        };

        for (const [pattern, desc] of Object.entries(patterns)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Geração de saída - ${this.formatarNomeModulo(controller)}`;
    }

    gerarDescricaoCE(controller, metodo) {
        const patterns = {
            'get': 'Obtém dados',
            'show': 'Exibe detalhes', 
            'index': 'Lista registros',
            'search': 'Busca registros',
            'find': 'Localiza registro',
            'consultar': 'Consulta dados',
            'listar': 'Lista dados',
            'filtro': 'Filtra dados'
        };

        for (const [pattern, desc] of Object.entries(patterns)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Consulta dados - ${this.formatarNomeModulo(controller)}`;
    }

    formatarNomeModulo(controller) {
        return controller.replace(/([A-Z])/g, ' $1').trim();
    }

    agruparPorModulo() {
        const modulos = {};
        
        [...this.funcoes.entradasExternas, ...this.funcoes.saidasExternas, ...this.funcoes.consultasExternas]
            .forEach(funcao => {
                const modulo = this.identificarModulo(funcao.controller);
                if (!modulos[modulo]) {
                    modulos[modulo] = { ee: 0, se: 0, ce: 0, pontos: 0, funcoes: [] };
                }
                
                modulos[modulo].funcoes.push(funcao);
                modulos[modulo].pontos += funcao.pontosFuncao;
                
                if (funcao.tipo === 'EE') modulos[modulo].ee++;
                else if (funcao.tipo === 'SE') modulos[modulo].se++;
                else if (funcao.tipo === 'CE') modulos[modulo].ce++;
            });

        return modulos;
    }

    identificarModulo(controller) {
        const modulos = {
            'Calendario': 'Gestão de Calendário Eleitoral',
            'AtividadePrincipal': 'Atividades do Calendário',
            'AtividadeSecundaria': 'Atividades do Calendário',
            'Chapa': 'Gestão de Chapas e Candidaturas',
            'MembroChapa': 'Gestão de Membros de Chapa',
            'MembroComissao': 'Gestão de Membros de Comissão',
            'Denuncia': 'Sistema de Denúncias',
            'Impugnacao': 'Sistema de Impugnações',
            'Julgamento': 'Sistema de Julgamentos',
            'Recurso': 'Sistema de Recursos',
            'Substituicao': 'Sistema de Substituições',
            'PedidoImpugnacao': 'Pedidos de Impugnação',
            'PedidoSubstituicao': 'Pedidos de Substituição',
            'DefesaImpugnacao': 'Defesas de Impugnação',
            'AlegacaoFinal': 'Alegações Finais',
            'Contrarrazao': 'Contrarrazões',
            'ParecerFinal': 'Pareceres Finais',
            'Profissional': 'Gestão de Profissionais',
            'Conselheiro': 'Gestão de Conselheiros',
            'Documento': 'Gestão Documental',
            'Arquivo': 'Gerenciamento de Arquivos',
            'CabecalhoEmail': 'Sistema de Comunicação',
            'CorpoEmail': 'Sistema de Comunicação',
            'EmailAtividade': 'Sistema de Comunicação',
            'Filial': 'Gestão de Unidades',
            'InformacaoComissao': 'Informações de Comissão',
            'Historico': 'Controle Histórico',
            'Parametro': 'Configurações do Sistema',
            'TermoDePosse': 'Documentos Oficiais',
            'DiplomaEleitoral': 'Documentos Oficiais',
            'PublicacaoDocumento': 'Publicações',
            'TipoFinalizacao': 'Configurações',
            'Auth': 'Autenticação e Autorização'
        };

        for (const [key, modulo] of Object.entries(modulos)) {
            if (controller.includes(key)) {
                return modulo;
            }
        }
        return 'Outros Módulos';
    }

    gerarResumo() {
        const ee = this.funcoes.entradasExternas;
        const se = this.funcoes.saidasExternas;
        const ce = this.funcoes.consultasExternas;

        return {
            totalEE: ee.length,
            totalSE: se.length,
            totalCE: ce.length,
            pontosEE: ee.reduce((sum, f) => sum + f.pontosFuncao, 0),
            pontosSE: se.reduce((sum, f) => sum + f.pontosFuncao, 0),
            pontosCE: ce.reduce((sum, f) => sum + f.pontosFuncao, 0),
            pontosTotal: 0
        };
    }

    gerarRelatorioFinal() {
        const resumo = this.gerarResumo();
        resumo.pontosTotal = resumo.pontosEE + resumo.pontosSE + resumo.pontosCE;
        const modulos = this.agruparPorModulo();

        const relatorio = `
# 📊 ANÁLISE COMPLETA DE PONTOS DE FUNÇÃO (APF)
## Sistema Eleitoral CAU - Legacy PHP

**Data da Análise:** ${new Date().toLocaleDateString('pt-BR')}  
**Metodologia:** Análise de Pontos de Função (APF) segundo IFPUG  
**Sistema Analisado:** CAU Sistema Eleitoral Legacy (PHP/Lumen)

---

## 🎯 RESUMO EXECUTIVO

### Contagem Total de Funções Transacionais:
- **📥 Entradas Externas (EE)**: ${resumo.totalEE} funções ➜ **${resumo.pontosEE} PF**
- **📤 Saídas Externas (SE)**: ${resumo.totalSE} funções ➜ **${resumo.pontosSE} PF**
- **🔍 Consultas Externas (CE)**: ${resumo.totalCE} funções ➜ **${resumo.pontosCE} PF**

### **🏆 TOTAL GERAL: ${resumo.pontosTotal} PONTOS DE FUNÇÃO TRANSACIONAIS**

---

## 📈 DISTRIBUIÇÃO POR COMPLEXIDADE

### Entradas Externas (EE):
${this.analisarComplexidadePorTipo(this.funcoes.entradasExternas)}

### Saídas Externas (SE):
${this.analisarComplexidadePorTipo(this.funcoes.saidasExternas)}

### Consultas Externas (CE):
${this.analisarComplexidadePorTipo(this.funcoes.consultasExternas)}

---

## 🏗️ ANÁLISE POR MÓDULOS FUNCIONAIS

${Object.entries(modulos)
    .sort((a, b) => b[1].pontos - a[1].pontos)
    .map(([modulo, dados], index) => `
### ${index + 1}. ${modulo}
- **📊 Funções**: EE: ${dados.ee} | SE: ${dados.se} | CE: ${dados.ce} | **Total**: ${dados.ee + dados.se + dados.ce}
- **🎯 Pontos de Função**: **${dados.pontos} PF** (${((dados.pontos / resumo.pontosTotal) * 100).toFixed(1)}% do total)
- **📋 Principais Funções**:
${dados.funcoes
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 5)
    .map(f => `  - ${f.nome} (${f.pontosFuncao} PF - ${f.complexidade})`)
    .join('\n')}
`).join('')}

---

## 🔍 TOP 15 FUNÇÕES MAIS COMPLEXAS

### 🥇 Entradas Externas (EE):
${this.funcoes.entradasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 5)
    .map((func, index) => `${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)\n   📝 ${func.descricao}`)
    .join('\n\n')}

### 🥈 Saídas Externas (SE):
${this.funcoes.saidasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 5)
    .map((func, index) => `${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)\n   📝 ${func.descricao}`)
    .join('\n\n')}

### 🥉 Consultas Externas (CE):
${this.funcoes.consultasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 5)
    .map((func, index) => `${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)\n   📝 ${func.descricao}`)
    .join('\n\n')}

---

## 📋 LISTAGEM COMPLETA DAS FUNÇÕES

### 📥 ENTRADAS EXTERNAS (${this.funcoes.entradasExternas.length} funções)

${this.funcoes.entradasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .map((func, index) => `
**${index + 1}. ${func.nome}**
- **Complexidade**: ${func.complexidade} (${func.pontosFuncao} PF)
- **Descrição**: ${func.descricao}  
- **ALRs Referenciados**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.slice(0, 5).join(', ')}${func.alrsReferenciados.length > 5 ? '...' : ''})
- **DER Entrada**: ${func.derEntrada}
`)
    .join('')}

### 📤 SAÍDAS EXTERNAS (${this.funcoes.saidasExternas.length} funções)

${this.funcoes.saidasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .map((func, index) => `
**${index + 1}. ${func.nome}**
- **Complexidade**: ${func.complexidade} (${func.pontosFuncao} PF)
- **Descrição**: ${func.descricao}
- **ALRs Referenciados**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.slice(0, 5).join(', ')}${func.alrsReferenciados.length > 5 ? '...' : ''})
- **DER Saída**: ${func.derSaida}
`)
    .join('')}

### 🔍 CONSULTAS EXTERNAS (${this.funcoes.consultasExternas.length} funções)

${this.funcoes.consultasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 30)
    .map((func, index) => `
**${index + 1}. ${func.nome}**
- **Complexidade**: ${func.complexidade} (${func.pontosFuncao} PF)
- **Descrição**: ${func.descricao}
- **ALRs Referenciados**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.slice(0, 3).join(', ')}${func.alrsReferenciados.length > 3 ? '...' : ''})
- **DER Saída**: ${func.derSaida}
`)
    .join('')}

${this.funcoes.consultasExternas.length > 30 ? `\n*... e mais ${this.funcoes.consultasExternas.length - 30} consultas externas de menor complexidade*\n` : ''}

---

## 📊 ESTATÍSTICAS E MÉTRICAS

### Distribuição Geral por Complexidade:
- **🟢 Baixa**: ${this.contarPorComplexidade('Baixa')} funções (${this.pontosPorComplexidade('Baixa')} PF - ${((this.pontosPorComplexidade('Baixa') / resumo.pontosTotal) * 100).toFixed(1)}%)
- **🟡 Média**: ${this.contarPorComplexidade('Média')} funções (${this.pontosPorComplexidade('Média')} PF - ${((this.pontosPorComplexidade('Média') / resumo.pontosTotal) * 100).toFixed(1)}%)
- **🔴 Alta**: ${this.contarPorComplexidade('Alta')} funções (${this.pontosPorComplexidade('Alta')} PF - ${((this.pontosPorComplexidade('Alta') / resumo.pontosTotal) * 100).toFixed(1)}%)

### Métricas de Qualidade:
- **Complexidade Média por Função**: ${(resumo.pontosTotal / (resumo.totalEE + resumo.totalSE + resumo.totalCE)).toFixed(2)} PF
- **Módulo Mais Complexo**: ${this.obterModuloMaisComplexo(modulos)}
- **Taxa de Funções de Alta Complexidade**: ${((this.contarPorComplexidade('Alta') / (resumo.totalEE + resumo.totalSE + resumo.totalCE)) * 100).toFixed(1)}%

---

## 🎯 RECOMENDAÇÕES PARA MIGRAÇÃO

### Estratégia de Migração por Complexidade:

#### 🟢 Funções de BAIXA Complexidade (${this.contarPorComplexidade('Baixa')} funções):
- **Abordagem**: Migração direta e automatizada
- **Riscos**: Baixos
- **Estimativa**: ${Math.ceil(this.contarPorComplexidade('Baixa') * 0.4)} dias úteis
- **Recomendação**: Priorizar para liberação rápida de funcionalidades básicas

#### 🟡 Funções de MÉDIA Complexidade (${this.contarPorComplexidade('Média')} funções):
- **Abordagem**: Revisão detalhada e otimização durante migração
- **Riscos**: Médios - requer análise de regras de negócio
- **Estimativa**: ${Math.ceil(this.contarPorComplexidade('Média') * 0.8)} dias úteis  
- **Recomendação**: Revisar lógica de negócio e otimizar performance

#### 🔴 Funções de ALTA Complexidade (${this.contarPorComplexidade('Alta')} funções):
- **Abordagem**: Re-engenharia completa com refatoração
- **Riscos**: Altos - requer especialistas em domínio
- **Estimativa**: ${Math.ceil(this.contarPorComplexidade('Alta') * 1.5)} dias úteis
- **Recomendação**: Redesign de arquitetura e simplificação de fluxos

### **📅 ESTIMATIVA TOTAL DE MIGRAÇÃO: ${Math.ceil(this.contarPorComplexidade('Baixa') * 0.4 + this.contarPorComplexidade('Média') * 0.8 + this.contarPorComplexidade('Alta') * 1.5)} dias úteis**

### 🏆 Módulos Prioritários para Migração:
${Object.entries(modulos)
    .sort((a, b) => b[1].pontos - a[1].pontos)
    .slice(0, 6)
    .map((mod, index) => `${index + 1}. **${mod[0]}** - ${mod[1].pontos} PF (${mod[1].ee + mod[1].se + mod[1].ce} funções)
   - Impacto: ${mod[1].pontos > 100 ? 'CRÍTICO' : mod[1].pontos > 50 ? 'ALTO' : 'MÉDIO'}
   - Prioridade: ${index < 2 ? '🔴 ALTA' : index < 4 ? '🟡 MÉDIA' : '🟢 BAIXA'}`)
    .join('\n')}

---

## 📝 CONCLUSÕES E PRÓXIMOS PASSOS

### Principais Achados:
1. **Volume Total**: ${resumo.pontosTotal} PF transacionais identificados
2. **Complexidade Dominante**: ${this.obterComplexidadeDominante()}
3. **Módulo Crítico**: ${this.obterModuloMaisComplexo(modulos)} (maior concentração de funcionalidades)
4. **Distribuição**: ${((resumo.pontosCE / resumo.pontosTotal) * 100).toFixed(0)}% consultas, ${((resumo.pontosEE / resumo.pontosTotal) * 100).toFixed(0)}% entradas, ${((resumo.pontosSE / resumo.pontosTotal) * 100).toFixed(0)}% saídas

### Recomendações Estratégicas:
1. **Faseamento**: Iniciar pelos módulos de menor complexidade
2. **Arquitetura**: Implementar padrões modernos (CQRS, DDD)  
3. **Testes**: Cobertura mínima de 80% para funções críticas
4. **Performance**: Otimizar consultas complexas identificadas
5. **Documentação**: Mapear regras de negócio das funções de alta complexidade

---

**📋 Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}**  
**🔍 Metodologia**: Análise de Pontos de Função (APF) segundo IFPUG 4.3+  
**📊 Escopo**: ${resumo.totalEE + resumo.totalSE + resumo.totalCE} funções transacionais em ${Object.keys(modulos).length} módulos funcionais  
**⚡ Ferramenta**: Analisador APF Supremo v2.0
        `;

        return relatorio;
    }

    analisarComplexidadePorTipo(funcoes) {
        const grupos = { 'Baixa': [], 'Média': [], 'Alta': [] };
        
        funcoes.forEach(func => {
            if (grupos[func.complexidade]) {
                grupos[func.complexidade].push(func);
            }
        });

        return Object.entries(grupos)
            .map(([complexidade, funcs]) => 
                `- **${complexidade}**: ${funcs.length} funções (${funcs.reduce((sum, f) => sum + f.pontosFuncao, 0)} PF)`
            )
            .join('\n');
    }

    contarPorComplexidade(complexidade) {
        return [...this.funcoes.entradasExternas, ...this.funcoes.saidasExternas, ...this.funcoes.consultasExternas]
            .filter(f => f.complexidade === complexidade).length;
    }

    pontosPorComplexidade(complexidade) {
        return [...this.funcoes.entradasExternas, ...this.funcoes.saidasExternas, ...this.funcoes.consultasExternas]
            .filter(f => f.complexidade === complexidade)
            .reduce((sum, f) => sum + f.pontosFuncao, 0);
    }

    obterModuloMaisComplexo(modulos) {
        return Object.entries(modulos)
            .sort((a, b) => b[1].pontos - a[1].pontos)[0]?.[0] || 'N/A';
    }

    obterComplexidadeDominante() {
        const baixa = this.contarPorComplexidade('Baixa');
        const media = this.contarPorComplexidade('Média');
        const alta = this.contarPorComplexidade('Alta');
        
        if (baixa >= media && baixa >= alta) return 'Baixa';
        if (media >= alta) return 'Média';
        return 'Alta';
    }

    async executar() {
        console.log('🚀 Iniciando Análise APF Suprema - Sistema CAU Legacy PHP\n');
        
        try {
            this.analisarTodosControllers();
            
            const resumo = this.gerarResumo();
            resumo.pontosTotal = resumo.pontosEE + resumo.pontosSE + resumo.pontosCE;
            
            const relatorio = this.gerarRelatorioFinal();
            
            // Salvar relatório final
            const reportPath = path.join(this.basePath, '../ANALISE_APF_FUNCOES_TRANSACIONAIS_SISTEMA_LEGADO_PHP_COMPLETA_DEFINITIVA.md');
            fs.writeFileSync(reportPath, relatorio);
            
            // Salvar dados JSON
            const jsonData = {
                resumo,
                funcoes: this.funcoes,
                modulos: this.agruparPorModulo(),
                estatisticas: {
                    complexidadeBaixa: this.contarPorComplexidade('Baixa'),
                    complexidadeMedia: this.contarPorComplexidade('Média'), 
                    complexidadeAlta: this.contarPorComplexidade('Alta'),
                    pontosBaixa: this.pontosPorComplexidade('Baixa'),
                    pontosMedia: this.pontosPorComplexidade('Média'),
                    pontosAlta: this.pontosPorComplexidade('Alta')
                },
                timestamp: new Date().toISOString()
            };
            
            const jsonPath = path.join(this.basePath, '../analise-apf-completa-definitiva.json');
            fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
            
            console.log('\n✅ 🎉 ANÁLISE APF COMPLETA FINALIZADA COM SUCESSO! 🎉');
            console.log('\n📄 ARQUIVOS GERADOS:');
            console.log(`   📋 Relatório: ${reportPath}`);
            console.log(`   📊 Dados JSON: ${jsonPath}`);
            console.log('\n📈 RESULTADOS FINAIS:');
            console.log(`   📥 Entradas Externas: ${resumo.totalEE} funções (${resumo.pontosEE} PF)`);
            console.log(`   📤 Saídas Externas: ${resumo.totalSE} funções (${resumo.pontosSE} PF)`);
            console.log(`   🔍 Consultas Externas: ${resumo.totalCE} funções (${resumo.pontosCE} PF)`);
            console.log(`   🏆 TOTAL GERAL: ${resumo.pontosTotal} PONTOS DE FUNÇÃO TRANSACIONAIS`);
            console.log(`\n🎯 ESTIMATIVA DE MIGRAÇÃO: ${Math.ceil(this.contarPorComplexidade('Baixa') * 0.4 + this.contarPorComplexidade('Média') * 0.8 + this.contarPorComplexidade('Alta') * 1.5)} dias úteis`);
            
        } catch (error) {
            console.error('❌ ERRO DURANTE A ANÁLISE:', error);
            throw error;
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const analisador = new AnalisadorAPFSupremo();
    analisador.executar().catch(console.error);
}

module.exports = AnalisadorAPFSupremo;