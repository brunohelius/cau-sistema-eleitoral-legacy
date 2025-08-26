<?php
/**
 * Script para mapear TODAS as APIs e endpoints do Sistema Eleitoral CAU Legacy
 * Analisa o arquivo de rotas e controllers para extrair informações completas
 */

function extrairTodasRotas($arquivoRotas) {
    $conteudo = file_get_contents($arquivoRotas);
    $rotas = [];
    
    // Regex para capturar rotas com mais precisão
    $patterns = [
        "/app\(\)->router->(\w+)\('([^']+)',\s*\[\s*'uses'\s*=>\s*'([^']+)'\s*\]/m",
        "/app\(\)->router->(\w+)\('([^']+)',\s*'([^']+)'/m",
        "/app\(\)->router->(\w+)\('([^']+)',\s*function/m"
    ];
    
    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $conteudo, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $metodo = strtoupper($match[1]);
                $path = $match[2];
                $controller = isset($match[3]) ? $match[3] : 'Closure';
                
                // Determinar se é rota pública ou protegida
                $linhaNumero = substr_count(substr($conteudo, 0, strpos($conteudo, $match[0])), "\n") + 1;
                $isPublica = $linhaNumero < 88; // Linha 88 é onde começam as rotas protegidas
                
                $rotas[] = [
                    'metodo' => $metodo,
                    'path' => $path,
                    'controller' => $controller,
                    'publica' => $isPublica,
                    'linha' => $linhaNumero
                ];
            }
        }
    }
    
    return $rotas;
}

function analisarController($nomeController, $diretorioControllers) {
    $arquivo = $diretorioControllers . '/' . $nomeController . '.php';
    
    if (!file_exists($arquivo)) {
        return null;
    }
    
    $conteudo = file_get_contents($arquivo);
    $metodos = [];
    
    // Extrair métodos públicos
    if (preg_match_all('/public function (\w+)\([^)]*\)/m', $conteudo, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $nomeMetodo = $match[1];
            
            // Pular construtores e métodos especiais
            if (in_array($nomeMetodo, ['__construct', '__destruct'])) {
                continue;
            }
            
            // Extrair documentação OpenAPI se existir
            $posicaoMetodo = strpos($conteudo, $match[0]);
            $antesMetodo = substr($conteudo, max(0, $posicaoMetodo - 2000), 2000);
            
            $parametros = [];
            $codigosStatus = [];
            $descricao = '';
            
            // Extrair informações da documentação OpenAPI
            if (preg_match('/@OA\\\\(Get|Post|Put|Delete|Patch)\([^)]*path="([^"]*)"[^)]*\)/s', $antesMetodo, $oaMatch)) {
                $descricao = $oaMatch[2];
            }
            
            if (preg_match('/@OA\\\\Response\([^)]*response=(\d+)[^)]*description="([^"]*)"/s', $antesMetodo, $respMatch)) {
                $codigosStatus[] = [
                    'codigo' => $respMatch[1],
                    'descricao' => $respMatch[2]
                ];
            }
            
            $metodos[] = [
                'nome' => $nomeMetodo,
                'descricao' => $descricao,
                'parametros' => $parametros,
                'codigosStatus' => $codigosStatus
            ];
        }
    }
    
    return $metodos;
}

function mapearDominios($rotas) {
    $dominios = [];
    
    foreach ($rotas as $rota) {
        $path = $rota['path'];
        
        // Determinar domínio baseado no path
        if (strpos($path, 'auth') === 0) {
            $dominio = 'Autenticação';
        } elseif (strpos($path, 'chapas') === 0 || strpos($path, 'membrosChapa') === 0) {
            $dominio = 'Gestão de Chapas';
        } elseif (strpos($path, 'calendarios') === 0) {
            $dominio = 'Calendário Eleitoral';
        } elseif (strpos($path, 'membroComissao') === 0) {
            $dominio = 'Comissão Eleitoral';
        } elseif (strpos($path, 'denuncia') === 0 || strpos($path, 'denuncias') === 0) {
            $dominio = 'Denúncias';
        } elseif (strpos($path, 'impugnacao') !== false || strpos($path, 'pedidoImpugnacao') !== false) {
            $dominio = 'Impugnações';
        } elseif (strpos($path, 'substituicao') !== false || strpos($path, 'pedidosSubstituicao') !== false) {
            $dominio = 'Substituições';
        } elseif (strpos($path, 'julgamento') !== false || strpos($path, 'julgar') !== false) {
            $dominio = 'Julgamentos';
        } elseif (strpos($path, 'recurso') !== false) {
            $dominio = 'Recursos';
        } elseif (strpos($path, 'termo') !== false || strpos($path, 'diploma') !== false) {
            $dominio = 'Documentos Oficiais';
        } elseif (strpos($path, 'arquivo') !== false || strpos($path, 'download') !== false) {
            $dominio = 'Gestão de Arquivos';
        } elseif (strpos($path, 'email') !== false || strpos($path, 'cabecalho') !== false) {
            $dominio = 'Comunicação/Email';
        } elseif (strpos($path, 'conselheiros') === 0 || strpos($path, 'profissionais') === 0) {
            $dominio = 'Gestão de Profissionais';
        } elseif (strpos($path, 'atividades') === 0) {
            $dominio = 'Atividades Eleitorais';
        } else {
            $dominio = 'Outros';
        }
        
        if (!isset($dominios[$dominio])) {
            $dominios[$dominio] = [];
        }
        
        $dominios[$dominio][] = $rota;
    }
    
    return $dominios;
}

// Execução principal
$diretorioBase = __DIR__;
$arquivoRotas = $diretorioBase . '/routes/web.php';
$diretorioControllers = $diretorioBase . '/app/Http/Controllers';

echo "🔍 MAPEAMENTO COMPLETO DAS APIs - SISTEMA ELEITORAL CAU LEGACY\n";
echo "================================================================\n\n";

// 1. Extrair todas as rotas
echo "📋 Extraindo todas as rotas...\n";
$rotas = extrairTodasRotas($arquivoRotas);
echo "✅ Encontradas " . count($rotas) . " rotas\n\n";

// 2. Mapear por domínios
echo "🗂️  Mapeando por domínios funcionais...\n";
$dominios = mapearDominios($rotas);

// 3. Analisar controllers
echo "🔎 Analisando controllers...\n";
$controllersAnalisados = [];
foreach ($rotas as $rota) {
    if (strpos($rota['controller'], '@') !== false) {
        [$nomeController] = explode('@', $rota['controller']);
        
        if (!isset($controllersAnalisados[$nomeController])) {
            $metodos = analisarController($nomeController, $diretorioControllers);
            $controllersAnalisados[$nomeController] = $metodos;
        }
    }
}

// 4. Gerar relatório completo
echo "\n📊 RELATÓRIO COMPLETO DOS ENDPOINTS\n";
echo "====================================\n\n";

echo "📈 ESTATÍSTICAS GERAIS:\n";
echo "- Total de rotas: " . count($rotas) . "\n";
echo "- Rotas públicas: " . count(array_filter($rotas, fn($r) => $r['publica'])) . "\n";
echo "- Rotas protegidas: " . count(array_filter($rotas, fn($r) => !$r['publica'])) . "\n";
echo "- Controllers únicos: " . count($controllersAnalisados) . "\n";
echo "- Domínios funcionais: " . count($dominios) . "\n\n";

echo "🌐 ROTAS PÚBLICAS (sem autenticação):\n";
echo "=====================================\n";
foreach ($rotas as $rota) {
    if ($rota['publica']) {
        echo "🔓 {$rota['metodo']} /{$rota['path']} -> {$rota['controller']}\n";
    }
}

echo "\n🔐 DOMÍNIOS FUNCIONAIS E ENDPOINTS:\n";
echo "====================================\n";

foreach ($dominios as $nomeDominio => $rotasDominio) {
    echo "\n📁 {$nomeDominio} (" . count($rotasDominio) . " endpoints):\n";
    echo str_repeat("-", 50) . "\n";
    
    foreach ($rotasDominio as $rota) {
        $protecao = $rota['publica'] ? '🔓' : '🔐';
        echo "{$protecao} {$rota['metodo']} /{$rota['path']}\n";
        echo "   Controller: {$rota['controller']}\n";
        
        // Adicionar detalhes do método se disponível
        if (strpos($rota['controller'], '@') !== false) {
            [$controller, $metodo] = explode('@', $rota['controller']);
            if (isset($controllersAnalisados[$controller])) {
                $metodosController = $controllersAnalisados[$controller];
                $metodoInfo = array_filter($metodosController, fn($m) => $m['nome'] === $metodo);
                if (!empty($metodoInfo)) {
                    $info = array_values($metodoInfo)[0];
                    if (!empty($info['descricao'])) {
                        echo "   Descrição: {$info['descricao']}\n";
                    }
                }
            }
        }
        echo "\n";
    }
}

echo "\n🛠️ MIDDLEWARES E SEGURANÇA:\n";
echo "============================\n";
echo "- Middleware padrão: auth:usuarios|pessoas (para rotas protegidas)\n";
echo "- Sistema de autenticação: Token-based\n";
echo "- CORS configurado para: GET, POST, PUT, DELETE, OPTIONS\n";
echo "- Headers permitidos: Authorization, X-Token, X-Requested-With, Content-type\n\n";

echo "📋 CÓDIGOS DE STATUS HTTP COMUNS:\n";
echo "==================================\n";
echo "- 200: Sucesso\n";
echo "- 400: Erro do cliente / Validação\n";
echo "- 403: Não autorizado\n";
echo "- 500: Erro interno do servidor\n\n";

echo "🏗️ ARQUITETURA DO SISTEMA:\n";
echo "==========================\n";
echo "- Framework: Lumen (Laravel micro-framework)\n";
echo "- Padrão: Controller -> Business Object (BO) -> Entity/Repository\n";
echo "- Documentação: OpenAPI/Swagger annotations\n";
echo "- Validação: Request validation e Business rules\n";
echo "- Resposta: JSON padronizado\n\n";

echo "✅ Mapeamento concluído!\n";
echo "🔧 Para mais detalhes, consulte os controllers em: app/Http/Controllers/\n";
echo "📁 Business logic em: app/Business/\n";
echo "🗂️ Entities em: app/Entities/\n\n";

echo "⚠️  ENDPOINTS CRÍTICOS IDENTIFICADOS:\n";
echo "======================================\n";
$endpointsCriticos = [
    'auth/login' => 'Autenticação principal do sistema',
    'chapas/salvar' => 'Criação/edição de chapas eleitorais', 
    'chapas/{id}/confirmarChapa' => 'Confirmação de chapas para eleição',
    'membrosChapa/aceitarConvite' => 'Aceitação de convites para participação',
    'denuncia/salvar' => 'Registro de denúncias',
    'denuncia/julgar_admissibilidade' => 'Julgamento de admissibilidade de denúncias',
    'julgamentoFinal/salvar' => 'Julgamentos finais de processos',
    'calendarios/salvar' => 'Gestão do calendário eleitoral'
];

foreach ($endpointsCriticos as $endpoint => $descricao) {
    echo "🚨 {$endpoint}: {$descricao}\n";
}

echo "\n📊 ANÁLISE FINAL REALIZADA COM SUCESSO!\n";
echo "Total de " . count($rotas) . " endpoints mapeados e documentados.\n";
?>