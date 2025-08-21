#!/usr/bin/env node

/**
 * VALIDAÇÃO COMPLETA DO SISTEMA - SEM BACKEND
 * Valida frontends e documenta problemas do backend
 * Sistema Eleitoral CAU
 */

const https = require('https');
const fs = require('fs');

// URLs dos serviços
const SERVICES = {
    backend: 'https://backend-api-final-production.up.railway.app',
    admin: 'https://admin-frontend-final-production.up.railway.app', 
    public: 'https://public-frontend-final-production.up.railway.app'
};

// Resultados globais
const results = {
    backend: {
        status: 'down',
        tests: {},
        summary: { available: false, reason: 'Error 502 - Application failed to respond' }
    },
    admin: {
        status: 'unknown',
        tests: {},
        summary: {}
    },
    public: {
        status: 'unknown', 
        tests: {},
        summary: {}
    },
    overall: {}
};

// Função para fazer requisições
function makeRequest(url, options = {}) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'Sistema-Eleitoral-Validator/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                ...options.headers
            },
            timeout: 15000
        };

        const req = https.request(url, requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const endTime = Date.now();
                resolve({
                    success: res.statusCode >= 200 && res.statusCode < 400,
                    statusCode: res.statusCode,
                    data: data,
                    responseTime: endTime - startTime,
                    headers: res.headers,
                    url: url
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                responseTime: Date.now() - startTime,
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

        req.end();
    });
}

// Teste do Backend
async function testBackend() {
    console.log('\n🔍 TESTE: BACKEND API');
    console.log('=' * 50);

    const endpoints = [
        '',
        '/api',
        '/swagger',
        '/health'
    ];

    for (const endpoint of endpoints) {
        const url = `${SERVICES.backend}${endpoint}`;
        const test = await makeRequest(url);
        
        results.backend.tests[endpoint || 'root'] = test;
        
        if (test.success) {
            console.log(`✅ ${endpoint || 'root'}: OK (${test.responseTime}ms)`);
        } else {
            console.log(`❌ ${endpoint || 'root'}: ERRO (${test.statusCode || 'N/A'}) - ${test.responseTime}ms`);
            if (test.error) {
                console.log(`   Erro: ${test.error}`);
            }
        }
    }

    // Verificar se algum endpoint funcionou
    const workingEndpoints = Object.values(results.backend.tests).filter(t => t.success).length;
    
    if (workingEndpoints === 0) {
        results.backend.status = 'down';
        results.backend.summary = {
            available: false,
            reason: 'Todos os endpoints retornaram erro 502',
            recommendation: 'Necessário redeploy do backend no Railway'
        };
        console.log('🚨 BACKEND COMPLETAMENTE FORA DO AR');
    } else {
        results.backend.status = 'partial';
        results.backend.summary = {
            available: true,
            workingEndpoints: workingEndpoints,
            totalEndpoints: endpoints.length
        };
    }
}

// Teste do Frontend Admin
async function testAdminFrontend() {
    console.log('\n🔍 TESTE: FRONTEND ADMIN');
    console.log('=' * 50);

    const pages = [
        { name: 'Home', path: '' },
        { name: 'Login', path: '/login' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Eleições', path: '/eleicoes' },
        { name: 'Chapas', path: '/chapas' },
        { name: 'Denúncias', path: '/denuncias' },
        { name: 'Relatórios', path: '/relatorios' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Usuários', path: '/usuarios' },
        { name: 'Configurações', path: '/configuracoes' }
    ];

    let workingPages = 0;

    for (const page of pages) {
        const url = `${SERVICES.admin}${page.path}`;
        const test = await makeRequest(url);
        
        results.admin.tests[page.name] = test;
        
        if (test.success) {
            workingPages++;
            console.log(`✅ ${page.name}: OK (${test.responseTime}ms)`);
            
            // Verificar se contém React
            if (test.data.includes('react') || test.data.includes('React') || test.data.includes('root')) {
                console.log(`   📱 Detectado aplicação React`);
            }
        } else {
            console.log(`❌ ${page.name}: ERRO (${test.statusCode || 'N/A'}) - ${test.responseTime}ms`);
        }
    }

    results.admin.status = workingPages > 0 ? 'up' : 'down';
    results.admin.summary = {
        available: workingPages > 0,
        workingPages: workingPages,
        totalPages: pages.length,
        successRate: ((workingPages / pages.length) * 100).toFixed(2)
    };

    if (workingPages > 0) {
        console.log(`📊 Admin Frontend: ${workingPages}/${pages.length} páginas OK (${results.admin.summary.successRate}%)`);
    } else {
        console.log('🚨 FRONTEND ADMIN COMPLETAMENTE FORA DO AR');
    }
}

// Teste do Frontend Público
async function testPublicFrontend() {
    console.log('\n🔍 TESTE: FRONTEND PÚBLICO');
    console.log('=' * 50);

    const pages = [
        { name: 'Home', path: '' },
        { name: 'Entrar', path: '/entrar' },
        { name: 'Eleições', path: '/eleicoes' },
        { name: 'Chapas', path: '/chapas' },
        { name: 'Votação', path: '/votacao' },
        { name: 'Resultados', path: '/resultados' },
        { name: 'Denúncias', path: '/denuncias' },
        { name: 'Nova Denúncia', path: '/denuncias/nova' },
        { name: 'Transparência', path: '/transparencia' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contato', path: '/contato' },
        { name: 'Calendário', path: '/calendario' },
        { name: 'Documentos', path: '/documentos' },
        { name: 'Normativas', path: '/normativas' },
        { name: 'Recursos', path: '/recursos' }
    ];

    let workingPages = 0;

    for (const page of pages) {
        const url = `${SERVICES.public}${page.path}`;
        const test = await makeRequest(url);
        
        results.public.tests[page.name] = test;
        
        if (test.success) {
            workingPages++;
            console.log(`✅ ${page.name}: OK (${test.responseTime}ms)`);
            
            // Verificar se contém React/Vite
            if (test.data.includes('vite') || test.data.includes('react') || test.data.includes('React') || test.data.includes('root')) {
                console.log(`   📱 Detectado aplicação React/Vite`);
            }
        } else {
            console.log(`❌ ${page.name}: ERRO (${test.statusCode || 'N/A'}) - ${test.responseTime}ms`);
        }
    }

    results.public.status = workingPages > 0 ? 'up' : 'down';
    results.public.summary = {
        available: workingPages > 0,
        workingPages: workingPages,
        totalPages: pages.length,
        successRate: ((workingPages / pages.length) * 100).toFixed(2)
    };

    if (workingPages > 0) {
        console.log(`📊 Frontend Público: ${workingPages}/${pages.length} páginas OK (${results.public.summary.successRate}%)`);
    } else {
        console.log('🚨 FRONTEND PÚBLICO COMPLETAMENTE FORA DO AR');
    }
}

// Análise geral
function analyzeOverall() {
    console.log('\n📊 ANÁLISE GERAL DO SISTEMA');
    console.log('=' * 50);

    const servicesUp = [
        results.backend.status === 'up' || results.backend.status === 'partial',
        results.admin.status === 'up',
        results.public.status === 'up'
    ].filter(Boolean).length;

    results.overall = {
        servicesUp: servicesUp,
        totalServices: 3,
        systemAvailability: ((servicesUp / 3) * 100).toFixed(2),
        backend: results.backend.summary,
        admin: results.admin.summary,
        public: results.public.summary,
        timestamp: new Date().toISOString()
    };

    console.log(`🔧 Serviços Disponíveis: ${servicesUp}/3 (${results.overall.systemAvailability}%)`);
    console.log(`🔴 Backend API: ${results.backend.status.toUpperCase()}`);
    console.log(`🟢 Frontend Admin: ${results.admin.status.toUpperCase()}`);
    console.log(`🟢 Frontend Público: ${results.public.status.toUpperCase()}`);

    // Status geral do sistema
    if (servicesUp === 3) {
        console.log('\n✅ SISTEMA COMPLETAMENTE OPERACIONAL');
    } else if (servicesUp >= 2) {
        console.log('\n⚠️  SISTEMA PARCIALMENTE OPERACIONAL');
    } else if (servicesUp === 1) {
        console.log('\n🚨 SISTEMA COM FALHAS CRÍTICAS');
    } else {
        console.log('\n💥 SISTEMA COMPLETAMENTE FORA DO AR');
    }
}

// Recomendações
function generateRecommendations() {
    console.log('\n🔧 RECOMENDAÇÕES TÉCNICAS');
    console.log('=' * 50);

    const recommendations = [];

    // Backend
    if (results.backend.status === 'down') {
        recommendations.push('🚨 CRÍTICO: Redeploy urgente do backend no Railway');
        recommendations.push('🔍 Verificar logs do backend: railway logs -s backend');
        recommendations.push('🔄 Tentar restart: railway restart -s backend');
        recommendations.push('💾 Verificar banco de dados PostgreSQL');
    }

    // Frontend Admin
    if (results.admin.status === 'down') {
        recommendations.push('⚠️  Redeploy do frontend admin');
        recommendations.push('🔍 Verificar build do React: npm run build');
    } else if (results.admin.summary.successRate < 80) {
        recommendations.push('⚠️  Algumas páginas do admin não estão funcionando');
    }

    // Frontend Público
    if (results.public.status === 'down') {
        recommendations.push('⚠️  Redeploy do frontend público');
        recommendations.push('🔍 Verificar build do Vite: npm run build');
    } else if (results.public.summary.successRate < 80) {
        recommendations.push('⚠️  Algumas páginas públicas não estão funcionando');
    }

    // Recomendações gerais
    if (results.overall.systemAvailability < 100) {
        recommendations.push('📋 Executar validação completa após correções');
        recommendations.push('🧪 Testar integração frontend-backend');
        recommendations.push('📊 Monitorar logs de todos os serviços');
    }

    recommendations.forEach(rec => console.log(rec));

    if (recommendations.length === 0) {
        console.log('✅ Nenhuma recomendação - sistema funcionando perfeitamente');
    }
}

// Função principal
async function runSystemValidation() {
    console.log('🚀 VALIDAÇÃO COMPLETA DO SISTEMA ELEITORAL CAU');
    console.log('Validação sem dependência do backend');
    console.log('=' * 70);
    console.log(`⏰ Iniciado em: ${new Date().toLocaleString()}`);

    const startTime = Date.now();

    try {
        await testBackend();
        await testAdminFrontend();
        await testPublicFrontend();
        
        analyzeOverall();
        generateRecommendations();

        // Salvar relatório
        const reportFile = `relatorio-validacao-sistema-completo-${Date.now()}.json`;
        fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        console.log('\n📋 RELATÓRIO FINAL');
        console.log('=' * 50);
        console.log(`⏱️  Tempo total: ${(totalTime / 1000).toFixed(2)}s`);
        console.log(`💾 Relatório salvo: ${reportFile}`);
        console.log('\n🔗 URLS DOS SERVIÇOS:');
        console.log(`   🔧 Backend: ${SERVICES.backend}`);
        console.log(`   👤 Admin: ${SERVICES.admin}`);
        console.log(`   🌐 Público: ${SERVICES.public}`);

        console.log('\n🎯 VALIDAÇÃO FINALIZADA!');

    } catch (error) {
        console.error('❌ Erro durante validação:', error);
        results.error = error.message;
    }
}

// Executar validação
runSystemValidation().catch(console.error);