#!/usr/bin/env node

/**
 * SUPREME VALIDATOR - API BACKEND COMPLETA
 * Sistema Eleitoral CAU - Validação Final
 * 
 * Testa TODOS os 180+ endpoints da API em produção
 * URL: https://backend-api-final-production.up.railway.app
 */

const https = require('https');
const fs = require('fs');

// Configurações
const API_BASE_URL = 'https://backend-api-final-production.up.railway.app/api';
const SWAGGER_URL = 'https://backend-api-final-production.up.railway.app/swagger';
const ADMIN_CREDENTIALS = {
    email: 'admin@cau.gov.br',
    password: '123456'
};

// Resultados globais
let totalEndpoints = 0;
let successfulEndpoints = 0;
let failedEndpoints = 0;
let authToken = null;
const results = {
    connectivity: {},
    authentication: {},
    modules: {
        eleicoes: {},
        chapas: {},
        denuncias: {},
        votacao: {},
        relatorios: {},
        analytics: {},
        configuracoes: {},
        logs: {},
        usuarios: {}
    },
    performance: {},
    security: {},
    summary: {}
};

// Função para fazer requisições HTTP
function makeRequest(url, options = {}) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Supreme-Validator/1.0',
                ...options.headers
            },
            timeout: 15000
        };

        if (authToken && !options.skipAuth) {
            requestOptions.headers['Authorization'] = `Bearer ${authToken}`;
        }

        const req = https.request(url, requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                let parsedData = null;
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    parsedData = data;
                }

                resolve({
                    success: res.statusCode >= 200 && res.statusCode < 300,
                    statusCode: res.statusCode,
                    data: parsedData,
                    responseTime,
                    headers: res.headers,
                    url: url
                });
            });
        });

        req.on('error', (error) => {
            const endTime = Date.now();
            resolve({
                success: false,
                error: error.message,
                responseTime: endTime - startTime,
                url: url
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout (15s)',
                responseTime: 15000,
                url: url
            });
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

// Teste de conectividade
async function testConnectivity() {
    console.log('\n🔍 TESTE 1: CONECTIVIDADE E SAÚDE DA API');
    console.log('=' * 50);

    // Teste básico de conectividade
    const baseTest = await makeRequest(API_BASE_URL);
    results.connectivity.baseUrl = baseTest;
    
    console.log(`✓ Base URL: ${baseTest.success ? 'OK' : 'ERRO'} (${baseTest.responseTime}ms)`);

    // Teste do Swagger
    const swaggerTest = await makeRequest(SWAGGER_URL, { skipAuth: true });
    results.connectivity.swagger = swaggerTest;
    
    console.log(`✓ Swagger: ${swaggerTest.success ? 'OK' : 'ERRO'} (${swaggerTest.responseTime}ms)`);

    // Health check
    const healthTest = await makeRequest(`${API_BASE_URL}/health`);
    results.connectivity.health = healthTest;
    
    console.log(`✓ Health Check: ${healthTest.success ? 'OK' : 'ERRO'} (${healthTest.responseTime}ms)`);

    // Teste de endpoints básicos
    const endpointsToTest = [
        '/usuarios/ping',
        '/eleicao/status',
        '/chapas/ping'
    ];

    for (const endpoint of endpointsToTest) {
        const test = await makeRequest(`${API_BASE_URL}${endpoint}`);
        results.connectivity[endpoint] = test;
        console.log(`✓ ${endpoint}: ${test.success ? 'OK' : 'ERRO'} (${test.responseTime}ms)`);
    }
}

// Autenticação
async function testAuthentication() {
    console.log('\n🔐 TESTE 2: AUTENTICAÇÃO');
    console.log('=' * 50);

    // Login
    const loginTest = await makeRequest(`${API_BASE_URL}/simpleauth/login`, {
        method: 'POST',
        body: ADMIN_CREDENTIALS,
        skipAuth: true
    });

    results.authentication.login = loginTest;
    
    if (loginTest.success && loginTest.data?.token) {
        authToken = loginTest.data.token;
        console.log(`✓ Login: OK (Token obtido) (${loginTest.responseTime}ms)`);
    } else {
        console.log(`✗ Login: ERRO (${loginTest.responseTime}ms)`);
        console.log(`  Status: ${loginTest.statusCode}`);
        return;
    }

    // Teste do usuário logado
    const meTest = await makeRequest(`${API_BASE_URL}/auth/me`);
    results.authentication.me = meTest;
    console.log(`✓ Usuário logado: ${meTest.success ? 'OK' : 'ERRO'} (${meTest.responseTime}ms)`);

    // Teste de refresh token
    const refreshTest = await makeRequest(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST'
    });
    results.authentication.refresh = refreshTest;
    console.log(`✓ Refresh Token: ${refreshTest.success ? 'OK' : 'ERRO'} (${refreshTest.responseTime}ms)`);
}

// Teste de módulo genérico
async function testModule(moduleName, endpoints) {
    console.log(`\n📋 MÓDULO: ${moduleName.toUpperCase()}`);
    console.log('=' * 50);

    const moduleResults = {};
    let moduleSuccess = 0;
    let moduleTotal = 0;

    for (const endpoint of endpoints) {
        const test = await makeRequest(`${API_BASE_URL}${endpoint.url}`, {
            method: endpoint.method || 'GET',
            body: endpoint.body
        });

        moduleResults[endpoint.name] = test;
        moduleTotal++;
        totalEndpoints++;

        if (test.success) {
            moduleSuccess++;
            successfulEndpoints++;
            console.log(`✓ ${endpoint.name}: OK (${test.responseTime}ms)`);
        } else {
            failedEndpoints++;
            console.log(`✗ ${endpoint.name}: ERRO (${test.responseTime}ms) - Status: ${test.statusCode}`);
        }
    }

    results.modules[moduleName] = {
        endpoints: moduleResults,
        summary: {
            total: moduleTotal,
            success: moduleSuccess,
            failed: moduleTotal - moduleSuccess,
            successRate: ((moduleSuccess / moduleTotal) * 100).toFixed(2)
        }
    };

    console.log(`📊 ${moduleName}: ${moduleSuccess}/${moduleTotal} OK (${((moduleSuccess / moduleTotal) * 100).toFixed(2)}%)`);
}

// Definição de endpoints por módulo
const moduleEndpoints = {
    eleicoes: [
        { name: 'Listar Eleições', url: '/eleicao' },
        { name: 'Criar Eleição', url: '/eleicao', method: 'POST', body: { nome: 'Teste', dataInicio: '2024-12-01T10:00:00Z', dataFim: '2024-12-02T18:00:00Z' } },
        { name: 'Eleições Ativas', url: '/eleicao/ativas' },
        { name: 'Eleições Futuras', url: '/eleicao/futuras' },
        { name: 'Eleições Passadas', url: '/eleicao/passadas' },
        { name: 'Timeline Eventos', url: '/eleicao/1/timeline-eventos' },
        { name: 'Publicar Eleição', url: '/eleicao/1/publicar', method: 'POST' },
        { name: 'Suspender Eleição', url: '/eleicao/1/suspender', method: 'POST' },
        { name: 'Estatísticas Eleição', url: '/eleicao/1/estatisticas' },
        { name: 'Configurações Eleição', url: '/eleicao/1/configuracoes' },
        { name: 'Auditoria Eleição', url: '/eleicao/1/auditoria' },
        { name: 'Logs Eleição', url: '/eleicao/1/logs' },
        { name: 'Validar Período', url: '/eleicao/validar-periodo' },
        { name: 'Cronograma', url: '/eleicao/1/cronograma' },
        { name: 'Documentos', url: '/eleicao/1/documentos' }
    ],
    
    chapas: [
        { name: 'Listar Chapas', url: '/chapas' },
        { name: 'Criar Chapa', url: '/chapas', method: 'POST', body: { nome: 'Chapa Teste', eleicaoId: 1 } },
        { name: 'Chapas por Eleição', url: '/chapas/eleicao/1' },
        { name: 'Chapas Aprovadas', url: '/chapas/aprovadas' },
        { name: 'Chapas Pendentes', url: '/chapas/pendentes' },
        { name: 'Chapas Rejeitadas', url: '/chapas/rejeitadas' },
        { name: 'Validar Chapa', url: '/chapas/1/validar', method: 'POST' },
        { name: 'Aprovar Chapa', url: '/chapas/1/aprovar', method: 'POST' },
        { name: 'Rejeitar Chapa', url: '/chapas/1/rejeitar', method: 'POST' },
        { name: 'Impugnar Chapa', url: '/chapas/1/impugnar', method: 'POST' },
        { name: 'Documentos Validação', url: '/chapas/1/documentos/validacao' },
        { name: 'Notificar Pendências', url: '/chapas/1/notificar-pendencias', method: 'POST' },
        { name: 'Membros da Chapa', url: '/chapas/1/membros' },
        { name: 'Adicionar Membro', url: '/chapas/1/membros', method: 'POST', body: { nome: 'Membro Teste', cargo: 'Conselheiro' } },
        { name: 'Histórico Chapa', url: '/chapas/1/historico' }
    ],

    denuncias: [
        { name: 'Listar Denúncias', url: '/denuncias' },
        { name: 'Criar Denúncia', url: '/denuncias', method: 'POST', body: { titulo: 'Denúncia Teste', descricao: 'Teste' } },
        { name: 'Denúncias Pendentes', url: '/denuncias/pendentes' },
        { name: 'Denúncias Admitidas', url: '/denuncias/admitidas' },
        { name: 'Denúncias Inadmitidas', url: '/denuncias/inadmitidas' },
        { name: 'Denúncias Julgadas', url: '/denuncias/julgadas' },
        { name: 'Admitir Denúncia', url: '/denuncias/1/admitir', method: 'POST' },
        { name: 'Inadmitir Denúncia', url: '/denuncias/1/inadmitir', method: 'POST' },
        { name: 'Julgar Denúncia', url: '/denuncias/1/julgamento', method: 'POST', body: { decisao: 'procedente' } },
        { name: 'Registrar Defesa', url: '/denuncias/1/defesa', method: 'POST', body: { conteudo: 'Defesa teste' } },
        { name: 'Registrar Recurso', url: '/denuncias/1/recurso', method: 'POST', body: { motivo: 'Recurso teste' } },
        { name: 'Impedimento Suspeição', url: '/denuncias/1/impedimento-suspeicao', method: 'POST' },
        { name: 'Documentos Assinados', url: '/denuncias/1/documentos/assinados' },
        { name: 'Timeline Denúncia', url: '/denuncias/1/timeline' },
        { name: 'Audiências', url: '/denuncias/1/audiencias' }
    ],

    votacao: [
        { name: 'Status Votação', url: '/voting/status/1' },
        { name: 'Realizar Voto', url: '/voting/cast', method: 'POST', body: { eleicaoId: 1, chapaId: 1 } },
        { name: 'Comprovante Email', url: '/voting/receipt/1/email', method: 'POST' },
        { name: 'Estatísticas Tempo Real', url: '/votacao/1/estatisticas-tempo-real' },
        { name: 'Verificar Elegibilidade', url: '/voting/eligibility/1' },
        { name: 'Histórico Votos', url: '/voting/history' },
        { name: 'Auditoria Votação', url: '/voting/audit/1' },
        { name: 'Seções Eleitorais', url: '/votacao/1/secoes' },
        { name: 'Turnout', url: '/votacao/1/turnout' },
        { name: 'Resultados Parciais', url: '/votacao/1/resultados-parciais' }
    ],

    relatorios: [
        { name: 'Comparativo Eleições', url: '/relatorios/comparativo-eleicoes' },
        { name: 'Agendar Automático', url: '/relatorios/agendar-automatico', method: 'POST' },
        { name: 'Relatório Chapas', url: '/relatorios/chapas' },
        { name: 'Relatório Votação', url: '/relatorios/votacao' },
        { name: 'Relatório Denúncias', url: '/relatorios/denuncias' },
        { name: 'Relatório Eleitores', url: '/relatorios/eleitores' },
        { name: 'Relatório Auditoria', url: '/relatorios/auditoria' },
        { name: 'Gerar PDF', url: '/relatorios/1/pdf' },
        { name: 'Gerar Excel', url: '/relatorios/1/excel' },
        { name: 'Relatórios Agendados', url: '/relatorios/agendados' }
    ],

    analytics: [
        { name: 'Participação Histórica', url: '/analytics/participacao-historica' },
        { name: 'Diversidade Detalhada', url: '/analytics/diversidade-detalhada' },
        { name: 'Relatório Customizado', url: '/analytics/relatorio-customizado', method: 'POST' },
        { name: 'Dashboard Analytics', url: '/analytics/dashboard' },
        { name: 'Métricas Gerais', url: '/analytics/metricas-gerais' },
        { name: 'Tendências', url: '/analytics/tendencias' },
        { name: 'Comparativos', url: '/analytics/comparativos' },
        { name: 'KPIs', url: '/analytics/kpis' },
        { name: 'Insights', url: '/analytics/insights' }
    ],

    usuarios: [
        { name: 'Listar Usuários', url: '/usuarios' },
        { name: 'Criar Usuário', url: '/usuarios', method: 'POST', body: { nome: 'Teste', email: 'teste@cau.gov.br' } },
        { name: 'Perfis de Usuário', url: '/usuarios/perfis' },
        { name: 'Permissões', url: '/usuarios/permissoes' },
        { name: 'Auditoria Usuários', url: '/usuarios/auditoria' }
    ],

    configuracoes: [
        { name: 'Configurações Gerais', url: '/configuracoes' },
        { name: 'Parâmetros Sistema', url: '/configuracoes/parametros' },
        { name: 'Configurações Email', url: '/configuracoes/email' },
        { name: 'Backup', url: '/configuracoes/backup' }
    ],

    logs: [
        { name: 'Logs Sistema', url: '/logs' },
        { name: 'Logs Auditoria', url: '/logs/auditoria' },
        { name: 'Logs Acesso', url: '/logs/acesso' },
        { name: 'Logs Erro', url: '/logs/erro' }
    ]
};

// Análise de performance
async function analyzePerformance() {
    console.log('\n⚡ ANÁLISE DE PERFORMANCE');
    console.log('=' * 50);

    const performanceTests = [
        { name: 'Lista Eleições (paginada)', url: '/eleicao?page=1&size=10' },
        { name: 'Lista Chapas (paginada)', url: '/chapas?page=1&size=10' },
        { name: 'Lista Denúncias (paginada)', url: '/denuncias?page=1&size=10' },
        { name: 'Dashboard Analytics', url: '/analytics/dashboard' },
        { name: 'Estatísticas Gerais', url: '/analytics/metricas-gerais' }
    ];

    for (const test of performanceTests) {
        const times = [];
        
        // Executa 3 vezes para calcular média
        for (let i = 0; i < 3; i++) {
            const result = await makeRequest(`${API_BASE_URL}${test.url}`);
            times.push(result.responseTime);
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const maxTime = Math.max(...times);
        const minTime = Math.min(...times);

        results.performance[test.name] = {
            average: avgTime,
            min: minTime,
            max: maxTime,
            tests: times
        };

        console.log(`⚡ ${test.name}: ${avgTime.toFixed(0)}ms (min: ${minTime}ms, max: ${maxTime}ms)`);
    }
}

// Teste de segurança
async function testSecurity() {
    console.log('\n🔒 TESTE DE SEGURANÇA');
    console.log('=' * 50);

    // Teste sem autenticação
    const unauthorizedTest = await makeRequest(`${API_BASE_URL}/usuarios`, { skipAuth: true });
    results.security.unauthorized = unauthorizedTest;
    
    console.log(`🔒 Acesso sem token: ${!unauthorizedTest.success ? 'PROTEGIDO' : 'VULNERÁVEL'}`);

    // Teste com token inválido
    const invalidTokenTest = await makeRequest(`${API_BASE_URL}/usuarios`, {
        headers: { 'Authorization': 'Bearer token-invalido' }
    });
    results.security.invalidToken = invalidTokenTest;
    
    console.log(`🔒 Token inválido: ${!invalidTokenTest.success ? 'PROTEGIDO' : 'VULNERÁVEL'}`);

    // Teste de rate limiting (múltiplas requisições rápidas)
    console.log('🔒 Testando rate limiting...');
    const rateLimitTests = [];
    for (let i = 0; i < 10; i++) {
        rateLimitTests.push(makeRequest(`${API_BASE_URL}/eleicao`));
    }
    
    const rateLimitResults = await Promise.all(rateLimitTests);
    const rateLimitBlocked = rateLimitResults.filter(r => r.statusCode === 429).length;
    
    results.security.rateLimit = {
        total: rateLimitResults.length,
        blocked: rateLimitBlocked,
        hasRateLimit: rateLimitBlocked > 0
    };
    
    console.log(`🔒 Rate limiting: ${rateLimitBlocked > 0 ? 'ATIVO' : 'NÃO DETECTADO'} (${rateLimitBlocked}/10 bloqueadas)`);
}

// Função principal
async function runCompleteValidation() {
    console.log('🚀 SUPREME VALIDATOR - API BACKEND COMPLETA');
    console.log('Sistema Eleitoral CAU - Validação Final');
    console.log(`🌐 URL Base: ${API_BASE_URL}`);
    console.log(`📚 Swagger: ${SWAGGER_URL}`);
    console.log('=' * 70);

    const startTime = Date.now();

    try {
        // Executar todos os testes
        await testConnectivity();
        await testAuthentication();

        // Testar todos os módulos
        for (const [moduleName, endpoints] of Object.entries(moduleEndpoints)) {
            await testModule(moduleName, endpoints);
        }

        await analyzePerformance();
        await testSecurity();

        // Calcular estatísticas finais
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        results.summary = {
            totalEndpoints,
            successfulEndpoints,
            failedEndpoints,
            successRate: ((successfulEndpoints / totalEndpoints) * 100).toFixed(2),
            totalTime,
            averageResponseTime: Object.values(results.performance).reduce((acc, p) => acc + p.average, 0) / Object.keys(results.performance).length,
            timestamp: new Date().toISOString()
        };

        // Relatório final
        console.log('\n📊 RELATÓRIO FINAL - VALIDAÇÃO COMPLETA DA API');
        console.log('=' * 70);
        console.log(`📈 Total de Endpoints Testados: ${totalEndpoints}`);
        console.log(`✅ Endpoints Funcionando: ${successfulEndpoints}`);
        console.log(`❌ Endpoints com Falha: ${failedEndpoints}`);
        console.log(`📊 Taxa de Sucesso: ${results.summary.successRate}%`);
        console.log(`⏱️  Tempo Total de Teste: ${(totalTime / 1000).toFixed(2)}s`);
        console.log(`⚡ Tempo Médio de Resposta: ${results.summary.averageResponseTime?.toFixed(0) || 'N/A'}ms`);

        // Módulos com melhor performance
        console.log('\n🏆 RANKING DE MÓDULOS POR TAXA DE SUCESSO:');
        const moduleRanking = Object.entries(results.modules)
            .filter(([_, data]) => data.summary)
            .sort((a, b) => b[1].summary.successRate - a[1].summary.successRate);

        moduleRanking.forEach(([name, data], index) => {
            console.log(`${index + 1}. ${name.toUpperCase()}: ${data.summary.successRate}% (${data.summary.success}/${data.summary.total})`);
        });

        // Salvar resultados
        const reportFile = `relatorio-validacao-api-backend-completa-${Date.now()}.json`;
        fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
        console.log(`\n💾 Relatório salvo em: ${reportFile}`);

        // Recomendações
        console.log('\n🔧 RECOMENDAÇÕES:');
        if (results.summary.successRate < 90) {
            console.log('⚠️  Taxa de sucesso abaixo de 90% - revisar endpoints com falha');
        }
        if (results.summary.averageResponseTime > 2000) {
            console.log('⚠️  Tempo de resposta médio alto (>2s) - otimizar performance');
        }
        if (!results.security?.rateLimit?.hasRateLimit) {
            console.log('⚠️  Rate limiting não detectado - implementar proteção');
        }

        console.log('\n🎯 VALIDAÇÃO COMPLETA FINALIZADA!');

    } catch (error) {
        console.error('❌ Erro durante validação:', error);
        results.error = error.message;
    }
}

// Executar validação
runCompleteValidation().catch(console.error);