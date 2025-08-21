const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://backend-api-final-production.up.railway.app';
const ADMIN_URL = 'https://admin-frontend-final-production.up.railway.app';
const PUBLIC_URL = 'https://public-frontend-final-production.up.railway.app';

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
        'User-Agent': 'Emergency-Backend-Wakeup/1.0',
        'Accept': 'application/json, text/plain, */*'
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
          url: url
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

async function wakeupBackend() {
  console.log('🚨 EMERGENCY BACKEND RECOVERY - Iniciando...\n');
  
  const results = {
    backend: null,
    admin: null,
    public: null,
    timestamp: new Date().toISOString()
  };

  // 1. Tentar acordar o backend com múltiplas requisições
  console.log('1️⃣ Tentando acordar o Backend...');
  
  const backendEndpoints = [
    `${BACKEND_URL}/api/health`,
    `${BACKEND_URL}/swagger`,
    `${BACKEND_URL}/api/auth/status`,
    `${BACKEND_URL}/api/usuario/ping`,
    `${BACKEND_URL}/`
  ];

  for (let i = 0; i < backendEndpoints.length; i++) {
    console.log(`   Tentativa ${i + 1}: ${backendEndpoints[i]}`);
    const result = await makeRequest(backendEndpoints[i]);
    
    if (result.status === 200 || result.status === 404 || (result.status >= 200 && result.status < 500)) {
      console.log(`   ✅ Backend respondeu! Status: ${result.status}`);
      results.backend = { status: 'ONLINE', details: result };
      break;
    } else {
      console.log(`   ❌ Falha: ${result.status} - ${result.error || 'Unknown'}`);
      results.backend = { status: 'OFFLINE', details: result };
    }
    
    // Aguardar entre tentativas
    if (i < backendEndpoints.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 2. Verificar status dos frontends
  console.log('\n2️⃣ Verificando status dos Frontends...');
  
  console.log('   Frontend Admin...');
  const adminResult = await makeRequest(ADMIN_URL);
  results.admin = {
    status: adminResult.status === 200 ? 'ONLINE' : 'OFFLINE',
    details: adminResult
  };
  console.log(`   Admin: ${results.admin.status} (${adminResult.status})`);

  console.log('   Frontend Público...');
  const publicResult = await makeRequest(PUBLIC_URL);
  results.public = {
    status: publicResult.status === 200 ? 'ONLINE' : 'OFFLINE',
    details: publicResult
  };
  console.log(`   Público: ${results.public.status} (${publicResult.status})`);

  // 3. Relatório final
  console.log('\n📊 RELATÓRIO DE STATUS:');
  console.log(`Backend: ${results.backend?.status || 'UNKNOWN'}`);
  console.log(`Admin Frontend: ${results.admin?.status || 'UNKNOWN'}`);
  console.log(`Public Frontend: ${results.public?.status || 'UNKNOWN'}`);

  // 4. Salvar relatório
  require('fs').writeFileSync(
    'emergency-status-report.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n📄 Relatório salvo em: emergency-status-report.json');
  
  return results;
}

// Executar
wakeupBackend().then(results => {
  console.log('\n🔄 Processo de recuperação concluído.');
  
  if (results.backend?.status === 'ONLINE') {
    console.log('🎉 BACKEND ESTÁ ONLINE!');
  } else {
    console.log('🚨 BACKEND AINDA OFFLINE - Necessário investigação manual');
  }
}).catch(err => {
  console.error('💥 Erro durante recuperação:', err);
});