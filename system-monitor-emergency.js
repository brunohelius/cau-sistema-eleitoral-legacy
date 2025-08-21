const https = require('https');
const fs = require('fs');

const SERVICES = {
  backend: 'https://backend-api-final-production.up.railway.app',
  admin: 'https://admin-frontend-final-production.up.railway.app',
  public: 'https://public-frontend-final-production.up.railway.app'
};

const ENDPOINTS_TO_MONITOR = {
  backend: ['/api/health', '/swagger', '/api/auth/status'],
  admin: ['/', '/login'],
  public: ['/', '/login', '/eleicoes']
};

function makeRequest(url, timeout = 10000) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'CAU-System-Monitor/1.0',
        'Accept': 'text/html,application/json,*/*;q=0.8'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          responseTime: Date.now() - startTime,
          headers: res.headers,
          contentLength: data.length,
          url: url
        });
      });
    });

    const startTime = Date.now();

    req.on('error', (err) => {
      resolve({
        status: 'ERROR',
        success: false,
        error: err.message,
        responseTime: Date.now() - startTime,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout',
        responseTime: timeout,
        url: url
      });
    });

    req.end();
  });
}

async function checkServiceHealth(serviceName, baseUrl, endpoints) {
  const results = [];
  let totalTests = 0;
  let passedTests = 0;

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    const result = await makeRequest(url);
    
    totalTests++;
    if (result.success) {
      passedTests++;
    }

    results.push({
      endpoint,
      url,
      status: result.status,
      success: result.success,
      responseTime: result.responseTime,
      error: result.error
    });
  }

  const healthScore = (passedTests / totalTests * 100).toFixed(1);
  const overallStatus = healthScore >= 80 ? 'HEALTHY' : healthScore >= 50 ? 'DEGRADED' : 'CRITICAL';

  return {
    service: serviceName,
    baseUrl,
    overallStatus,
    healthScore: parseFloat(healthScore),
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    endpoints: results,
    timestamp: new Date().toISOString()
  };
}

async function monitorAllServices() {
  console.log('🚨 MONITORAMENTO EMERGENCIAL DO SISTEMA - CAU Electoral\n');
  console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}\n`);

  const monitoringResults = {
    timestamp: new Date().toISOString(),
    overallStatus: 'UNKNOWN',
    services: {},
    summary: {
      totalServices: 0,
      healthyServices: 0,
      degradedServices: 0,
      criticalServices: 0,
      systemScore: 0
    },
    alerts: [],
    recommendations: []
  };

  // Testar cada serviço
  for (const [serviceName, baseUrl] of Object.entries(SERVICES)) {
    console.log(`🔍 Testando ${serviceName.toUpperCase()} (${baseUrl})`);
    
    const serviceHealth = await checkServiceHealth(
      serviceName,
      baseUrl,
      ENDPOINTS_TO_MONITOR[serviceName]
    );

    monitoringResults.services[serviceName] = serviceHealth;
    monitoringResults.summary.totalServices++;

    // Categorizar status
    if (serviceHealth.overallStatus === 'HEALTHY') {
      monitoringResults.summary.healthyServices++;
      console.log(`   ✅ Status: ${serviceHealth.overallStatus} (${serviceHealth.healthScore}%)`);
    } else if (serviceHealth.overallStatus === 'DEGRADED') {
      monitoringResults.summary.degradedServices++;
      console.log(`   ⚠️ Status: ${serviceHealth.overallStatus} (${serviceHealth.healthScore}%)`);
      monitoringResults.alerts.push({
        severity: 'WARNING',
        service: serviceName,
        message: `Serviço ${serviceName} com performance degradada (${serviceHealth.healthScore}%)`
      });
    } else {
      monitoringResults.summary.criticalServices++;
      console.log(`   🔴 Status: ${serviceHealth.overallStatus} (${serviceHealth.healthScore}%)`);
      monitoringResults.alerts.push({
        severity: 'CRITICAL',
        service: serviceName,
        message: `Serviço ${serviceName} com falhas críticas (${serviceHealth.healthScore}%)`
      });
    }

    // Detalhar endpoints com problemas
    const failedEndpoints = serviceHealth.endpoints.filter(e => !e.success);
    if (failedEndpoints.length > 0) {
      console.log(`   💥 Endpoints com falha:`);
      failedEndpoints.forEach(endpoint => {
        console.log(`      - ${endpoint.endpoint}: ${endpoint.status} (${endpoint.error || 'HTTP Error'})`);
      });
    }

    console.log('');
  }

  // Calcular score geral do sistema
  const totalHealthScore = Object.values(monitoringResults.services)
    .reduce((sum, service) => sum + service.healthScore, 0);
  monitoringResults.summary.systemScore = (totalHealthScore / monitoringResults.summary.totalServices).toFixed(1);

  // Determinar status geral
  if (monitoringResults.summary.systemScore >= 80) {
    monitoringResults.overallStatus = 'HEALTHY';
  } else if (monitoringResults.summary.systemScore >= 60) {
    monitoringResults.overallStatus = 'DEGRADED';
  } else {
    monitoringResults.overallStatus = 'CRITICAL';
  }

  // Gerar recomendações
  if (monitoringResults.services.backend.overallStatus === 'CRITICAL') {
    monitoringResults.recommendations.push({
      priority: 'URGENT',
      action: 'Reiniciar serviço backend Railway',
      command: 'cd sistema-eleitoral-cau-backend && railway up',
      reason: 'Backend API completamente offline'
    });
  }

  if (monitoringResults.summary.criticalServices > 0) {
    monitoringResults.recommendations.push({
      priority: 'HIGH',
      action: 'Verificar logs detalhados',
      command: 'railway logs',
      reason: `${monitoringResults.summary.criticalServices} serviço(s) em estado crítico`
    });
  }

  if (monitoringResults.summary.systemScore < 50) {
    monitoringResults.recommendations.push({
      priority: 'HIGH',
      action: 'Implementar fallback ou página de manutenção',
      reason: 'Sistema com disponibilidade baixa para usuários'
    });
  }

  // Relatório resumido
  console.log('📊 RESUMO DO MONITORAMENTO');
  console.log('='.repeat(50));
  console.log(`Status Geral: ${monitoringResults.overallStatus}`);
  console.log(`Score do Sistema: ${monitoringResults.summary.systemScore}%`);
  console.log(`Serviços Saudáveis: ${monitoringResults.summary.healthyServices}/${monitoringResults.summary.totalServices}`);
  console.log(`Serviços Degradados: ${monitoringResults.summary.degradedServices}/${monitoringResults.summary.totalServices}`);
  console.log(`Serviços Críticos: ${monitoringResults.summary.criticalServices}/${monitoringResults.summary.totalServices}`);

  // Alertas
  if (monitoringResults.alerts.length > 0) {
    console.log('\n🚨 ALERTAS ATIVOS:');
    monitoringResults.alerts.forEach((alert, index) => {
      const icon = alert.severity === 'CRITICAL' ? '🔴' : '⚠️';
      console.log(`   ${index + 1}. ${icon} [${alert.severity}] ${alert.message}`);
    });
  }

  // Recomendações
  if (monitoringResults.recommendations.length > 0) {
    console.log('\n🔧 AÇÕES RECOMENDADAS:');
    monitoringResults.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.action}`);
      if (rec.command) {
        console.log(`      Comando: ${rec.command}`);
      }
      console.log(`      Motivo: ${rec.reason}`);
      console.log('');
    });
  }

  // Salvar relatório
  const reportPath = `monitoring-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(monitoringResults, null, 2));
  console.log(`📄 Relatório detalhado salvo em: ${reportPath}`);

  return monitoringResults;
}

async function continuousMonitoring() {
  console.log('🔄 INICIANDO MONITORAMENTO CONTÍNUO...\n');
  
  let monitoringCount = 0;
  const maxMonitoringCycles = 10; // Máximo 10 ciclos para este emergency mode
  
  while (monitoringCount < maxMonitoringCycles) {
    monitoringCount++;
    console.log(`\n📡 CICLO DE MONITORAMENTO ${monitoringCount}/${maxMonitoringCycles}`);
    console.log('─'.repeat(60));
    
    const results = await monitorAllServices();
    
    // Condições para parar o monitoramento
    if (results.overallStatus === 'HEALTHY') {
      console.log('\n🎉 SISTEMA RECUPERADO! Todos os serviços estão funcionando.');
      break;
    }
    
    if (results.services.backend.overallStatus === 'HEALTHY') {
      console.log('\n✅ BACKEND RECUPERADO! Monitoramento pode ser reduzido.');
      break;
    }
    
    // Aguardar antes do próximo ciclo (30 segundos)
    if (monitoringCount < maxMonitoringCycles) {
      console.log('\n⏳ Aguardando 30 segundos para próximo ciclo...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log('\n🏁 Monitoramento emergencial concluído.');
}

// Executar monitoramento
if (process.argv.includes('--continuous')) {
  continuousMonitoring().catch(err => {
    console.error('💥 Erro durante monitoramento contínuo:', err);
  });
} else {
  monitorAllServices().then(results => {
    console.log('\n🏁 Monitoramento único concluído!');
    
    if (results.overallStatus === 'CRITICAL') {
      console.log('🚨 SISTEMA CRÍTICO - Intervenção urgente necessária');
      console.log('💡 Execute: node system-monitor-emergency.js --continuous');
    }
  }).catch(err => {
    console.error('💥 Erro durante monitoramento:', err);
  });
}