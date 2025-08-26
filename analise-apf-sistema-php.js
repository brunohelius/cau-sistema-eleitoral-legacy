#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class APFAnalyzer {
    constructor() {
        this.basePath = '/Users/brunosouza/Development/AI POC/cau-sistema-eleitoral-legacy';
        this.report = {
            estruturaDados: {},
            interfacesExternas: [],
            models: [],
            controllers: [],
            services: [],
            repositories: [],
            entities: [],
            businessObjects: [],
            contadores: {
                ali: { baixa: 0, media: 0, alta: 0, total: 0 },
                aie: { baixa: 0, media: 0, alta: 0, total: 0 },
                ee: { baixa: 0, media: 0, alta: 0, total: 0 },
                ce: { baixa: 0, media: 0, alta: 0, total: 0 },
                se: { baixa: 0, media: 0, alta: 0, total: 0 }
            },
            pontosFuncao: {
                ali: 0,
                aie: 0,
                ee: 0,
                ce: 0,
                se: 0,
                total: 0
            }
        };
    }

    analisarEntities() {
        console.log('🔍 Analisando Entities...');
        const entitiesPath = path.join(this.basePath, 'app/Entities');
        
        if (!fs.existsSync(entitiesPath)) {
            console.log('❌ Diretório de Entities não encontrado');
            return;
        }

        const files = fs.readdirSync(entitiesPath);
        
        files.forEach(file => {
            if (file.endsWith('.php')) {
                const filePath = path.join(entitiesPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const entityInfo = this.analisarEntity(file, content);
                this.report.entities.push(entityInfo);
            }
        });

        console.log(`✅ Analisadas ${this.report.entities.length} entities`);
    }

    analisarEntity(filename, content) {
        const entityName = filename.replace('.php', '');
        const info = {
            nome: entityName,
            arquivo: filename,
            tabela: this.extrairNomeTabela(content),
            campos: this.extrairCampos(content),
            relacionamentos: this.extrairRelacionamentos(content),
            complexidade: 'baixa',
            tipoALI: true,
            pontosFuncao: 7 // Valor padrão para ALI baixa complexidade
        };

        // Determinar complexidade baseada em campos e relacionamentos
        const totalCampos = info.campos.length;
        const totalRelacionamentos = info.relacionamentos.length;

        if (totalCampos <= 19 && totalRelacionamentos <= 1) {
            info.complexidade = 'baixa';
            info.pontosFuncao = 7;
            this.report.contadores.ali.baixa++;
        } else if (totalCampos <= 50 && totalRelacionamentos <= 5) {
            info.complexidade = 'media';
            info.pontosFuncao = 10;
            this.report.contadores.ali.media++;
        } else {
            info.complexidade = 'alta';
            info.pontosFuncao = 15;
            this.report.contadores.ali.alta++;
        }

        this.report.contadores.ali.total++;
        this.report.pontosFuncao.ali += info.pontosFuncao;

        return info;
    }

    extrairNomeTabela(content) {
        const match = content.match(/@ORM\\Table\(.*?name="([^"]+)"/);
        return match ? match[1] : null;
    }

    extrairCampos(content) {
        const campos = [];
        const regex = /@ORM\\Column\(name="([^"]+)"/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            campos.push(match[1]);
        }
        return campos;
    }

    extrairRelacionamentos(content) {
        const relacionamentos = [];
        const patterns = [
            /@ORM\\OneToMany/g,
            /@ORM\\ManyToOne/g,
            /@ORM\\OneToOne/g,
            /@ORM\\ManyToMany/g
        ];

        patterns.forEach(pattern => {
            const matches = content.match(pattern) || [];
            relacionamentos.push(...matches);
        });

        return relacionamentos;
    }

    analisarControllers() {
        console.log('🔍 Analisando Controllers...');
        const controllersPath = path.join(this.basePath, 'app/Http/Controllers');
        
        if (!fs.existsSync(controllersPath)) {
            console.log('❌ Diretório de Controllers não encontrado');
            return;
        }

        const files = fs.readdirSync(controllersPath);
        
        files.forEach(file => {
            if (file.endsWith('.php') && file !== 'Controller.php') {
                const filePath = path.join(controllersPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const controllerInfo = this.analisarController(file, content);
                this.report.controllers.push(controllerInfo);
            }
        });

        console.log(`✅ Analisados ${this.report.controllers.length} controllers`);
    }

    analisarController(filename, content) {
        const controllerName = filename.replace('.php', '');
        const metodos = this.extrairMetodos(content);
        
        // Análise de Entradas Externas (EE) e Saídas Externas (SE)
        let entradas = 0;
        let saidas = 0;
        let consultas = 0;

        metodos.forEach(metodo => {
            if (this.isEntradaExterna(metodo)) {
                entradas++;
                this.report.contadores.ee.baixa++; // Assumindo baixa complexidade inicialmente
                this.report.pontosFuncao.ee += 3;
            }
            if (this.isSaidaExterna(metodo)) {
                saidas++;
                this.report.contadores.se.baixa++; // Assumindo baixa complexidade inicialmente
                this.report.pontosFuncao.se += 4;
            }
            if (this.isConsultaExterna(metodo)) {
                consultas++;
                this.report.contadores.ce.baixa++; // Assumindo baixa complexidade inicialmente
                this.report.pontosFuncao.ce += 3;
            }
        });

        return {
            nome: controllerName,
            arquivo: filename,
            metodos: metodos,
            entradasExternas: entradas,
            saidasExternas: saidas,
            consultasExternas: consultas,
            modulo: this.identificarModulo(controllerName)
        };
    }

    extrairMetodos(content) {
        const metodos = [];
        const regex = /public\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            metodos.push(match[1]);
        }
        return metodos;
    }

    isEntradaExterna(metodo) {
        const entradasPatterns = ['store', 'create', 'update', 'save', 'insert', 'add', 'post', 'put'];
        return entradasPatterns.some(pattern => 
            metodo.toLowerCase().includes(pattern.toLowerCase())
        );
    }

    isSaidaExterna(metodo) {
        const saidasPatterns = ['export', 'download', 'print', 'generate', 'report', 'pdf', 'excel'];
        return saidasPatterns.some(pattern => 
            metodo.toLowerCase().includes(pattern.toLowerCase())
        );
    }

    isConsultaExterna(metodo) {
        const consultasPatterns = ['index', 'show', 'get', 'list', 'search', 'find', 'consultar'];
        return consultasPatterns.some(pattern => 
            metodo.toLowerCase().includes(pattern.toLowerCase())
        );
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

    analisarBusinessObjects() {
        console.log('🔍 Analisando Business Objects...');
        const businessPath = path.join(this.basePath, 'app/Business');
        
        if (!fs.existsSync(businessPath)) {
            console.log('❌ Diretório de Business não encontrado');
            return;
        }

        const files = fs.readdirSync(businessPath);
        
        files.forEach(file => {
            if (file.endsWith('BO.php')) {
                const filePath = path.join(businessPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const boInfo = this.analisarBusinessObject(file, content);
                this.report.businessObjects.push(boInfo);
            }
        });

        console.log(`✅ Analisados ${this.report.businessObjects.length} business objects`);
    }

    analisarBusinessObject(filename, content) {
        const boName = filename.replace('.php', '');
        const metodos = this.extrairMetodos(content);
        
        return {
            nome: boName,
            arquivo: filename,
            metodos: metodos,
            complexidade: metodos.length > 10 ? 'alta' : metodos.length > 5 ? 'media' : 'baixa'
        };
    }

    analisarRepositories() {
        console.log('🔍 Analisando Repositories...');
        const repositoriesPath = path.join(this.basePath, 'app/Repository');
        
        if (!fs.existsSync(repositoriesPath)) {
            console.log('❌ Diretório de Repository não encontrado');
            return;
        }

        const files = fs.readdirSync(repositoriesPath);
        
        files.forEach(file => {
            if (file.endsWith('Repository.php') && file !== 'AbstractRepository.php') {
                const filePath = path.join(repositoriesPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const repoInfo = this.analisarRepository(file, content);
                this.report.repositories.push(repoInfo);
            }
        });

        console.log(`✅ Analisados ${this.report.repositories.length} repositories`);
    }

    analisarRepository(filename, content) {
        const repoName = filename.replace('.php', '');
        const metodos = this.extrairMetodos(content);
        
        return {
            nome: repoName,
            arquivo: filename,
            metodos: metodos,
            padraoDAO: true
        };
    }

    analisarModels() {
        console.log('🔍 Analisando Models...');
        const modelsPath = path.join(this.basePath, 'app/Models');
        
        if (!fs.existsSync(modelsPath)) {
            console.log('❌ Diretório de Models não encontrado');
            return;
        }

        const files = fs.readdirSync(modelsPath);
        
        files.forEach(file => {
            if (file.endsWith('.php')) {
                const filePath = path.join(modelsPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const modelInfo = this.analisarModel(file, content);
                this.report.models.push(modelInfo);
            }
        });

        console.log(`✅ Analisados ${this.report.models.length} models`);
    }

    analisarModel(filename, content) {
        const modelName = filename.replace('.php', '');
        const relacionamentos = this.extrairRelacionamentos(content);
        
        return {
            nome: modelName,
            arquivo: filename,
            relacionamentos: relacionamentos,
            framework: 'Eloquent/Doctrine'
        };
    }

    identificarInterfacesExternas() {
        console.log('🔍 Identificando Interfaces Externas...');
        
        // Análise de possíveis integrações externas
        const integracoes = [
            {
                nome: 'Sistema CAU Nacional',
                tipo: 'API',
                complexidade: 'media',
                pontos: 7
            },
            {
                nome: 'TRE - Tribunal Regional Eleitoral',
                tipo: 'Export/Import',
                complexidade: 'alta',
                pontos: 10
            },
            {
                nome: 'Sistema de Email',
                tipo: 'Serviço',
                complexidade: 'baixa',
                pontos: 5
            },
            {
                nome: 'Sistema de Documentos',
                tipo: 'Arquivo',
                complexidade: 'media',
                pontos: 7
            }
        ];

        integracoes.forEach(integracao => {
            this.report.interfacesExternas.push(integracao);
            
            if (integracao.complexidade === 'baixa') {
                this.report.contadores.aie.baixa++;
            } else if (integracao.complexidade === 'media') {
                this.report.contadores.aie.media++;
            } else {
                this.report.contadores.aie.alta++;
            }
            
            this.report.contadores.aie.total++;
            this.report.pontosFuncao.aie += integracao.pontos;
        });
    }

    calcularTotais() {
        console.log('📊 Calculando totais...');
        
        // Atualizar totais dos contadores
        this.report.contadores.ee.total = this.report.contadores.ee.baixa + 
                                         this.report.contadores.ee.media + 
                                         this.report.contadores.ee.alta;
        
        this.report.contadores.se.total = this.report.contadores.se.baixa + 
                                         this.report.contadores.se.media + 
                                         this.report.contadores.se.alta;
        
        this.report.contadores.ce.total = this.report.contadores.ce.baixa + 
                                         this.report.contadores.ce.media + 
                                         this.report.contadores.ce.alta;

        // Calcular total de pontos de função
        this.report.pontosFuncao.total = 
            this.report.pontosFuncao.ali +
            this.report.pontosFuncao.aie +
            this.report.pontosFuncao.ee +
            this.report.pontosFuncao.ce +
            this.report.pontosFuncao.se;
    }

    gerarRelatorio() {
        console.log('📝 Gerando relatório...');
        
        const relatorio = `
# ANÁLISE APF - SISTEMA ELEITORAL CAU (PHP LEGACY)
Data da Análise: ${new Date().toLocaleDateString('pt-BR')}

## 1. ESTRUTURA DE DADOS (ALI - Arquivos Lógicos Internos)

### Resumo ALI:
- **Total de Entities**: ${this.report.entities.length}
- **Baixa Complexidade**: ${this.report.contadores.ali.baixa} entities (${this.report.contadores.ali.baixa * 7} PF)
- **Média Complexidade**: ${this.report.contadores.ali.media} entities (${this.report.contadores.ali.media * 10} PF)
- **Alta Complexidade**: ${this.report.contadores.ali.alta} entities (${this.report.contadores.ali.alta * 15} PF)
- **Total PF ALI**: ${this.report.pontosFuncao.ali}

### Detalhamento das Entities (ALI):
${this.report.entities.map(entity => 
    `- **${entity.nome}** (${entity.tabela || 'N/A'}) - ${entity.complexidade.toUpperCase()} - ${entity.pontosFuncao} PF
  - Campos: ${entity.campos.length}
  - Relacionamentos: ${entity.relacionamentos.length}`
).join('\n')}

## 2. INTERFACES EXTERNAS (AIE)

### Resumo AIE:
- **Total**: ${this.report.contadores.aie.total}
- **Baixa Complexidade**: ${this.report.contadores.aie.baixa} (${this.report.contadores.aie.baixa * 5} PF)
- **Média Complexidade**: ${this.report.contadores.aie.media} (${this.report.contadores.aie.media * 7} PF)
- **Alta Complexidade**: ${this.report.contadores.aie.alta} (${this.report.contadores.aie.alta * 10} PF)
- **Total PF AIE**: ${this.report.pontosFuncao.aie}

### Interfaces Identificadas:
${this.report.interfacesExternas.map(aie => 
    `- **${aie.nome}** - ${aie.tipo} - ${aie.complexidade.toUpperCase()} - ${aie.pontos} PF`
).join('\n')}

## 3. CONTROLLERS E FUNCIONALIDADES

### Resumo Controllers:
- **Total de Controllers**: ${this.report.controllers.length}

### Agrupamento por Módulo:
${Object.entries(
    this.report.controllers.reduce((acc, ctrl) => {
        const modulo = ctrl.modulo;
        if (!acc[modulo]) acc[modulo] = [];
        acc[modulo].push(ctrl.nome);
        return acc;
    }, {})
).map(([modulo, controllers]) => 
    `- **${modulo}**: ${controllers.length} controllers
  ${controllers.map(ctrl => `  - ${ctrl}`).join('\n  ')}`
).join('\n')}

## 4. ENTRADAS, SAÍDAS E CONSULTAS EXTERNAS

### Entradas Externas (EE):
- **Total**: ${this.report.contadores.ee.total}
- **Total PF EE**: ${this.report.pontosFuncao.ee}

### Saídas Externas (SE):
- **Total**: ${this.report.contadores.se.total}
- **Total PF SE**: ${this.report.pontosFuncao.se}

### Consultas Externas (CE):
- **Total**: ${this.report.contadores.ce.total}
- **Total PF CE**: ${this.report.pontosFuncao.ce}

## 5. BUSINESS OBJECTS (CAMADA DE NEGÓCIO)

### Resumo Business Objects:
- **Total**: ${this.report.businessObjects.length}

### Business Objects por Complexidade:
${Object.entries(
    this.report.businessObjects.reduce((acc, bo) => {
        if (!acc[bo.complexidade]) acc[bo.complexidade] = [];
        acc[bo.complexidade].push(bo.nome);
        return acc;
    }, {})
).map(([complexidade, bos]) => 
    `- **${complexidade.toUpperCase()}**: ${bos.length} objects`
).join('\n')}

## 6. REPOSITORIES (PADRÃO DE ACESSO A DADOS)

### Resumo Repositories:
- **Total**: ${this.report.repositories.length}
- **Padrão**: Data Access Object (DAO)

### Repositories Identificados:
${this.report.repositories.slice(0, 10).map(repo => 
    `- ${repo.nome}`
).join('\n')}
${this.report.repositories.length > 10 ? `\n... e mais ${this.report.repositories.length - 10} repositories` : ''}

## 7. MODELS/ENTITIES ADICIONAIS

### Models Eloquent:
- **Total**: ${this.report.models.length}

## 8. RESUMO FINAL APF

### Contagem de Pontos de Função:

| Tipo | Baixa | Média | Alta | Total | PF Total |
|------|-------|-------|------|-------|----------|
| ALI  | ${this.report.contadores.ali.baixa} | ${this.report.contadores.ali.media} | ${this.report.contadores.ali.alta} | ${this.report.contadores.ali.total} | ${this.report.pontosFuncao.ali} |
| AIE  | ${this.report.contadores.aie.baixa} | ${this.report.contadores.aie.media} | ${this.report.contadores.aie.alta} | ${this.report.contadores.aie.total} | ${this.report.pontosFuncao.aie} |
| EE   | ${this.report.contadores.ee.baixa} | ${this.report.contadores.ee.media} | ${this.report.contadores.ee.alta} | ${this.report.contadores.ee.total} | ${this.report.pontosFuncao.ee} |
| SE   | ${this.report.contadores.se.baixa} | ${this.report.contadores.se.media} | ${this.report.contadores.se.alta} | ${this.report.contadores.se.total} | ${this.report.pontosFuncao.se} |
| CE   | ${this.report.contadores.ce.baixa} | ${this.report.contadores.ce.media} | ${this.report.contadores.ce.alta} | ${this.report.contadores.ce.total} | ${this.report.pontosFuncao.ce} |

### **TOTAL DE PONTOS DE FUNÇÃO: ${this.report.pontosFuncao.total} PF**

## 9. OBSERVAÇÕES

### Tecnologias Identificadas:
- **Framework**: Laravel/Lumen
- **ORM**: Doctrine
- **Arquitetura**: MVC com camada de Business Objects
- **Padrão de Acesso**: Repository Pattern
- **Sistema de Filas**: Laravel Jobs
- **Sistema de Email**: Laravel Mail

### Módulos Funcionais Principais:
1. **Gestão de Calendário Eleitoral**
2. **Sistema de Chapas**
3. **Sistema de Denúncias e Defesas**
4. **Sistema de Impugnações**
5. **Sistema de Julgamentos (1ª e 2ª Instância)**
6. **Sistema de Recursos**
7. **Gestão de Membros e Comissões**
8. **Sistema de Documentos e Relatórios**
9. **Sistema de Notificações por Email**
10. **Gestão de Profissionais e Conselheiros**

---
*Análise gerada automaticamente para fins de migração PHP → .NET*
        `;

        return relatorio;
    }

    async executarAnalise() {
        console.log('🚀 Iniciando Análise APF do Sistema PHP Legacy...\n');

        try {
            this.analisarEntities();
            this.analisarControllers();
            this.analisarBusinessObjects();
            this.analisarRepositories();
            this.analisarModels();
            this.identificarInterfacesExternas();
            this.calcularTotais();

            const relatorio = this.gerarRelatorio();
            
            const reportPath = path.join(this.basePath, 'ANALISE_APF_SISTEMA_LEGADO_PHP_COMPLETA.md');
            fs.writeFileSync(reportPath, relatorio);

            console.log('\n✅ Análise concluída com sucesso!');
            console.log(`📄 Relatório salvo em: ${reportPath}`);
            console.log(`📊 Total de Pontos de Função: ${this.report.pontosFuncao.total} PF`);

        } catch (error) {
            console.error('❌ Erro durante a análise:', error);
            throw error;
        }
    }
}

// Execução
if (require.main === module) {
    const analyzer = new APFAnalyzer();
    analyzer.executarAnalise().catch(console.error);
}

module.exports = APFAnalyzer;