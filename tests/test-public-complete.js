const https = require('https');
const fs = require('fs');

const PUBLIC_URL = 'https://public-frontend-final-production.up.railway.app';

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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
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

function analyzePageContent(content) {
  const analysis = {
    isHTML: content.includes('<!DOCTYPE html>') || content.includes('<html'),
    hasReact: content.includes('id="root"') || content.includes('React'),
    hasVite: content.includes('vite') || content.includes('/assets/'),
    hasCSS: content.includes('.css') || content.includes('stylesheet'),
    hasJS: content.includes('.js') || content.includes('javascript') || content.includes('script'),
    hasTitle: content.includes('<title>'),
    hasNavigation: content.includes('nav') || content.includes('menu'),
    hasForm: content.includes('<form') || content.includes('input'),
    hasErrors: content.toLowerCase().includes('error') || content.includes('404') || content.includes('500'),
    sizeCategory: content.length < 500 ? 'minimal' : content.length < 2000 ? 'small' : content.length < 10000 ? 'medium' : 'large'
  };

  // Extrair título se existir
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    analysis.title = titleMatch[1];
  }

  return analysis;
}

async function testPublicFrontend() {
  console.log('🌐 TESTE COMPLETO DO FRONTEND PÚBLICO - Iniciando...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: PUBLIC_URL,
    summary: {
      totalPages: 0,
      workingPages: 0,
      errorPages: 0,
      functionalityScore: 0,
      uiScore: 0,
      overallStatus: 'UNKNOWN'
    },
    pages: [],
    functionality: {
      navigation: false,
      forms: false,
      staticContent: false,
      interactivity: false,
      responsive: false
    },
    technical: {
      loadingSpeed: 'UNKNOWN',
      framework: 'UNKNOWN',
      bundler: 'UNKNOWN',
      hasCSS: false,
      hasJS: false
    }
  };

  // Páginas do sistema público para testar
  const publicPages = [
    { name: 'Homepage', path: '', priority: 'HIGH', category: 'navegacao' },
    { name: 'Login', path: '/login', priority: 'HIGH', category: 'autenticacao' },
    { name: 'Entrar', path: '/entrar', priority: 'HIGH', category: 'autenticacao' },
    { name: 'Eleições', path: '/eleicoes', priority: 'HIGH', category: 'funcional' },
    { name: 'Resultados', path: '/resultados', priority: 'HIGH', category: 'funcional' },
    { name: 'Chapas', path: '/chapas', priority: 'HIGH', category: 'funcional' },
    { name: 'Calendário', path: '/calendario', priority: 'MEDIUM', category: 'informacional' },
    { name: 'Denúncias', path: '/denuncias', priority: 'HIGH', category: 'funcional' },
    { name: 'Nova Denúncia', path: '/denuncias/nova', priority: 'HIGH', category: 'formulario' },
    { name: 'Acompanhar Denúncia', path: '/denuncias/acompanhar', priority: 'MEDIUM', category: 'funcional' },
    { name: 'Votação', path: '/votacao', priority: 'HIGH', category: 'funcional' },
    { name: 'Perfil do Eleitor', path: '/perfil', priority: 'MEDIUM', category: 'usuario' },
    { name: 'Área do Eleitor', path: '/eleitor', priority: 'MEDIUM', category: 'usuario' },
    { name: 'Documentos', path: '/documentos', priority: 'MEDIUM', category: 'informacional' },
    { name: 'Transparência', path: '/transparencia', priority: 'MEDIUM', category: 'informacional' },
    { name: 'Normativas', path: '/normativas', priority: 'LOW', category: 'informacional' },
    { name: 'FAQ', path: '/faq', priority: 'MEDIUM', category: 'informacional' },
    { name: 'Contato', path: '/contato', priority: 'MEDIUM', category: 'formulario' },
    { name: 'Área do Candidato', path: '/candidato', priority: 'HIGH', category: 'usuario' },
    { name: 'Inscrição de Chapa', path: '/chapas/inscricao', priority: 'HIGH', category: 'formulario' },
    { name: 'Recursos', path: '/recursos', priority: 'MEDIUM', category: 'informacional' }
  ];

  console.log(`🔍 Testando ${publicPages.length} páginas do frontend público...\n`);

  for (const page of publicPages) {
    const url = `${PUBLIC_URL}${page.path}`;
    console.log(`📄 ${page.name} (${page.priority}) - ${page.path || '/'}`);
    
    const startTime = Date.now();
    const result = await makeRequest(url);
    const loadTime = Date.now() - startTime;
    
    let pageResult = {
      name: page.name,
      path: page.path,
      url: url,
      priority: page.priority,
      category: page.category,
      status: result.status,
      loadTime: loadTime,
      working: false,
      analysis: {},
      issues: []
    };

    results.summary.totalPages++;

    if (result.status === 200) {
      // Analisar conteúdo da página
      pageResult.analysis = analyzePageContent(result.data);
      pageResult.working = pageResult.analysis.isHTML && !pageResult.analysis.hasErrors;
      
      if (pageResult.working) {
        results.summary.workingPages++;
        console.log(`   ✅ OK - ${pageResult.analysis.title || 'Sem título'} (${loadTime}ms)`);
        
        // Verificar funcionalidades específicas
        if (pageResult.analysis.hasForm) {
          results.functionality.forms = true;
        }
        if (pageResult.analysis.hasNavigation) {
          results.functionality.navigation = true;
        }
        if (pageResult.analysis.hasVite) {
          results.technical.bundler = 'Vite';
        }
        if (pageResult.analysis.hasReact) {
          results.technical.framework = 'React';
        }
        if (pageResult.analysis.hasCSS) {
          results.technical.hasCSS = true;
        }
        if (pageResult.analysis.hasJS) {
          results.technical.hasJS = true;
        }
      } else {
        results.summary.errorPages++;
        console.log(`   ❌ ERRO - Conteúdo inválido`);
        pageResult.issues.push('Conteúdo HTML inválido ou com erros');
      }
    } else {
      results.summary.errorPages++;
      console.log(`   ❌ FALHA - Status ${result.status} (${result.error || 'Erro HTTP'})`);
      pageResult.issues.push(`Status HTTP ${result.status}`);
      
      if (result.error) {
        pageResult.issues.push(result.error);
      }
    }

    results.pages.push(pageResult);
  }

  // Calcular pontuações e status geral
  const workingRate = (results.summary.workingPages / results.summary.totalPages);
  results.summary.functionalityScore = Math.round(workingRate * 100);

  // Análise de funcionalidades específicas
  const functionalityCount = Object.values(results.functionality).filter(Boolean).length;
  const technicalCount = Object.values(results.technical).filter(v => v === true || (typeof v === 'string' && v !== 'UNKNOWN')).length;
  
  results.summary.uiScore = Math.round(((functionalityCount / 5) + (technicalCount / 4)) * 50);

  // Determinar status geral
  if (results.summary.functionalityScore >= 80) {
    results.summary.overallStatus = 'EXCELENTE';
  } else if (results.summary.functionalityScore >= 60) {
    results.summary.overallStatus = 'BOM';
  } else if (results.summary.functionalityScore >= 40) {
    results.summary.overallStatus = 'RAZOÁVEL';
  } else if (results.summary.functionalityScore >= 20) {
    results.summary.overallStatus = 'PROBLEMÁTICO';
  } else {
    results.summary.overallStatus = 'CRÍTICO';
  }

  // Análise por categoria
  const categoryAnalysis = {};
  publicPages.forEach(page => {
    if (!categoryAnalysis[page.category]) {
      categoryAnalysis[page.category] = { total: 0, working: 0 };
    }
    categoryAnalysis[page.category].total++;
    
    const pageResult = results.pages.find(p => p.name === page.name);
    if (pageResult && pageResult.working) {
      categoryAnalysis[page.category].working++;
    }
  });

  // Relatório final
  console.log('\n📊 RELATÓRIO DO FRONTEND PÚBLICO');
  console.log('='.repeat(50));
  console.log(`Status Geral: ${results.summary.overallStatus}`);
  console.log(`Páginas Testadas: ${results.summary.totalPages}`);
  console.log(`Páginas Funcionando: ${results.summary.workingPages}`);
  console.log(`Páginas com Erro: ${results.summary.errorPages}`);
  console.log(`Taxa de Sucesso: ${results.summary.functionalityScore}%`);
  console.log(`Pontuação UI/UX: ${results.summary.uiScore}%`);

  console.log('\n🔧 ANÁLISE TÉCNICA:');
  console.log(`Framework: ${results.technical.framework}`);
  console.log(`Bundler: ${results.technical.bundler}`);
  console.log(`CSS Presente: ${results.technical.hasCSS ? 'Sim' : 'Não'}`);
  console.log(`JavaScript Presente: ${results.technical.hasJS ? 'Sim' : 'Não'}`);

  console.log('\n⚙️ FUNCIONALIDADES DETECTADAS:');
  console.log(`Navegação: ${results.functionality.navigation ? '✅' : '❌'}`);
  console.log(`Formulários: ${results.functionality.forms ? '✅' : '❌'}`);

  console.log('\n📋 ANÁLISE POR CATEGORIA:');
  Object.entries(categoryAnalysis).forEach(([category, data]) => {
    const rate = (data.working / data.total * 100).toFixed(1);
    console.log(`${category}: ${data.working}/${data.total} (${rate}%)`);
  });

  console.log('\n🎯 PÁGINAS PRIORITÁRIAS:');
  const highPriorityPages = results.pages.filter(p => p.priority === 'HIGH');
  const highPriorityWorking = highPriorityPages.filter(p => p.working).length;
  console.log(`Funcionando: ${highPriorityWorking}/${highPriorityPages.length} páginas críticas`);

  // Salvar relatório
  const reportPath = 'public-frontend-complete-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);

  return results;
}

// Executar teste
testPublicFrontend().then(results => {
  console.log('\n🏁 Teste do Frontend Público concluído!');
  
  if (results.summary.functionalityScore >= 70) {
    console.log('🎉 FRONTEND PÚBLICO ESTÁ ALTAMENTE FUNCIONAL');
  } else if (results.summary.functionalityScore >= 50) {
    console.log('👍 FRONTEND PÚBLICO ESTÁ RAZOAVELMENTE FUNCIONAL');
  } else {
    console.log('🚨 FRONTEND PÚBLICO COM PROBLEMAS SIGNIFICATIVOS');
  }
}).catch(err => {
  console.error('💥 Erro durante teste do frontend público:', err);
});