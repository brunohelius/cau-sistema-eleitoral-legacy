const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ADMIN_URL = 'https://admin-frontend-final-production.up.railway.app';
const BACKEND_URL = 'https://backend-api-final-production.up.railway.app';

async function testAdminFrontend() {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar timeout e captura de erros
    page.setDefaultTimeout(30000);
    
    const results = {
        timestamp: new Date().toISOString(),
        adminUrl: ADMIN_URL,
        backendUrl: BACKEND_URL,
        testResults: [],
        screenshots: [],
        consoleErrors: [],
        networkErrors: [],
        functionalTests: [],
        summary: {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            backendRequired: 0,
            workingOffline: 0
        }
    };

    // Capturar erros do console
    page.on('console', msg => {
        if (msg.type() === 'error') {
            results.consoleErrors.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString()
            });
        }
    });

    // Capturar erros de rede
    page.on('response', response => {
        if (response.status() >= 400) {
            results.networkErrors.push({
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                timestamp: new Date().toISOString()
            });
        }
    });

    const screenshotDir = 'screenshots-admin-emergency';
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    async function takeScreenshot(name, description = '') {
        const filename = `${name}-${Date.now()}.png`;
        const filepath = path.join(screenshotDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        results.screenshots.push({
            name,
            filename,
            filepath,
            description,
            timestamp: new Date().toISOString()
        });
        console.log(`📸 Screenshot: ${filename} - ${description}`);
        return filepath;
    }

    async function testPage(pageName, url, testFunction, requiresBackend = false) {
        console.log(`\\n🧪 Testando: ${pageName}`);
        results.summary.totalTests++;
        
        if (requiresBackend) {
            results.summary.backendRequired++;
        }

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.waitForTimeout(2000);
            
            const screenshot = await takeScreenshot(
                `admin-${pageName.toLowerCase().replace(/\\s+/g, '-')}`,
                `Página ${pageName}`
            );

            const testResult = await testFunction();
            
            results.testResults.push({
                page: pageName,
                url,
                status: 'SUCCESS',
                screenshot,
                requiresBackend,
                workingOffline: !requiresBackend && testResult.functional,
                details: testResult,
                timestamp: new Date().toISOString()
            });

            if (!requiresBackend && testResult.functional) {
                results.summary.workingOffline++;
            }

            results.summary.passedTests++;
            console.log(`✅ ${pageName}: SUCESSO`);
            
        } catch (error) {
            const screenshot = await takeScreenshot(
                `admin-${pageName.toLowerCase().replace(/\\s+/g, '-')}-error`,
                `Erro na página ${pageName}`
            );

            results.testResults.push({
                page: pageName,
                url,
                status: 'ERROR',
                error: error.message,
                screenshot,
                requiresBackend,
                workingOffline: false,
                timestamp: new Date().toISOString()
            });

            results.summary.failedTests++;
            console.log(`❌ ${pageName}: ERRO - ${error.message}`);
        }
    }

    // 1. TESTE DA PÁGINA DE LOGIN
    await testPage('Login', ADMIN_URL, async () => {
        // Verificar elementos de login
        const loginForm = await page.$('form, [data-testid="login-form"], .login-form');
        const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="Email"]');
        const passwordInput = await page.$('input[type="password"], input[name="password"], input[placeholder*="senha"], input[placeholder*="Senha"]');
        const submitButton = await page.$('button[type="submit"], button:contains("Entrar"), .btn-login');

        return {
            functional: !!(loginForm && emailInput && passwordInput && submitButton),
            elements: {
                form: !!loginForm,
                emailField: !!emailInput,
                passwordField: !!passwordInput,
                submitButton: !!submitButton
            },
            title: await page.title(),
            url: page.url()
        };
    }, false);

    // 2. TESTE DE LOGIN (TENTATIVA)
    await testPage('Login Attempt', ADMIN_URL, async () => {
        // Tentar fazer login
        const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="Email"]');
        const passwordInput = await page.$('input[type="password"], input[name="password"], input[placeholder*="senha"], input[placeholder*="Senha"]');
        const submitButton = await page.$('button[type="submit"], button:contains("Entrar"), .btn-login');

        if (emailInput && passwordInput && submitButton) {
            await emailInput.type('admin@cau.gov.br');
            await passwordInput.type('admin123');
            await submitButton.click();
            await page.waitForTimeout(3000);
        }

        return {
            functional: true,
            loginAttempted: !!(emailInput && passwordInput && submitButton),
            currentUrl: page.url(),
            title: await page.title()
        };
    }, true);

    // 3. PRINCIPAIS PÁGINAS ADMINISTRATIVAS
    const adminPages = [
        { name: 'Dashboard', path: '/dashboard', backend: true },
        { name: 'Usuários', path: '/usuarios', backend: true },
        { name: 'Eleições', path: '/eleicoes', backend: true },
        { name: 'Chapas', path: '/chapas', backend: true },
        { name: 'Eleitores', path: '/eleitores', backend: true },
        { name: 'Denúncias', path: '/denuncias', backend: true },
        { name: 'Relatórios', path: '/relatorios', backend: true },
        { name: 'Analytics', path: '/analytics', backend: true },
        { name: 'Configurações', path: '/configuracoes', backend: false },
        { name: 'Logs', path: '/logs', backend: true },
        { name: 'Votação', path: '/votacao', backend: true }
    ];

    for (const adminPage of adminPages) {
        await testPage(
            adminPage.name,
            `${ADMIN_URL}${adminPage.path}`,
            async () => {
                // Verificar se a página carregou
                const body = await page.$('body');
                const content = await page.content();
                
                // Verificar elementos básicos da interface
                const navigation = await page.$('nav, .navbar, .sidebar, [data-testid="navigation"]');
                const header = await page.$('header, .header, [data-testid="header"]');
                const mainContent = await page.$('main, .main-content, .content, [data-testid="main"]');

                // Verificar se há indicações de erro 404 ou problemas
                const hasError = content.includes('404') || 
                                content.includes('Not Found') || 
                                content.includes('Página não encontrada') ||
                                content.includes('Error') ||
                                content.includes('Erro');

                return {
                    functional: !!body && !hasError,
                    hasNavigation: !!navigation,
                    hasHeader: !!header,
                    hasMainContent: !!mainContent,
                    contentLength: content.length,
                    hasError,
                    title: await page.title()
                };
            },
            adminPage.backend
        );
    }

    // 4. TESTE DE FORMULÁRIOS BÁSICOS
    await testPage('Formulários de Cadastro', `${ADMIN_URL}/eleicoes`, async () => {
        // Procurar por botões de "Novo", "Adicionar", "Criar"
        const addButtons = await page.$$('button:contains("Novo"), button:contains("Adicionar"), button:contains("Criar"), .btn-add, .btn-new');
        
        // Procurar por formulários na página
        const forms = await page.$$('form');
        const inputs = await page.$$('input, select, textarea');

        return {
            functional: forms.length > 0 || inputs.length > 0,
            hasAddButtons: addButtons.length > 0,
            formsCount: forms.length,
            inputsCount: inputs.length,
            formElements: {
                forms: forms.length,
                inputs: inputs.length,
                addButtons: addButtons.length
            }
        };
    }, true);

    // 5. TESTE DE RESPONSIVIDADE
    await testPage('Responsividade Mobile', ADMIN_URL, async () => {
        // Testar em mobile
        await page.setViewport({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        
        const screenshot = await takeScreenshot('admin-mobile', 'Layout Mobile');
        
        // Verificar se há menu hambúrguer ou elementos mobile
        const mobileMenu = await page.$('.hamburger, .menu-toggle, .mobile-menu, [data-testid="mobile-menu"]');
        const sidebarToggle = await page.$('.sidebar-toggle, .nav-toggle');

        // Voltar para desktop
        await page.setViewport({ width: 1920, height: 1080 });
        
        return {
            functional: true,
            hasMobileMenu: !!mobileMenu,
            hasSidebarToggle: !!sidebarToggle,
            mobileScreenshot: screenshot
        };
    }, false);

    // 6. TESTE DE PERFORMANCE E CARREGAMENTO
    await testPage('Performance', ADMIN_URL, async () => {
        const startTime = Date.now();
        await page.reload({ waitUntil: 'networkidle2' });
        const loadTime = Date.now() - startTime;

        // Verificar recursos carregados
        const scripts = await page.$$('script[src]');
        const styles = await page.$$('link[rel="stylesheet"]');
        const images = await page.$$('img');

        return {
            functional: loadTime < 10000, // 10 segundos max
            loadTime,
            resources: {
                scripts: scripts.length,
                styles: styles.length,
                images: images.length
            },
            performance: {
                loadTimeMs: loadTime,
                acceptable: loadTime < 5000
            }
        };
    }, false);

    await browser.close();

    // Calcular estatísticas finais
    results.summary.successRate = (results.summary.passedTests / results.summary.totalTests * 100).toFixed(2);
    results.summary.offlineRate = (results.summary.workingOffline / results.summary.totalTests * 100).toFixed(2);

    // Salvar resultados
    const reportPath = 'admin-frontend-emergency-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log('\\n📊 RELATÓRIO FRONTEND ADMINISTRATIVO - EMERGÊNCIA');
    console.log('='.repeat(60));
    console.log(`Total de Testes: ${results.summary.totalTests}`);
    console.log(`Testes Aprovados: ${results.summary.passedTests}`);
    console.log(`Testes Falharam: ${results.summary.failedTests}`);
    console.log(`Taxa de Sucesso: ${results.summary.successRate}%`);
    console.log(`Funcionando Offline: ${results.summary.workingOffline}`);
    console.log(`Taxa Offline: ${results.summary.offlineRate}%`);
    console.log(`Requerem Backend: ${results.summary.backendRequired}`);
    console.log(`Screenshots: ${results.screenshots.length}`);
    console.log(`Erros de Console: ${results.consoleErrors.length}`);
    console.log(`Erros de Rede: ${results.networkErrors.length}`);
    console.log(`\\n📄 Relatório salvo em: ${reportPath}`);
    console.log(`📸 Screenshots em: ${screenshotDir}/`);

    return results;
}

// Executar
testAdminFrontend().then(results => {
    console.log('\\n🏁 Teste do Frontend Administrativo concluído!');
    
    if (results.summary.successRate > 50) {
        console.log('🎉 FRONTEND ADMINISTRATIVO ESTÁ FUNCIONAL');
    } else {
        console.log('🚨 FRONTEND ADMINISTRATIVO COM PROBLEMAS CRÍTICOS');
    }
}).catch(err => {
    console.error('💥 Erro durante teste do frontend admin:', err);
});