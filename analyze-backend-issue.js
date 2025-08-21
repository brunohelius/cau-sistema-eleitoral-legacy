const https = require('https');
const fs = require('fs');

const BACKEND_URL = 'https://backend-api-final-production.up.railway.app';

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: 15000,
      headers: {
        'User-Agent': 'Railway-Diagnostic-Tool/1.0',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
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
          contentLength: data.length,
          contentType: res.headers['content-type'] || 'unknown'
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
        error: 'Request timeout (15s)',
        url: url
      });
    });

    req.end();
  });
}

async function diagnoseBackendIssue() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO BACKEND - Railway\n');
  
  const diagnosis = {
    timestamp: new Date().toISOString(),
    backendUrl: BACKEND_URL,
    railwayStatus: {
      accessible: false,
      statusCode: null,
      headers: {},
      errorType: 'UNKNOWN'
    },
    endpointTests: [],
    possibleCauses: [],
    recommendations: [],
    healthChecks: {
      network: false,
      dns: false,
      ssl: false,
      service: false
    },
    railwayInfo: {
      edge: null,
      fallback: false,
      requestId: null
    }
  };

  // 1. TESTE BÁSICO DE CONECTIVIDADE
  console.log('1️⃣ TESTE DE CONECTIVIDADE BÁSICA');
  
  const basicEndpoints = [
    { name: 'Root', path: '/' },
    { name: 'Health Check', path: '/health' },
    { name: 'API Health', path: '/api/health' },
    { name: 'Swagger UI', path: '/swagger' },
    { name: 'Swagger JSON', path: '/swagger/v1/swagger.json' },
    { name: 'API Root', path: '/api' },
    { name: 'Auth Status', path: '/api/auth/status' }
  ];

  for (const endpoint of basicEndpoints) {
    const url = `${BACKEND_URL}${endpoint.path}`;
    console.log(`   Testando: ${endpoint.name} - ${endpoint.path}`);
    
    const result = await makeRequest(url);
    
    const endpointResult = {
      name: endpoint.name,
      path: endpoint.path,
      url: url,
      status: result.status,
      error: result.error,
      responseTime: null,
      headers: result.headers || {},
      contentLength: result.contentLength || 0,
      analysis: {
        accessible: false,
        railwayRelated: false,
        serviceIssue: false
      }
    };

    // Análise do resultado
    if (result.status === 200) {
      endpointResult.analysis.accessible = true;
      console.log(`   ✅ ${endpoint.name}: OK (${result.status})`);
    } else if (result.status === 502 || result.status === 503 || result.status === 504) {
      endpointResult.analysis.serviceIssue = true;
      console.log(`   🔴 ${endpoint.name}: Service Error (${result.status})`);
    } else if (result.status === 404) {
      endpointResult.analysis.accessible = true; // Service is up, endpoint not found
      console.log(`   🟡 ${endpoint.name}: Not Found (${result.status})`);
    } else {
      console.log(`   ❌ ${endpoint.name}: ${result.status || result.error}`);
    }

    // Verificar headers Railway
    if (result.headers) {
      if (result.headers['x-railway-edge']) {
        endpointResult.analysis.railwayRelated = true;
        diagnosis.railwayInfo.edge = result.headers['x-railway-edge'];
      }
      if (result.headers['x-railway-fallback']) {
        diagnosis.railwayInfo.fallback = result.headers['x-railway-fallback'] === 'true';
      }
      if (result.headers['x-railway-request-id']) {
        diagnosis.railwayInfo.requestId = result.headers['x-railway-request-id'];
      }
    }

    diagnosis.endpointTests.push(endpointResult);
  }

  // 2. ANÁLISE DOS RESULTADOS
  console.log('\n2️⃣ ANÁLISE DOS RESULTADOS');
  
  const workingEndpoints = diagnosis.endpointTests.filter(e => e.analysis.accessible).length;
  const serviceErrors = diagnosis.endpointTests.filter(e => e.analysis.serviceIssue).length;
  const railwayEdgeDetected = diagnosis.endpointTests.some(e => e.analysis.railwayRelated);

  diagnosis.railwayStatus.accessible = workingEndpoints > 0;
  diagnosis.healthChecks.network = railwayEdgeDetected;
  diagnosis.healthChecks.dns = railwayEdgeDetected;
  diagnosis.healthChecks.ssl = true; // HTTPS funcionando

  console.log(`   Endpoints testados: ${diagnosis.endpointTests.length}`);
  console.log(`   Endpoints funcionando: ${workingEndpoints}`);
  console.log(`   Erros de serviço (502/503/504): ${serviceErrors}`);
  console.log(`   Railway Edge detectado: ${railwayEdgeDetected ? 'Sim' : 'Não'}`);
  console.log(`   Fallback ativo: ${diagnosis.railwayInfo.fallback ? 'Sim' : 'Não'}`);

  // 3. DETERMINAÇÃO DE POSSÍVEIS CAUSAS
  console.log('\n3️⃣ POSSÍVEIS CAUSAS DO PROBLEMA');
  
  if (serviceErrors === diagnosis.endpointTests.length) {
    diagnosis.possibleCauses.push({
      cause: 'APPLICATION_CRASH',
      description: 'Aplicação .NET pode ter crashado ou falhou ao inicializar',
      likelihood: 'HIGH',
      evidence: 'Todos os endpoints retornam 502 Bad Gateway'
    });
  }

  if (railwayEdgeDetected && serviceErrors > 0) {
    diagnosis.possibleCauses.push({
      cause: 'STARTUP_FAILURE',
      description: 'Serviço não consegue inicializar corretamente no Railway',
      likelihood: 'HIGH',
      evidence: 'Railway Edge ativo mas serviço não responde'
    });
  }

  if (diagnosis.railwayInfo.fallback) {
    diagnosis.possibleCauses.push({
      cause: 'RAILWAY_FALLBACK',
      description: 'Railway ativou sistema de fallback por falha no serviço',
      likelihood: 'MEDIUM',
      evidence: 'Header x-railway-fallback presente'
    });
  }

  // Causas específicas para .NET
  diagnosis.possibleCauses.push({
    cause: 'DOTNET_DEPENDENCY_ERROR',
    description: 'Erro de dependências .NET ou packages NuGet',
    likelihood: 'MEDIUM',
    evidence: 'Aplicação .NET em ambiente Linux/Docker'
  });

  diagnosis.possibleCauses.push({
    cause: 'DATABASE_CONNECTION_ERROR',
    description: 'Falha na conexão com PostgreSQL',
    likelihood: 'HIGH',
    evidence: 'Sistema depende de banco de dados para inicializar'
  });

  diagnosis.possibleCauses.push({
    cause: 'ENVIRONMENT_VARIABLES_ERROR',
    description: 'Configuração incorreta de variáveis de ambiente',
    likelihood: 'MEDIUM',
    evidence: 'Sistema depende de configurações específicas'
  });

  // 4. RECOMENDAÇÕES DE CORREÇÃO
  console.log('\n4️⃣ RECOMENDAÇÕES DE CORREÇÃO');
  
  diagnosis.recommendations = [
    {
      priority: 'HIGH',
      action: 'Verificar logs Railway detalhados',
      command: 'railway logs --tail 100',
      description: 'Examinar logs de startup e runtime para identificar erro específico'
    },
    {
      priority: 'HIGH',
      action: 'Testar conexão com banco de dados',
      command: 'railway run dotnet ef database update',
      description: 'Verificar se migrations estão aplicadas e conexão DB funciona'
    },
    {
      priority: 'HIGH',
      action: 'Redeploy completo do serviço',
      command: 'railway up --detach',
      description: 'Forçar rebuild e redeploy do container'
    },
    {
      priority: 'MEDIUM',
      action: 'Verificar Dockerfile e configurações',
      description: 'Revisar arquivo Dockerfile e configurações de porta/ambiente'
    },
    {
      priority: 'MEDIUM',
      action: 'Testar localmente',
      command: 'dotnet run --project SistemaEleitoral.Api',
      description: 'Verificar se aplicação funciona localmente'
    },
    {
      priority: 'LOW',
      action: 'Verificar limites de recursos Railway',
      description: 'Confirmar se serviço não está excedendo limites de CPU/memória'
    }
  ];

  // Output das recomendações
  diagnosis.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. [${rec.priority}] ${rec.action}`);
    if (rec.command) {
      console.log(`      Comando: ${rec.command}`);
    }
    console.log(`      ${rec.description}`);
  });

  // 5. RESUMO EXECUTIVO
  console.log('\n5️⃣ RESUMO EXECUTIVO');
  console.log('═'.repeat(50));
  
  let overallStatus = 'CRITICAL';
  let mainIssue = 'UNKNOWN';
  
  if (serviceErrors === diagnosis.endpointTests.length) {
    overallStatus = 'CRITICAL';
    mainIssue = 'SERVICE_DOWN';
    console.log('🔴 STATUS: CRÍTICO - Serviço completamente offline');
  } else if (serviceErrors > 0) {
    overallStatus = 'DEGRADED';
    mainIssue = 'PARTIAL_FAILURE';
    console.log('🟡 STATUS: DEGRADADO - Falhas parciais no serviço');
  } else if (workingEndpoints > 0) {
    overallStatus = 'HEALTHY';
    mainIssue = 'NONE';
    console.log('🟢 STATUS: SAUDÁVEL - Serviço funcionando');
  }

  diagnosis.railwayStatus.statusCode = mainIssue;
  diagnosis.railwayStatus.errorType = overallStatus;

  console.log(`Endpoints afetados: ${serviceErrors}/${diagnosis.endpointTests.length}`);
  console.log(`Causa mais provável: ${diagnosis.possibleCauses[0]?.cause || 'Indeterminada'}`);
  console.log(`Ação recomendada: ${diagnosis.recommendations[0]?.action || 'Investigação manual'}`);

  // Salvar diagnóstico
  const reportPath = 'backend-diagnosis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(diagnosis, null, 2));
  console.log(`\n📄 Diagnóstico completo salvo em: ${reportPath}`);

  return diagnosis;
}

// Executar diagnóstico
diagnoseBackendIssue().then(diagnosis => {
  console.log('\n🏁 Diagnóstico do Backend concluído!');
  
  if (diagnosis.railwayStatus.errorType === 'CRITICAL') {
    console.log('🚨 INTERVENÇÃO URGENTE NECESSÁRIA');
    console.log('🔧 Executar: railway logs && railway up');
  } else if (diagnosis.railwayStatus.errorType === 'DEGRADED') {
    console.log('⚠️ MONITORAMENTO NECESSÁRIO');
  } else {
    console.log('✅ SISTEMA OPERACIONAL');
  }
}).catch(err => {
  console.error('💥 Erro durante diagnóstico:', err);
});