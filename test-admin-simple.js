const https = require('https');
const http = require('http');
const fs = require('fs');

const ADMIN_URL = 'https://admin-frontend-final-production.up.railway.app';
const PUBLIC_URL = 'https://public-frontend-final-production.up.railway.app';
const BACKEND_URL = 'https://backend-api-final-production.up.railway.app';

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: 30000,
      headers: {
        'User-Agent': 'Emergency-Frontend-Test/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    };

    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url,
          contentLength: data.length
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'ERROR',
        error: err.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        error: 'Request timeout (30s)',
        url: url
      });
    });

    req.end();
  });
}

async function testFrontends() {
  console.log('🚨 TESTE EMERGENCIAL DOS FRONTENDS - Iniciando...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    admin: {
      baseUrl: ADMIN_URL,
      tests: [],
      status: 'UNKNOWN',
      functional: false
    },
    public: {
      baseUrl: PUBLIC_URL,
      tests: [],
      status: 'UNKNOWN',
      functional: false
    },
    backend: {
      baseUrl: BACKEND_URL,
      tests: [],
      status: 'UNKNOWN',
      functional: false
    },
    summary: {
      adminWorking: false,
      publicWorking: false,
      backendWorking: false,
      totalTests: 0,
      passedTests: 0
    }
  };

  // TESTES DO FRONTEND ADMINISTRATIVO
  console.log('1️⃣ TESTANDO FRONTEND ADMINISTRATIVO...');
  
  const adminPages = [
    { name: 'Homepage', path: '' },
    { name: 'Login', path: '/login' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Usuarios', path: '/usuarios' },
    { name: 'Eleicoes', path: '/eleicoes' },
    { name: 'Chapas', path: '/chapas' },
    { name: 'Eleitores', path: '/eleitores' },
    { name: 'Denuncias', path: '/denuncias' },
    { name: 'Relatorios', path: '/relatorios' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Configuracoes', path: '/configuracoes' },
    { name: 'Logs', path: '/logs' },
    { name: 'Votacao', path: '/votacao' }
  ];

  for (const page of adminPages) {
    const url = `${ADMIN_URL}${page.path}`;
    console.log(`   Testando: ${page.name} - ${url}`);
    
    const result = await makeRequest(url);
    const isWorking = result.status === 200 && result.contentLength > 1000;
    
    results.admin.tests.push({
      page: page.name,
      url: url,
      status: result.status,
      working: isWorking,
      contentLength: result.contentLength,
      error: result.error
    });

    results.summary.totalTests++;
    if (isWorking) {
      results.summary.passedTests++;
      console.log(`   ✅ ${page.name}: OK (${result.status})`);
    } else {
      console.log(`   ❌ ${page.name}: FALHA (${result.status || result.error})`);
    }
  }

  // Determinar se frontend admin está funcional
  const adminWorkingPages = results.admin.tests.filter(t => t.working).length;
  results.admin.functional = adminWorkingPages >= 3; // Pelo menos 3 páginas funcionando
  results.admin.status = results.admin.functional ? 'ONLINE' : 'OFFLINE';
  results.summary.adminWorking = results.admin.functional;

  console.log(`   📊 Admin: ${adminWorkingPages}/${adminPages.length} páginas funcionando`);

  // TESTES DO FRONTEND PÚBLICO
  console.log('\n2️⃣ TESTANDO FRONTEND PÚBLICO...');
  
  const publicPages = [
    { name: 'Homepage', path: '' },
    { name: 'Login', path: '/login' },
    { name: 'Eleicoes', path: '/eleicoes' },
    { name: 'Resultados', path: '/resultados' },
    { name: 'Chapas', path: '/chapas' },
    { name: 'Calendario', path: '/calendario' },
    { name: 'Denuncias', path: '/denuncias' },
    { name: 'Nova Denuncia', path: '/denuncias/nova' },
    { name: 'Acompanhar Denuncia', path: '/denuncias/acompanhar' },
    { name: 'Votacao', path: '/votacao' },
    { name: 'Perfil Eleitor', path: '/perfil' },
    { name: 'Documentos', path: '/documentos' },
    { name: 'Transparencia', path: '/transparencia' },
    { name: 'Normativas', path: '/normativas' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contato', path: '/contato' },
    { name: 'Area Candidato', path: '/candidato' },
    { name: 'Inscricao Chapa', path: '/chapas/inscricao' },
    { name: 'Recursos', path: '/recursos' }
  ];

  for (const page of publicPages) {
    const url = `${PUBLIC_URL}${page.path}`;
    console.log(`   Testando: ${page.name} - ${url}`);
    
    const result = await makeRequest(url);
    const isWorking = result.status === 200 && result.contentLength > 1000;
    
    results.public.tests.push({
      page: page.name,
      url: url,
      status: result.status,
      working: isWorking,
      contentLength: result.contentLength,
      error: result.error
    });

    results.summary.totalTests++;
    if (isWorking) {
      results.summary.passedTests++;
      console.log(`   ✅ ${page.name}: OK (${result.status})`);
    } else {
      console.log(`   ❌ ${page.name}: FALHA (${result.status || result.error})`);
    }
  }

  // Determinar se frontend público está funcional
  const publicWorkingPages = results.public.tests.filter(t => t.working).length;
  results.public.functional = publicWorkingPages >= 5; // Pelo menos 5 páginas funcionando
  results.public.status = results.public.functional ? 'ONLINE' : 'OFFLINE';
  results.summary.publicWorking = results.public.functional;

  console.log(`   📊 Público: ${publicWorkingPages}/${publicPages.length} páginas funcionando`);

  // TESTES DO BACKEND
  console.log('\n3️⃣ TESTANDO BACKEND API...');
  
  const backendEndpoints = [
    { name: 'Health', path: '/api/health' },
    { name: 'Swagger', path: '/swagger' },
    { name: 'Auth Status', path: '/api/auth/status' },
    { name: 'Usuarios', path: '/api/usuarios' },
    { name: 'Eleicoes', path: '/api/eleicoes' },
    { name: 'Chapas', path: '/api/chapas' },
    { name: 'Denuncias', path: '/api/denuncias' },
    { name: 'Analytics', path: '/api/analytics' }
  ];

  for (const endpoint of backendEndpoints) {
    const url = `${BACKEND_URL}${endpoint.path}`;
    console.log(`   Testando: ${endpoint.name} - ${url}`);
    
    const result = await makeRequest(url);
    const isWorking = result.status >= 200 && result.status < 500; // Aceita 401, 403, etc
    
    results.backend.tests.push({
      endpoint: endpoint.name,
      url: url,
      status: result.status,
      working: isWorking,
      contentLength: result.contentLength,
      error: result.error
    });

    results.summary.totalTests++;
    if (isWorking) {
      results.summary.passedTests++;
      console.log(`   ✅ ${endpoint.name}: OK (${result.status})`);
    } else {
      console.log(`   ❌ ${endpoint.name}: FALHA (${result.status || result.error})`);
    }
  }

  // Determinar se backend está funcional
  const backendWorkingEndpoints = results.backend.tests.filter(t => t.working).length;
  results.backend.functional = backendWorkingEndpoints >= 2; // Pelo menos 2 endpoints funcionando
  results.backend.status = results.backend.functional ? 'ONLINE' : 'OFFLINE';
  results.summary.backendWorking = results.backend.functional;

  console.log(`   📊 Backend: ${backendWorkingEndpoints}/${backendEndpoints.length} endpoints funcionando`);

  // RELATÓRIO FINAL
  console.log('\n📊 RELATÓRIO EMERGENCIAL FINAL');
  console.log('='.repeat(50));
  console.log(`Frontend Admin: ${results.admin.status} (${results.admin.functional ? 'FUNCIONAL' : 'OFFLINE'})`);
  console.log(`Frontend Público: ${results.public.status} (${results.public.functional ? 'FUNCIONAL' : 'OFFLINE'})`);
  console.log(`Backend API: ${results.backend.status} (${results.backend.functional ? 'FUNCIONAL' : 'OFFLINE'})`);
  console.log(`Total Testes: ${results.summary.totalTests}`);
  console.log(`Testes Aprovados: ${results.summary.passedTests}`);
  console.log(`Taxa de Sucesso: ${(results.summary.passedTests / results.summary.totalTests * 100).toFixed(2)}%`);

  // Análise da situação
  console.log('\n🔍 ANÁLISE DA SITUAÇÃO:');
  if (results.summary.adminWorking && results.summary.publicWorking) {
    console.log('🎉 FRONTENDS ESTÃO FUNCIONAIS - Sistema disponível para usuários');
  } else if (results.summary.adminWorking || results.summary.publicWorking) {
    console.log('⚠️ FUNCIONAMENTO PARCIAL - Alguns frontends offline');
  } else {
    console.log('🚨 SISTEMA CRÍTICO - Frontends offline');
  }

  if (!results.summary.backendWorking) {
    console.log('🔴 BACKEND OFFLINE - Funcionalidades limitadas sem API');
  } else {
    console.log('🟢 BACKEND ONLINE - API funcionando normalmente');
  }

  // Salvar relatório
  const reportPath = 'emergency-frontends-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);

  return results;
}

// Executar teste
testFrontends().then(results => {
  console.log('\n🏁 Testes emergenciais concluídos!');
  
  if (results.summary.adminWorking || results.summary.publicWorking) {
    console.log('✅ PELO MENOS UM FRONTEND ESTÁ FUNCIONAL');
  } else {
    console.log('❌ TODOS OS FRONTENDS ESTÃO OFFLINE');
  }
}).catch(err => {
  console.error('💥 Erro durante testes:', err);
});