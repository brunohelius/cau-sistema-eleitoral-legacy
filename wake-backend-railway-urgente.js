#!/usr/bin/env node

/**
 * WAKE UP BACKEND - RAILWAY
 * Tenta acordar o backend e fazer múltiplas requisições
 */

const https = require('https');

const API_URL = 'https://backend-api-final-production.up.railway.app';

function makeRequest(url) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const req = https.request(url, {
            method: 'GET',
            timeout: 30000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const endTime = Date.now();
                resolve({
                    success: res.statusCode < 500,
                    statusCode: res.statusCode,
                    responseTime: endTime - startTime,
                    data: data.substring(0, 200)
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                responseTime: Date.now() - startTime
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                responseTime: 30000
            });
        });

        req.end();
    });
}

async function wakeUpBackend() {
    console.log('🔄 Tentando acordar o backend Railway...');
    console.log(`📡 URL: ${API_URL}`);
    
    const endpoints = [
        '',
        '/api',
        '/swagger',
        '/health'
    ];
    
    for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`\n🔄 Tentativa ${attempt}/5`);
        
        for (const endpoint of endpoints) {
            const url = `${API_URL}${endpoint}`;
            console.log(`⏳ Testando: ${endpoint || 'root'}...`);
            
            const result = await makeRequest(url);
            
            if (result.success) {
                console.log(`✅ ${endpoint || 'root'}: OK (${result.statusCode}) - ${result.responseTime}ms`);
            } else {
                console.log(`❌ ${endpoint || 'root'}: ERRO (${result.statusCode || 'N/A'}) - ${result.responseTime}ms`);
                if (result.data) {
                    console.log(`   Resposta: ${result.data}`);
                }
            }
        }
        
        if (attempt < 5) {
            console.log('⏱️  Aguardando 10s antes da próxima tentativa...');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    console.log('\n🏁 Finalizado. Tentando uma validação básica...');
    
    // Teste final para verificar se acordou
    const finalTest = await makeRequest(`${API_URL}/swagger`);
    
    if (finalTest.success) {
        console.log('🎉 BACKEND ACORDOU! Swagger está respondendo.');
        return true;
    } else {
        console.log('😴 Backend ainda não acordou ou há problemas.');
        return false;
    }
}

wakeUpBackend().then(success => {
    if (success) {
        console.log('\n✅ Backend está ativo. Você pode executar a validação completa agora.');
    } else {
        console.log('\n❌ Backend não conseguiu ser ativado. Pode haver problemas no deploy.');
    }
}).catch(console.error);