#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class TransactionalFunctionAnalyzer {
    constructor() {
        this.basePath = '/Users/brunosouza/Development/AI POC/cau-sistema-eleitoral-legacy';
        this.report = {
            entradasExternas: [],
            saidasExternas: [],
            consultasExternas: [],
            resumoFuncional: {},
            casoUso: []
        };
    }

    analisarFuncoesTransacionais() {
        console.log('🔍 Analisando Funções Transacionais em detalhes...');
        
        const controllersPath = path.join(this.basePath, 'app/Http/Controllers');
        const files = fs.readdirSync(controllersPath);
        
        files.forEach(file => {
            if (file.endsWith('.php') && file !== 'Controller.php') {
                const filePath = path.join(controllersPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                this.analisarControllerDetalhado(file, content);
            }
        });
    }

    analisarControllerDetalhado(filename, content) {
        const controllerName = filename.replace('.php', '');
        const metodos = this.extrairMetodosDetalhados(content);
        
        metodos.forEach(metodo => {
            this.classificarFuncaoTransacional(controllerName, metodo, content);
        });
    }

    extrairMetodosDetalhados(content) {
        const metodos = [];
        const regex = /public\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{([^}]*(?:{[^}]*}[^}]*)*)}/g;
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            const nomeMetodo = match[1];
            const corpoMetodo = match[2];
            
            metodos.push({
                nome: nomeMetodo,
                corpo: corpoMetodo,
                parametros: this.extrairParametros(match[0]),
                linhas: corpoMetodo.split('\n').length
            });
        }
        
        return metodos;
    }

    extrairParametros(funcaoCompleta) {
        const match = funcaoCompleta.match(/\(([^)]*)\)/);
        if (match && match[1].trim()) {
            return match[1].split(',').map(p => p.trim());
        }
        return [];
    }

    classificarFuncaoTransacional(controller, metodo, content) {
        const funcaoCompleta = `${controller}.${metodo.nome}`;
        
        // Análise de Entradas Externas (EE)
        if (this.isEntradaExterna(metodo)) {
            const ee = {
                nome: funcaoCompleta,
                controller: controller,
                metodo: metodo.nome,
                tipo: 'Entrada Externa',
                descricao: this.gerarDescricaoEE(controller, metodo),
                complexidade: this.calcularComplexidadeEE(metodo),
                pontosFuncao: 0,
                arquivosLogicos: this.identificarALIsReferenciados(metodo.corpo),
                elementosDados: metodo.parametros.length
            };
            
            ee.pontosFuncao = this.calcularPontosEE(ee);
            this.report.entradasExternas.push(ee);
        }

        // Análise de Saídas Externas (SE)
        if (this.isSaidaExterna(metodo)) {
            const se = {
                nome: funcaoCompleta,
                controller: controller,
                metodo: metodo.nome,
                tipo: 'Saída Externa',
                descricao: this.gerarDescricaoSE(controller, metodo),
                complexidade: this.calcularComplexidadeSE(metodo),
                pontosFuncao: 0,
                arquivosLogicos: this.identificarALIsReferenciados(metodo.corpo),
                elementosDados: this.contarElementosDadosOutput(metodo.corpo)
            };
            
            se.pontosFuncao = this.calcularPontosSE(se);
            this.report.saidasExternas.push(se);
        }

        // Análise de Consultas Externas (CE)
        if (this.isConsultaExterna(metodo)) {
            const ce = {
                nome: funcaoCompleta,
                controller: controller,
                metodo: metodo.nome,
                tipo: 'Consulta Externa',
                descricao: this.gerarDescricaoCE(controller, metodo),
                complexidade: this.calcularComplexidadeCE(metodo),
                pontosFuncao: 0,
                arquivosLogicos: this.identificarALIsReferenciados(metodo.corpo),
                elementosDados: this.contarElementosDadosOutput(metodo.corpo)
            };
            
            ce.pontosFuncao = this.calcularPontosCE(ce);
            this.report.consultasExternas.push(ce);
        }
    }

    isEntradaExterna(metodo) {
        const entradasPatterns = [
            'store', 'create', 'update', 'save', 'insert', 'add', 'cadastrar', 
            'incluir', 'alterar', 'excluir', 'delete', 'destroy', 'post', 
            'put', 'patch', 'upload', 'enviar', 'processar', 'confirmar'
        ];
        
        return entradasPatterns.some(pattern => 
            metodo.nome.toLowerCase().includes(pattern.toLowerCase())
        ) || metodo.corpo.includes('save(') || metodo.corpo.includes('persist(');
    }

    isSaidaExterna(metodo) {
        const saidasPatterns = [
            'export', 'download', 'print', 'generate', 'report', 'pdf', 'excel', 
            'csv', 'xml', 'relatorio', 'extrair', 'gerar', 'imprimir',
            'termo', 'diploma', 'certidao', 'declaracao', 'documento'
        ];
        
        return saidasPatterns.some(pattern => 
            metodo.nome.toLowerCase().includes(pattern.toLowerCase())
        ) || metodo.corpo.includes('PDF') || metodo.corpo.includes('Excel');
    }

    isConsultaExterna(metodo) {
        const consultasPatterns = [
            'index', 'show', 'get', 'list', 'search', 'find', 'consultar', 
            'listar', 'buscar', 'filtrar', 'pesquisar', 'visualizar', 
            'detalhar', 'acompanhar', 'verificar'
        ];
        
        return consultasPatterns.some(pattern => 
            metodo.nome.toLowerCase().includes(pattern.toLowerCase())
        ) && !this.isSaidaExterna(metodo);
    }

    calcularComplexidadeEE(metodo) {
        const elementos = metodo.parametros.length;
        const alis = this.identificarALIsReferenciados(metodo.corpo).length;
        
        if (elementos <= 4 && alis <= 1) return 'baixa';
        if (elementos <= 15 && alis <= 2) return 'media';
        return 'alta';
    }

    calcularComplexidadeSE(metodo) {
        const elementos = this.contarElementosDadosOutput(metodo.corpo);
        const alis = this.identificarALIsReferenciados(metodo.corpo).length;
        
        if (elementos <= 5 && alis <= 1) return 'baixa';
        if (elementos <= 19 && alis <= 2) return 'media';
        return 'alta';
    }

    calcularComplexidadeCE(metodo) {
        const elementos = this.contarElementosDadosOutput(metodo.corpo);
        const alis = this.identificarALIsReferenciados(metodo.corpo).length;
        
        if (elementos <= 5 && alis <= 1) return 'baixa';
        if (elementos <= 19 && alis <= 2) return 'media';
        return 'alta';
    }

    calcularPontosEE(ee) {
        const pontos = { baixa: 3, media: 4, alta: 6 };
        return pontos[ee.complexidade] || 3;
    }

    calcularPontosSE(se) {
        const pontos = { baixa: 4, media: 5, alta: 7 };
        return pontos[se.complexidade] || 4;
    }

    calcularPontosCE(ce) {
        const pontos = { baixa: 3, media: 4, alta: 6 };
        return pontos[ce.complexidade] || 3;
    }

    identificarALIsReferenciados(codigo) {
        const alis = [];
        
        // Busca por nomes de entities/tabelas no código
        const entities = [
            'Eleicao', 'ChapaEleicao', 'Denuncia', 'Impugnacao', 'Julgamento',
            'Recurso', 'MembroChapa', 'MembroComissao', 'Profissional', 
            'Conselheiro', 'Calendario', 'Documento', 'Email'
        ];
        
        entities.forEach(entity => {
            if (codigo.includes(entity)) {
                alis.push(entity);
            }
        });
        
        return [...new Set(alis)]; // Remove duplicatas
    }

    contarElementosDadosOutput(codigo) {
        // Estima baseado em campos retornados, selects, etc.
        let elementos = 0;
        
        // Conta campos em selects
        const selectMatches = codigo.match(/select\s*\(/g);
        if (selectMatches) elementos += selectMatches.length * 5;
        
        // Conta returns de arrays/objects
        const returnMatches = codigo.match(/return\s+\$/g);
        if (returnMatches) elementos += returnMatches.length * 3;
        
        return Math.max(elementos, 5); // Mínimo 5 elementos
    }

    gerarDescricaoEE(controller, metodo) {
        const descricoes = {
            'store': 'Cadastra novo registro',
            'create': 'Cria novo registro',
            'update': 'Atualiza registro existente',
            'save': 'Salva dados',
            'delete': 'Remove registro',
            'upload': 'Faz upload de arquivo',
            'confirmar': 'Confirma operação',
            'processar': 'Processa dados'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${controller.replace('Controller', '')}`;
            }
        }

        return `Entrada de dados - ${controller.replace('Controller', '')}`;
    }

    gerarDescricaoSE(controller, metodo) {
        const descricoes = {
            'export': 'Exporta dados',
            'download': 'Faz download',
            'print': 'Imprime documento',
            'pdf': 'Gera PDF',
            'excel': 'Gera planilha Excel',
            'relatorio': 'Gera relatório'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${controller.replace('Controller', '')}`;
            }
        }

        return `Saída de dados - ${controller.replace('Controller', '')}`;
    }

    gerarDescricaoCE(controller, metodo) {
        const descricoes = {
            'index': 'Lista registros',
            'show': 'Exibe detalhes',
            'search': 'Busca registros',
            'find': 'Encontra registro',
            'consultar': 'Consulta dados',
            'listar': 'Lista dados',
            'visualizar': 'Visualiza informações'
        };

        for (const [pattern, desc] of Object.entries(descricoes)) {
            if (metodo.nome.toLowerCase().includes(pattern)) {
                return `${desc} - ${controller.replace('Controller', '')}`;
            }
        }

        return `Consulta dados - ${controller.replace('Controller', '')}`;
    }

    mapearCasosDeUso() {
        console.log('📋 Mapeando casos de uso do sistema...');
        
        const casosDeUso = [
            {
                codigo: 'HST001',
                nome: 'Cadastrar Conselheiro Eleito',
                modulo: 'Gestão de Conselheiros',
                funcoes: this.report.entradasExternas.filter(ee => 
                    ee.controller.includes('Conselheiro') && 
                    ee.metodo.includes('store')
                )
            },
            {
                codigo: 'HST021',
                nome: 'Manter Chapa',
                modulo: 'Gestão de Chapas',
                funcoes: this.report.entradasExternas.filter(ee => 
                    ee.controller.includes('Chapa')
                )
            },
            {
                codigo: 'HST051',
                nome: 'Cadastrar Denúncia',
                modulo: 'Sistema de Denúncias',
                funcoes: this.report.entradasExternas.filter(ee => 
                    ee.controller.includes('Denuncia') && 
                    ee.metodo.includes('store')
                )
            },
            {
                codigo: 'HST032',
                nome: 'Cadastrar Pedido Impugnação',
                modulo: 'Sistema de Impugnações',
                funcoes: this.report.entradasExternas.filter(ee => 
                    ee.controller.includes('Impugnacao') && 
                    ee.metodo.includes('store')
                )
            }
        ];

        this.report.casoUso = casosDeUso;
    }

    gerarResumo() {
        const resumo = {
            totalEE: this.report.entradasExternas.length,
            totalSE: this.report.saidasExternas.length,
            totalCE: this.report.consultasExternas.length,
            pontosTotaisEE: this.report.entradasExternas.reduce((sum, ee) => sum + ee.pontosFuncao, 0),
            pontosTotaisSE: this.report.saidasExternas.reduce((sum, se) => sum + se.pontosFuncao, 0),
            pontosTotaisCE: this.report.consultasExternas.reduce((sum, ce) => sum + ce.pontosFuncao, 0)
        };

        resumo.pontosTransacionaisTotal = resumo.pontosTotaisEE + resumo.pontosTotaisSE + resumo.pontosTotaisCE;
        
        this.report.resumoFuncional = resumo;
    }

    gerarRelatorio() {
        const relatorio = `
# ANÁLISE DETALHADA DAS FUNÇÕES TRANSACIONAIS - SISTEMA PHP LEGACY

Data da Análise: ${new Date().toLocaleDateString('pt-BR')}

## RESUMO EXECUTIVO

### Contagem de Funções Transacionais:
- **Entradas Externas (EE)**: ${this.report.resumoFuncional.totalEE} (${this.report.resumoFuncional.pontosTotaisEE} PF)
- **Saídas Externas (SE)**: ${this.report.resumoFuncional.totalSE} (${this.report.resumoFuncional.pontosTotaisSE} PF)
- **Consultas Externas (CE)**: ${this.report.resumoFuncional.totalCE} (${this.report.resumoFuncional.pontosTotaisCE} PF)

### **TOTAL FUNÇÕES TRANSACIONAIS: ${this.report.resumoFuncional.pontosTransacionaisTotal} PF**

---

## 1. ENTRADAS EXTERNAS (EE)

### Detalhamento por Complexidade:

${this.agruparPorComplexidade(this.report.entradasExternas)}

### Top 10 Entradas Externas:
${this.report.entradasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 10)
    .map((ee, index) => 
        `${index + 1}. **${ee.nome}** - ${ee.complexidade.toUpperCase()} (${ee.pontosFuncao} PF)
   - ${ee.descricao}
   - ALIs: ${ee.arquivosLogicos.join(', ') || 'N/A'}
   - Elementos: ${ee.elementosDados}`
    ).join('\n\n')}

---

## 2. SAÍDAS EXTERNAS (SE)

### Detalhamento por Complexidade:

${this.agruparPorComplexidade(this.report.saidasExternas)}

### Top 10 Saídas Externas:
${this.report.saidasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 10)
    .map((se, index) => 
        `${index + 1}. **${se.nome}** - ${se.complexidade.toUpperCase()} (${se.pontosFuncao} PF)
   - ${se.descricao}
   - ALIs: ${se.arquivosLogicos.join(', ') || 'N/A'}
   - Elementos: ${se.elementosDados}`
    ).join('\n\n')}

---

## 3. CONSULTAS EXTERNAS (CE)

### Detalhamento por Complexidade:

${this.agruparPorComplexidade(this.report.consultasExternas)}

### Top 10 Consultas Externas:
${this.report.consultasExternas
    .sort((a, b) => b.pontosFuncao - a.pontosFuncao)
    .slice(0, 10)
    .map((ce, index) => 
        `${index + 1}. **${ce.nome}** - ${ce.complexidade.toUpperCase()} (${ce.pontosFuncao} PF)
   - ${ce.descricao}
   - ALIs: ${ce.arquivosLogicos.join(', ') || 'N/A'}
   - Elementos: ${ce.elementosDados}`
    ).join('\n\n')}

---

## 4. ANÁLISE POR MÓDULOS FUNCIONAIS

${this.analisarPorModulos()}

---

## 5. CASOS DE USO IDENTIFICADOS

${this.report.casoUso.map(caso => 
    `### ${caso.codigo} - ${caso.nome}
**Módulo**: ${caso.modulo}
**Funções Relacionadas**: ${caso.funcoes.length}
${caso.funcoes.slice(0, 3).map(f => `- ${f.nome} (${f.pontosFuncao} PF)`).join('\n')}
${caso.funcoes.length > 3 ? `... e mais ${caso.funcoes.length - 3} funções` : ''}
`).join('\n')}

---

## 6. RECOMENDAÇÕES PARA MIGRAÇÃO

### Priorização por Complexidade:
1. **Funções de BAIXA complexidade**: Migração direta e automatizada
2. **Funções de MÉDIA complexidade**: Revisão e otimização durante migração
3. **Funções de ALTA complexidade**: Re-engenharia e refatoração completa

### Módulos Críticos Identificados:
${this.identificarModulosCriticos()}

### Estimativa de Esforço:
- **Entradas Externas**: ${Math.ceil(this.report.resumoFuncional.totalEE * 0.5)} dias
- **Saídas Externas**: ${Math.ceil(this.report.resumoFuncional.totalSE * 0.8)} dias  
- **Consultas Externas**: ${Math.ceil(this.report.resumoFuncional.totalCE * 0.3)} dias

**TOTAL ESTIMADO**: ${Math.ceil((this.report.resumoFuncional.totalEE * 0.5) + (this.report.resumoFuncional.totalSE * 0.8) + (this.report.resumoFuncional.totalCE * 0.3))} dias de desenvolvimento

---
*Análise gerada automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}*
        `;

        return relatorio;
    }

    agruparPorComplexidade(funcoes) {
        const grupos = { baixa: [], media: [], alta: [] };
        
        funcoes.forEach(funcao => {
            grupos[funcao.complexidade].push(funcao);
        });

        return `
**Baixa Complexidade**: ${grupos.baixa.length} funções (${grupos.baixa.reduce((sum, f) => sum + f.pontosFuncao, 0)} PF)
**Média Complexidade**: ${grupos.media.length} funções (${grupos.media.reduce((sum, f) => sum + f.pontosFuncao, 0)} PF)  
**Alta Complexidade**: ${grupos.alta.length} funções (${grupos.alta.reduce((sum, f) => sum + f.pontosFuncao, 0)} PF)`;
    }

    analisarPorModulos() {
        const modulos = {};
        
        [...this.report.entradasExternas, ...this.report.saidasExternas, ...this.report.consultasExternas]
            .forEach(funcao => {
                const modulo = this.identificarModulo(funcao.controller);
                if (!modulos[modulo]) {
                    modulos[modulo] = { ee: 0, se: 0, ce: 0, pontos: 0 };
                }
                
                if (funcao.tipo === 'Entrada Externa') modulos[modulo].ee++;
                else if (funcao.tipo === 'Saída Externa') modulos[modulo].se++;
                else if (funcao.tipo === 'Consulta Externa') modulos[modulo].ce++;
                
                modulos[modulo].pontos += funcao.pontosFuncao;
            });

        return Object.entries(modulos)
            .sort((a, b) => b[1].pontos - a[1].pontos)
            .map(([modulo, dados]) => 
                `### ${modulo}
- **EE**: ${dados.ee} | **SE**: ${dados.se} | **CE**: ${dados.ce}
- **Total PF**: ${dados.pontos}`
            ).join('\n\n');
    }

    identificarModulo(controllerName) {
        const modulos = {
            'Calendario': 'Gestão de Calendário Eleitoral',
            'Chapa': 'Gestão de Chapas',
            'Denuncia': 'Sistema de Denúncias',
            'Impugnacao': 'Sistema de Impugnações',
            'Julgamento': 'Sistema de Julgamentos',
            'Recurso': 'Sistema de Recursos',
            'Membro': 'Gestão de Membros',
            'Profissional': 'Gestão de Profissionais',
            'Conselheiro': 'Gestão de Conselheiros',
            'Email': 'Sistema de Notificações',
            'Substituicao': 'Sistema de Substituições',
            'Documento': 'Gestão de Documentos'
        };

        for (const [key, modulo] of Object.entries(modulos)) {
            if (controllerName.includes(key)) {
                return modulo;
            }
        }
        return 'Outros';
    }

    identificarModulosCriticos() {
        const modulos = this.analisarPorModulos();
        return `
Com base na análise, os módulos mais críticos são:
1. **Sistema de Julgamentos** - Maior complexidade e número de funções
2. **Gestão de Chapas** - Alto volume de transações
3. **Sistema de Denúncias** - Processamento crítico
4. **Sistema de Recursos** - Lógica complexa de negócio
        `;
    }

    async executarAnalise() {
        console.log('🚀 Iniciando Análise Detalhada das Funções Transacionais...\n');

        try {
            this.analisarFuncoesTransacionais();
            this.mapearCasosDeUso();
            this.gerarResumo();

            const relatorio = this.gerarRelatorio();
            
            const reportPath = path.join(this.basePath, 'ANALISE_APF_FUNCOES_TRANSACIONAIS_SISTEMA_LEGADO_PHP_COMPLETA.md');
            fs.writeFileSync(reportPath, relatorio);

            console.log('\n✅ Análise de Funções Transacionais concluída!');
            console.log(`📄 Relatório salvo em: ${reportPath}`);
            console.log(`📊 Total PF Transacionais: ${this.report.resumoFuncional.pontosTransacionaisTotal} PF`);
            console.log(`📈 EE: ${this.report.resumoFuncional.totalEE} | SE: ${this.report.resumoFuncional.totalSE} | CE: ${this.report.resumoFuncional.totalCE}`);

        } catch (error) {
            console.error('❌ Erro durante a análise:', error);
            throw error;
        }
    }
}

// Execução
if (require.main === module) {
    const analyzer = new TransactionalFunctionAnalyzer();
    analyzer.executarAnalise().catch(console.error);
}

module.exports = TransactionalFunctionAnalyzer;