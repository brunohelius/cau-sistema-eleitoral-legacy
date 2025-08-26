#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class AnalisadorAPFCompleto {
    constructor() {
        this.basePath = '/Users/brunosouza/Development/AI POC/cau-sistema-eleitoral-legacy/extracted-backend';
        this.controllersPath = path.join(this.basePath, 'app/Http/Controllers');
        this.routesPath = path.join(this.basePath, 'routes/web.php');
        
        this.funcoes = {
            entradasExternas: [],
            saidasExternas: [],
            consultasExternas: []
        };
        
        this.rotas = new Map();
        this.entidades = this.obterEntidades();
    }

    obterEntidades() {
        const entitiesPath = path.join(this.basePath, 'app/Entities');
        const entities = [];
        
        try {
            const files = fs.readdirSync(entitiesPath);
            files.forEach(file => {
                if (file.endsWith('.php') && file !== 'Entity.php') {
                    entities.push(file.replace('.php', ''));
                }
            });
        } catch (error) {
            console.log('Erro ao ler entidades:', error.message);
        }
        
        return entities;
    }

    analisarRotas() {
        console.log('📋 Analisando rotas...');
        
        try {
            const rotasContent = fs.readFileSync(this.routesPath, 'utf8');
            
            // Extrair rotas com regex mais abrangente
            const rotaRegex = /app\(\)->router->(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]\s*,\s*(?:\[[\s\S]*?'uses'\s*=>\s*)?['"]([^'"@]+)@([^'"]+)['"]/g;
            
            let match;
            while ((match = rotaRegex.exec(rotasContent)) !== null) {
                const [, method, route, controller, action] = match;
                const controllerName = controller.replace('Controller', '');
                const key = `${controllerName}.${action}`;
                
                this.rotas.set(key, {
                    method: method.toUpperCase(),
                    route,
                    controller: controllerName,
                    action,
                    isPublicRoute: this.isPublicRoute(rotasContent, match[0])
                });
            }
            
            console.log(`✅ ${this.rotas.size} rotas analisadas`);
        } catch (error) {
            console.error('❌ Erro ao analisar rotas:', error.message);
        }
    }

    isPublicRoute(rotasContent, rotaCompleta) {
        const index = rotasContent.indexOf(rotaCompleta);
        const beforeRoute = rotasContent.substring(0, index);
        const lastMiddleware = beforeRoute.lastIndexOf('app()->router->group(AppConfig::getMiddleware()');
        const lastPublicRoute = beforeRoute.lastIndexOf('/* Rotas públicas */');
        
        return lastPublicRoute > lastMiddleware;
    }

    analisarControllers() {
        console.log('🔍 Analisando controllers...');
        
        try {
            const controllers = fs.readdirSync(this.controllersPath)
                .filter(file => file.endsWith('.php') && file !== 'Controller.php');
            
            let totalMetodos = 0;
            
            controllers.forEach(controllerFile => {
                const controllerPath = path.join(this.controllersPath, controllerFile);
                const controllerContent = fs.readFileSync(controllerPath, 'utf8');
                const controllerName = controllerFile.replace('Controller.php', '');
                
                const metodos = this.extrairMetodos(controllerContent);
                
                metodos.forEach(metodo => {
                    totalMetodos++;
                    this.analisarMetodo(controllerName, metodo, controllerContent);
                });
            });
            
            console.log(`✅ ${totalMetodos} métodos analisados em ${controllers.length} controllers`);
        } catch (error) {
            console.error('❌ Erro ao analisar controllers:', error.message);
        }
    }

    extrairMetodos(content) {
        const metodos = [];
        
        // Regex mais robusta para capturar métodos PHP
        const metodosRegex = /public\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?::\s*[a-zA-Z\\|?]+\s*)?\{([\s\S]*?)\}\s*(?=public\s+function|$)/g;
        
        let match;
        while ((match = metodosRegex.exec(content)) !== null) {
            const [, nome, parametros, corpo] = match;
            
            if (nome !== '__construct' && nome !== '__destruct') {
                metodos.push({
                    nome,
                    parametros: this.processarParametros(parametros),
                    corpo,
                    linhas: corpo.split('\n').length
                });
            }
        }
        
        return metodos;
    }

    processarParametros(parametrosStr) {
        if (!parametrosStr.trim()) return [];
        
        return parametrosStr.split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);
    }

    analisarMetodo(controller, metodo, controllerContent) {
        const funcaoKey = `${controller}.${metodo.nome}`;
        const rota = this.rotas.get(funcaoKey);
        
        const analise = {
            nome: funcaoKey,
            controller,
            metodo: metodo.nome,
            parametros: metodo.parametros,
            linhas: metodo.linhas,
            rota: rota || null,
            alrsReferenciados: this.identificarALRs(metodo.corpo),
            derEntrada: metodo.parametros.length,
            derSaida: this.calcularDERSaida(metodo.corpo),
            isTransacional: true
        };

        // Classificação da função
        if (this.isEntradaExterna(metodo)) {
            analise.tipo = 'EE';
            analise.descricao = this.gerarDescricaoEE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeEE(analise);
            analise.pontosFuncao = this.calcularPontosEE(analise.complexidade);
            this.funcoes.entradasExternas.push(analise);
            
        } else if (this.isSaidaExterna(metodo)) {
            analise.tipo = 'SE';
            analise.descricao = this.gerarDescricaoSE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeSE(analise);
            analise.pontosFuncao = this.calcularPontosSE(analise.complexidade);
            this.funcoes.saidasExternas.push(analise);
            
        } else if (this.isConsultaExterna(metodo)) {
            analise.tipo = 'CE';
            analise.descricao = this.gerarDescricaoCE(controller, metodo);
            analise.complexidade = this.calcularComplexidadeCE(analise);
            analise.pontosFuncao = this.calcularPontosCE(analise.complexidade);
            this.funcoes.consultasExternas.push(analise);
        }
    }

    isEntradaExterna(metodo) {
        const entradasPatterns = [
            'store', 'create', 'save', 'insert', 'add', 'update', 'edit', 'alterar',
            'cadastrar', 'incluir', 'excluir', 'delete', 'destroy', 'post', 'put',
            'patch', 'upload', 'enviar', 'processar', 'confirmar', 'salvar',
            'aceitar', 'rejeitar', 'aprovar', 'concluir', 'finalizar', 'inativar'
        ];
        
        const metodoLower = metodo.nome.toLowerCase();
        const corpoLower = metodo.corpo.toLowerCase();
        
        const hasPattern = entradasPatterns.some(pattern => metodoLower.includes(pattern));
        const hasPersistence = corpoLower.includes('save(') || corpoLower.includes('persist(') || 
                             corpoLower.includes('insert') || corpoLower.includes('update');
        
        return hasPattern || hasPersistence;
    }

    isSaidaExterna(metodo) {
        const saidasPatterns = [
            'export', 'download', 'print', 'generate', 'report', 'pdf', 'excel', 
            'csv', 'xml', 'relatorio', 'extrair', 'gerar', 'imprimir', 'termo', 
            'diploma', 'certidao', 'declaracao', 'documento', 'doc'
        ];
        
        const metodoLower = metodo.nome.toLowerCase();
        const corpoLower = metodo.corpo.toLowerCase();
        
        const hasPattern = saidasPatterns.some(pattern => metodoLower.includes(pattern));
        const hasOutput = corpoLower.includes('pdf') || corpoLower.includes('excel') || 
                         corpoLower.includes('response()->download') || corpoLower.includes('return response');
        
        return hasPattern || hasOutput;
    }

    isConsultaExterna(metodo) {
        const consultasPatterns = [
            'index', 'show', 'get', 'list', 'search', 'find', 'consultar', 
            'listar', 'buscar', 'filtrar', 'pesquisar', 'visualizar', 
            'detalhar', 'acompanhar', 'verificar', 'validar', 'obter'
        ];
        
        const metodoLower = metodo.nome.toLowerCase();
        return consultasPatterns.some(pattern => metodoLower.includes(pattern)) && 
               !this.isSaidaExterna(metodo);
    }

    identificarALRs(corpo) {
        const alrs = new Set();
        
        // Buscar por nomes de entidades no código
        this.entidades.forEach(entidade => {
            const regex = new RegExp(`\\b${entidade}\\b`, 'gi');
            if (regex.test(corpo)) {
                alrs.add(entidade);
            }
        });
        
        // Buscar por patterns de relacionamento
        const relacionamentos = corpo.match(/with\s*\(\s*['"][^'"]+['"]/g);
        if (relacionamentos) {
            relacionamentos.forEach(rel => {
                const match = rel.match(/['"]([^'"]+)['"]/);
                if (match) {
                    alrs.add(match[1]);
                }
            });
        }
        
        return Array.from(alrs);
    }

    calcularDERSaida(corpo) {
        // Estimativa baseada em padrões comuns
        let der = 0;
        
        // Conta campos em selects
        const selectMatches = corpo.match(/select\s*\(/gi) || [];
        der += selectMatches.length * 5;
        
        // Conta returns
        const returnMatches = corpo.match(/return\s+/gi) || [];
        der += returnMatches.length * 3;
        
        // Conta arrays/objetos retornados
        const responseMatches = corpo.match(/response\(\)/gi) || [];
        der += responseMatches.length * 4;
        
        return Math.max(der, 3); // Mínimo 3 elementos
    }

    calcularComplexidadeEE(analise) {
        const der = analise.derEntrada;
        const alr = analise.alrsReferenciados.length;
        
        // Regras APF para EE
        if (der <= 4 && alr <= 1) return 'Baixa';
        if (der <= 15 && alr <= 2) return 'Baixa';
        if (der <= 4 && alr <= 2) return 'Baixa';
        
        if (der > 15 && alr === 1) return 'Média';
        if (der >= 5 && der <= 15 && alr === 2) return 'Média';
        if (der <= 4 && alr > 2) return 'Média';
        
        return 'Alta';
    }

    calcularComplexidadeSE(analise) {
        const der = analise.derSaida;
        const alr = analise.alrsReferenciados.length;
        
        // Regras APF para SE
        if (der <= 5 && alr <= 1) return 'Baixa';
        if (der <= 19 && alr <= 2) return 'Baixa';
        if (der <= 5 && alr <= 3) return 'Baixa';
        
        if (der > 19 && alr === 1) return 'Média';
        if (der >= 6 && der <= 19 && alr >= 2 && alr <= 3) return 'Média';
        if (der <= 5 && alr > 3) return 'Média';
        
        return 'Alta';
    }

    calcularComplexidadeCE(analise) {
        const der = analise.derSaida;
        const alr = analise.alrsReferenciados.length;
        
        // Regras APF para CE
        if (der <= 5 && alr <= 1) return 'Baixa';
        if (der <= 19 && alr <= 3) return 'Baixa';
        if (der <= 5 && alr <= 3) return 'Baixa';
        
        if (der > 19 && alr === 1) return 'Média';
        if (der >= 6 && der <= 19 && alr >= 2 && alr <= 3) return 'Média';
        if (der <= 5 && alr > 3) return 'Média';
        
        return 'Alta';
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
        const descricoes = {
            'store': 'Cadastra novo registro',
            'create': 'Cria novo registro',
            'save': 'Salva dados',
            'update': 'Atualiza registro',
            'delete': 'Remove registro',
            'upload': 'Faz upload de arquivo',
            'confirmar': 'Confirma operação',
            'processar': 'Processa dados'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Processamento de dados - ${this.formatarNomeModulo(controller)}`;
    }

    gerarDescricaoSE(controller, metodo) {
        const descricoes = {
            'export': 'Exporta dados',
            'download': 'Faz download',
            'print': 'Imprime documento', 
            'pdf': 'Gera PDF',
            'excel': 'Gera planilha Excel',
            'relatorio': 'Gera relatório',
            'documento': 'Gera documento'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Saída de dados - ${this.formatarNomeModulo(controller)}`;
    }

    gerarDescricaoCE(controller, metodo) {
        const descricoes = {
            'index': 'Lista registros',
            'show': 'Exibe detalhes',
            'get': 'Obtém dados',
            'search': 'Busca registros',
            'find': 'Localiza registro',
            'consultar': 'Consulta dados',
            'listar': 'Lista dados',
            'visualizar': 'Visualiza informações'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${this.formatarNomeModulo(controller)}`;
            }
        }

        return `Consulta dados - ${this.formatarNomeModulo(controller)}`;
    }

    formatarNomeModulo(controller) {
        // Converte nomes como "ChapaEleicao" para "Chapa Eleição"
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
            'Chapa': 'Gestão de Chapas e Candidaturas', 
            'Denuncia': 'Sistema de Denúncias',
            'Impugnacao': 'Sistema de Impugnações',
            'Julgamento': 'Sistema de Julgamentos',
            'Recurso': 'Sistema de Recursos',
            'Membro': 'Gestão de Membros',
            'Profissional': 'Gestão de Profissionais',
            'Conselheiro': 'Gestão de Conselheiros',
            'Email': 'Sistema de Comunicação',
            'Substituicao': 'Sistema de Substituições',
            'Documento': 'Gestão Documental',
            'Auth': 'Autenticação e Autorização',
            'Arquivo': 'Gerenciamento de Arquivos',
            'Filial': 'Gestão de Unidades',
            'Atividade': 'Atividades do Calendário'
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

    gerarRelatorioCompleto() {
        const resumo = this.gerarResumo();
        resumo.pontosTotal = resumo.pontosEE + resumo.pontosSE + resumo.pontosCE;
        
        const modulos = this.agruparPorModulo();

        const relatorio = `
# ANÁLISE COMPLETA APF - SISTEMA ELEITORAL CAU LEGACY PHP

**Data da Análise:** ${new Date().toLocaleDateString('pt-BR')}
**Sistema Analisado:** CAU Sistema Eleitoral Legacy (PHP/Lumen)

---

## 📊 RESUMO EXECUTIVO

### Contagem de Funções Transacionais:
- **Entradas Externas (EE)**: ${resumo.totalEE} funções (${resumo.pontosEE} PF)
- **Saídas Externas (SE)**: ${resumo.totalSE} funções (${resumo.pontosSE} PF)  
- **Consultas Externas (CE)**: ${resumo.totalCE} funções (${resumo.pontosCE} PF)

### **🎯 TOTAL PONTOS DE FUNÇÃO TRANSACIONAIS: ${resumo.pontosTotal} PF**

---

## 📈 ANÁLISE POR COMPLEXIDADE

### Entradas Externas (EE):
${this.analisarComplexidade(this.funcoes.entradasExternas)}

### Saídas Externas (SE):
${this.analisarComplexidade(this.funcoes.saidasExternas)}

### Consultas Externas (CE):
${this.analisarComplexidade(this.funcoes.consultasExternas)}

---

## 🏗️ ANÁLISE POR MÓDULOS FUNCIONAIS

${Object.entries(modulos)
    .sort((a, b) => b[1].pontos - a[1].pontos)
    .map(([modulo, dados]) => `
### ${modulo}
- **Funções**: EE: ${dados.ee} | SE: ${dados.se} | CE: ${dados.ce} | **Total**: ${dados.ee + dados.se + dados.ce}
- **Pontos de Função**: ${dados.pontos} PF
- **Percentual do Total**: ${((dados.pontos / resumo.pontosTotal) * 100).toFixed(1)}%
`).join('')}

---

## 🔍 TOP 20 FUNÇÕES MAIS COMPLEXAS

### Entradas Externas (EE):
${this.listarTopFuncoes(this.funcoes.entradasExternas, 10)}

### Saídas Externas (SE):  
${this.listarTopFuncoes(this.funcoes.saidasExternas, 10)}

### Consultas Externas (CE):
${this.listarTopFuncoes(this.funcoes.consultasExternas, 10)}

---

## 📋 DETALHAMENTO COMPLETO DAS FUNÇÕES

### ENTRADAS EXTERNAS (${this.funcoes.entradasExternas.length} funções):

${this.funcoes.entradasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .map((func, index) => `
${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)
   - **Descrição**: ${func.descricao}
   - **ALRs**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.join(', ') || 'N/A'})
   - **DER Entrada**: ${func.derEntrada}
   - **Rota**: ${func.rota ? `${func.rota.method} ${func.rota.route}` : 'N/A'}
`).join('')}

### SAÍDAS EXTERNAS (${this.funcoes.saidasExternas.length} funções):

${this.funcoes.saidasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .map((func, index) => `
${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)
   - **Descrição**: ${func.descricao}
   - **ALRs**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.join(', ') || 'N/A'})
   - **DER Saída**: ${func.derSaida}
   - **Rota**: ${func.rota ? `${func.rota.method} ${func.rota.route}` : 'N/A'}
`).join('')}

### CONSULTAS EXTERNAS (${this.funcoes.consultasExternas.length} funções):

${this.funcoes.consultasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 50) // Limitar para não ficar muito grande
    .map((func, index) => `
${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)
   - **Descrição**: ${func.descricao}
   - **ALRs**: ${func.alrsReferenciados.length} (${func.alrsReferenciados.join(', ') || 'N/A'})
   - **DER Saída**: ${func.derSaida}
   - **Rota**: ${func.rota ? `${func.rota.method} ${func.rota.route}` : 'N/A'}
`).join('')}

${this.funcoes.consultasExternas.length > 50 ? `\n*... e mais ${this.funcoes.consultasExternas.length - 50} consultas externas*` : ''}

---

## 📊 ESTATÍSTICAS DETALHADAS

### Distribuição por Complexidade:
- **Baixa**: ${this.contarPorComplexidade('Baixa')} funções (${this.pontosPorComplexidade('Baixa')} PF)
- **Média**: ${this.contarPorComplexidade('Média')} funções (${this.pontosPorComplexidade('Média')} PF)  
- **Alta**: ${this.contarPorComplexidade('Alta')} funções (${this.pontosPorComplexidade('Alta')} PF)

### Métricas de Qualidade:
- **Complexidade Média**: ${this.calcularComplexidadeMedia().toFixed(2)} PF por função
- **Módulo Mais Complexo**: ${this.obterModuloMaisComplexo(modulos)}
- **Taxa de Funções Complexas**: ${this.calcularTaxaComplexas().toFixed(1)}%

---

## 🎯 RECOMENDAÇÕES PARA MIGRAÇÃO

### Priorização por Complexidade:
1. **Funções de BAIXA complexidade (${this.contarPorComplexidade('Baixa')} funções)**: 
   - Migração direta e automatizada
   - Estimativa: ${Math.ceil(this.contarPorComplexidade('Baixa') * 0.3)} dias

2. **Funções de MÉDIA complexidade (${this.contarPorComplexidade('Média')} funções)**:
   - Revisão e otimização durante migração  
   - Estimativa: ${Math.ceil(this.contarPorComplexidade('Média') * 0.6)} dias

3. **Funções de ALTA complexidade (${this.contarPorComplexidade('Alta')} funções)**:
   - Re-engenharia e refatoração completa
   - Estimativa: ${Math.ceil(this.contarPorComplexidade('Alta') * 1.2)} dias

### **ESTIMATIVA TOTAL DE ESFORÇO: ${Math.ceil(this.contarPorComplexidade('Baixa') * 0.3 + this.contarPorComplexidade('Média') * 0.6 + this.contarPorComplexidade('Alta') * 1.2)} dias úteis**

### Módulos Críticos (por ordem de prioridade):
${Object.entries(modulos)
    .sort((a, b) => b[1].pontos - a[1].pontos)
    .slice(0, 5)
    .map((mod, index) => `${index + 1}. **${mod[0]}** (${mod[1].pontos} PF) - ${mod[1].ee + mod[1].se + mod[1].ce} funções`)
    .join('\n')}

---

**📋 Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}**
**🔍 Metodologia**: Análise de Pontos de Função (APF) baseada no IFPUG**
**📊 Total de ${resumo.totalEE + resumo.totalSE + resumo.totalCE} funções transacionais analisadas**
        `;

        return relatorio;
    }

    analisarComplexidade(funcoes) {
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

    listarTopFuncoes(funcoes, limite) {
        return funcoes
            .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
            .slice(0, limite)
            .map((func, index) => 
                `${index + 1}. **${func.nome}** - ${func.complexidade} (${func.pontosFuncao} PF)`
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

    calcularComplexidadeMedia() {
        const total = [...this.funcoes.entradasExternas, ...this.funcoes.saidasExternas, ...this.funcoes.consultasExternas];
        const pontos = total.reduce((sum, f) => sum + f.pontosFuncao, 0);
        return pontos / total.length;
    }

    obterModuloMaisComplexo(modulos) {
        return Object.entries(modulos)
            .sort((a, b) => b[1].pontos - a[1].pontos)[0][0];
    }

    calcularTaxaComplexas() {
        const total = [...this.funcoes.entradasExternas, ...this.funcoes.saidasExternas, ...this.funcoes.consultasExternas];
        const complexas = total.filter(f => f.complexidade === 'Alta');
        return (complexas.length / total.length) * 100;
    }

    async executar() {
        console.log('🚀 Iniciando Análise APF Completa e Detalhada...\n');
        
        try {
            this.analisarRotas();
            this.analisarControllers();
            
            const relatorio = this.gerarRelatorioCompleto();
            const resumo = this.gerarResumo();
            resumo.pontosTotal = resumo.pontosEE + resumo.pontosSE + resumo.pontosCE;
            
            // Salvar relatório
            const reportPath = path.join(this.basePath, '../ANALISE_APF_SISTEMA_LEGADO_PHP_COMPLETA_FINAL.md');
            fs.writeFileSync(reportPath, relatorio);
            
            // Salvar dados em JSON
            const jsonData = {
                resumo,
                funcoes: this.funcoes,
                modulos: this.agruparPorModulo(),
                timestamp: new Date().toISOString()
            };
            
            const jsonPath = path.join(this.basePath, '../analise-apf-dados-completos.json');
            fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
            
            console.log('\n✅ Análise APF Completa Finalizada!');
            console.log(`📄 Relatório: ${reportPath}`);
            console.log(`📊 Dados JSON: ${jsonPath}`);
            console.log(`\n📈 RESULTADOS:`);
            console.log(`   - Entradas Externas: ${resumo.totalEE} (${resumo.pontosEE} PF)`);
            console.log(`   - Saídas Externas: ${resumo.totalSE} (${resumo.pontosSE} PF)`);
            console.log(`   - Consultas Externas: ${resumo.totalCE} (${resumo.pontosCE} PF)`);
            console.log(`   - TOTAL: ${resumo.pontosTotal} PF TRANSACIONAIS`);
            
        } catch (error) {
            console.error('❌ Erro durante análise:', error);
            throw error;
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const analisador = new AnalisadorAPFCompleto();
    analisador.executar().catch(console.error);
}

module.exports = AnalisadorAPFCompleto;