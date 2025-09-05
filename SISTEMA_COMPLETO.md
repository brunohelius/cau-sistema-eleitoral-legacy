# Sistema Eleitoral CAU - Estrutura Completa

Este repositório contém a estrutura completa do Sistema Eleitoral CAU, composta por 4 projetos principais:

## 📁 Estrutura dos Projetos

### 1. **sistema-eleitoral-cau-backend** (Spring Boot)
- **Porta**: 8080
- **Tecnologia**: Spring Boot 3.2.0 + Java 17
- **Banco de dados**: PostgreSQL
- **Funcionalidades**: API REST completa com autenticação JWT, gerenciamento de eleições, chapas, votos e usuários

### 2. **sistema-eleitoral-cau-admin** (Angular 15)
- **Porta**: 4200
- **Tecnologia**: Angular 15 + Angular Material + Bootstrap 5
- **Funcionalidades**: Interface administrativa para gerenciar eleições, chapas, usuários e relatórios

### 3. **sistema-eleitoral-cau-public** (Angular 15)
- **Porta**: 4201
- **Tecnologia**: Angular 15 + Angular Material + Bootstrap 5
- **Funcionalidades**: Interface pública para votação e consulta de resultados

### 4. **cau-sistema-eleitoral-legacy** (Angular Legacy)
- **Porta**: 4202
- **Tecnologia**: Angular 12 + Bootstrap 4
- **Funcionalidades**: Sistema legado para manter compatibilidade

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Node.js 16+
- PostgreSQL 13+
- Maven 3.8+
- Angular CLI 15+

### 1. Backend (Spring Boot)
```bash
cd sistema-eleitoral-cau-backend

# Instalar dependências
mvn clean install

# Configurar banco de dados no application.properties
# Criar banco: sistema_eleitoral_cau

# Executar aplicação
mvn spring-boot:run

# Ou executar o JAR
java -jar target/sistema-eleitoral-cau-backend-1.0.0.jar
```

**Acesso**: http://localhost:8080/api
**Swagger**: http://localhost:8080/api/swagger-ui.html

### 2. Sistema Administrativo
```bash
cd sistema-eleitoral-cau-admin

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev

# Build para produção
npm run build:prod
```

**Acesso**: http://localhost:4200

### 3. Sistema Público
```bash
cd sistema-eleitoral-cau-public

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev

# Build para produção
npm run build:prod
```

**Acesso**: http://localhost:4201

### 4. Sistema Legacy
```bash
cd cau-sistema-eleitoral-legacy

# Instalar dependências
npm install

# Executar
npm start
```

**Acesso**: http://localhost:4202

## 📊 Funcionalidades Principais

### Backend API
- ✅ Autenticação JWT
- ✅ CRUD de Usuários
- ✅ CRUD de Eleições
- ✅ CRUD de Chapas
- ✅ Sistema de Votação
- ✅ Relatórios e Estatísticas
- ✅ Documentação Swagger
- ✅ Validações e Segurança

### Sistema Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de eleições
- ✅ Gerenciamento de chapas
- ✅ Relatórios detalhados
- ✅ Interface responsiva

### Sistema Público
- ✅ Interface de votação
- ✅ Consulta de resultados
- ✅ Informações das eleições
- ✅ Validação de votos
- ✅ Interface otimizada para dispositivos móveis

## 🗄️ Estrutura do Banco de Dados

### Principais Entidades
- **Usuario**: Informações dos usuários do sistema
- **Role**: Perfis de acesso (ADMIN, COMISSAO_ELEITORAL, etc.)
- **Eleicao**: Dados das eleições
- **Chapa**: Chapas concorrentes
- **MembroChapa**: Membros de cada chapa
- **Eleitor**: Eleitores aptos a votar
- **Voto**: Registros de votos (anonimizados)
- **DocumentoChapa**: Documentos das chapas

## 🔐 Segurança

- Autenticação JWT
- Autorização baseada em roles
- CORS configurado
- Criptografia de senhas com BCrypt
- Validações de entrada
- Headers de segurança
- Rate limiting (recomendado para produção)

## 📋 Configurações

### Backend - application.properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/sistema_eleitoral_cau
spring.datasource.username=eleitoral_user
spring.datasource.password=eleitoral_pass

# JWT
jwt.secret=SistemaEleitoralCAUSecretKey2024SuperSecreta
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:4200,http://localhost:4201,http://localhost:4202
```

### Frontend - environments
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🧪 Testes

### Backend
```bash
cd sistema-eleitoral-cau-backend
mvn test
```

### Frontend
```bash
# Para cada projeto Angular
npm test
```

## 📦 Deploy

### Backend
```bash
# Build
mvn clean package -DskipTests

# Docker (opcional)
docker build -t sistema-eleitoral-backend .
docker run -p 8080:8080 sistema-eleitoral-backend
```

### Frontend
```bash
# Build para produção
npm run build:prod

# Os arquivos estarão em dist/
```

## 🛠️ Tecnologias Utilizadas

### Backend
- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- PostgreSQL
- JWT
- Swagger/OpenAPI 3
- Maven

### Frontend
- Angular 15
- Angular Material
- Bootstrap 5
- Chart.js
- NgBootstrap
- RxJS
- TypeScript

## 📝 Status dos Projetos

- ✅ **Backend**: Estrutura completa com entidades, repositories, services e controllers
- ✅ **Admin Frontend**: Estrutura completa com módulos, componentes e services
- ✅ **Public Frontend**: Estrutura básica criada
- ✅ **Legacy**: Estrutura básica criada

## 🔄 Próximos Passos

1. Configurar banco de dados PostgreSQL
2. Executar migrações/DDL
3. Implementar componentes Angular restantes
4. Configurar testes automatizados
5. Setup de CI/CD
6. Configurar monitoramento

## 👥 Equipe de Desenvolvimento

- Backend: Spring Boot + PostgreSQL
- Frontend: Angular + Material Design
- DevOps: Docker + CI/CD

## 📄 Licença

Sistema proprietário do Conselho de Arquitetura e Urbanismo (CAU).

---

**Versão**: 1.0.0  
**Última atualização**: 2024-08-28