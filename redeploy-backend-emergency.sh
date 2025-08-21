#!/bin/bash

echo "🚨 EMERGENCY BACKEND REDEPLOY - Iniciando..."

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Tentar redeploy do backend
echo "🔄 Tentando redeploy do backend..."

# Navegar para diretório do backend
cd "sistema-eleitoral-cau-backend" || {
    echo "❌ Diretório backend não encontrado"
    exit 1
}

# Fazer link com projeto Railway (se necessário)
echo "🔗 Fazendo link com projeto Railway..."
echo "8d9cce38-4a5b-4c7a-bfbd-4b6307ec6b10" | railway link

# Verificar status atual
echo "📊 Status atual do projeto..."
railway status

# Fazer redeploy
echo "🚀 Executando redeploy..."
railway up --detach

# Aguardar e verificar se voltou online
echo "⏳ Aguardando deploy... (60 segundos)"
sleep 60

# Testar se backend voltou online
echo "🔍 Testando se backend voltou online..."
curl -s -o /dev/null -w "%{http_code}" https://backend-api-final-production.up.railway.app/swagger

echo ""
echo "✅ Redeploy iniciado. Verificar logs com: railway logs"
echo "🌐 URL: https://backend-api-final-production.up.railway.app/swagger"