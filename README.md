# 🗳️ CAU Sistema Eleitoral - PHP Legacy

Sistema legado do CAU para gestão de eleições. Este sistema está sendo migrado para uma nova arquitetura em .NET com React.

## ⚠️ AVISO

Este é um sistema legado em processo de migração. Não é recomendado fazer novas implementações neste código.

## 📋 Sobre

Sistema desenvolvido em PHP com Doctrine ORM para gerenciar todo o processo eleitoral do CAU, incluindo:
- Cadastro de chapas
- Votação online
- Apuração de resultados
- Gestão de denúncias e impugnações

## 🛠️ Tecnologias

- PHP 7.4+
- Doctrine ORM
- MySQL
- jQuery
- Bootstrap 3

## 📁 Estrutura

```
eleitoral-php-legado/
├── app/           # Lógica da aplicação
├── config/        # Configurações
├── database/      # Migrations e seeds
├── public/        # Arquivos públicos
├── resources/     # Views e assets
└── vendor/        # Dependências
```

## 🚀 Instalação (Apenas para manutenção)

```bash
# Instalar dependências
composer install

# Configurar banco de dados
cp .env.example .env
# Editar .env com suas configurações

# Rodar migrations
php artisan migrate

# Iniciar servidor
php -S localhost:8000 -t public
```

## 🔄 Status da Migração

- ✅ Análise do sistema legado completa
- ✅ Nova arquitetura definida
- 🔄 Migração em andamento (60% completo)
- ⏳ Testes de integração pendentes

## 📝 Documentação

A documentação completa do sistema legado está disponível em `/docs`.

## ⚠️ Problemas Conhecidos

- Performance issues com grandes volumes de dados
- Código não segue padrões modernos
- Falta de testes automatizados
- Vulnerabilidades de segurança corrigidas na nova versão

## 🔗 Nova Versão

A nova versão do sistema está sendo desenvolvida em:
- Backend: https://github.com/brunozexter/cau-sistema-eleitoral-backend
- Frontend: https://github.com/brunozexter/cau-sistema-eleitoral-frontend

## 📝 Licença

Este projeto está sob licença proprietária do CAU.

## 👨‍💻 Autor

**Bruno Souza**
- GitHub: [@brunozexter](https://github.com/brunozexter)