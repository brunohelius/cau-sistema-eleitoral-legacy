# ANÁLISE COMPLETA DO SCHEMA DE BANCO DE DADOS - SISTEMA ELEITORAL CAU (PHP Legacy)

## RESUMO EXECUTIVO

Esta análise documenta completamente a estrutura do banco de dados do sistema eleitoral CAU implementado em PHP com Doctrine ORM. O sistema possui **177 entidades** mapeadas, organizadas em dois schemas principais: `eleitoral` e `public`.

---

## 1. LOCALIZAÇÃO E ANÁLISE DE MIGRATIONS

### 1.1 Estrutura de Migrations
- **Pasta**: `database/migrations/` (VAZIA - sem migrations encontradas)
- **Scripts Manuais**: `database/scripts/` (2 arquivos SQL)
  - `HST132.sql` - Inserts para tipos de corpo de email (IDs 122-127)
  - `HST133.sql` - Inserts para tipos de corpo de email (IDs 128-135)

### 1.2 Observações sobre Migrations
- O projeto não utiliza migrations tradicionais do Laravel/Doctrine
- A estrutura do banco é definida através das anotações ORM nas entidades
- Scripts SQL manuais são utilizados para dados específicos

---

## 2. MAPEAMENTO COMPLETO DE TABELAS

### 2.1 SCHEMA ELEITORAL (Schema Principal)

#### **TABELA: TB_ELEICAO**
```sql
CREATE TABLE eleitoral.TB_ELEICAO (
    ID_ELEICAO INTEGER PRIMARY KEY,
    NU_ANO INTEGER(4) NOT NULL,
    ID_CALENDARIO INTEGER NOT NULL REFERENCES eleitoral.TB_CALENDARIO(ID_CALENDARIO),
    ID_TIPO_PROCESSO INTEGER NOT NULL REFERENCES eleitoral.TB_TIPO_PROCESSO(ID_TIPO_PROCESSO),
    SQ_ANO INTEGER(3) NOT NULL
);
CREATE SEQUENCE eleitoral.TB_ELEICAO_ID_SEQ;
```

#### **TABELA: TB_CHAPA_ELEICAO**
```sql
CREATE TABLE eleitoral.TB_CHAPA_ELEICAO (
    ID_CHAPA_ELEICAO INTEGER PRIMARY KEY,
    ID_CAU_UF INTEGER NOT NULL REFERENCES public.tb_filial(id),
    ID_PROFISSIONAL_INCLUSAO INTEGER,
    ID_ETAPA INTEGER NOT NULL,
    NU_CHAPA INTEGER,
    DS_PLATAFORMA TEXT NOT NULL,
    ST_RESPOSTA_DECLARACAO BOOLEAN NOT NULL,
    ST_EXCLUIDO BOOLEAN NOT NULL,
    ID_ATIV_SECUNDARIA INTEGER NOT NULL REFERENCES eleitoral.TB_ATIV_SECUNDARIA_CALENDARIO(ID_ATIV_SECUNDARIA),
    ID_TP_CANDIDATURA INTEGER NOT NULL REFERENCES eleitoral.TB_TP_CANDIDATURA(ID_TP_CANDIDATURA),
    ID_STATUS_CHAPA_JULGAMENTO_FINAL INTEGER NOT NULL REFERENCES eleitoral.TB_STATUS_CHAPA_JULGAMENTO_FINAL(ID),
    ID_PROFISSIONAL_INCLUSAO_PLATAFORMA INTEGER REFERENCES public.tb_profissional(id),
    ID_USUARIO_INCLUSAO_PLATAFORMA INTEGER REFERENCES eleitoral.TB_USUARIO(id)
);
CREATE SEQUENCE eleitoral.tb_chapa_eleicao_id_seq;
```

#### **TABELA: TB_MEMBRO_CHAPA**
```sql
CREATE TABLE eleitoral.TB_MEMBRO_CHAPA (
    ID_MEMBRO_CHAPA INTEGER PRIMARY KEY,
    ID_CHAPA_ELEICAO INTEGER NOT NULL REFERENCES eleitoral.TB_CHAPA_ELEICAO(ID_CHAPA_ELEICAO),
    ID_TP_PARTIC_CHAPA INTEGER NOT NULL REFERENCES eleitoral.TB_TP_PARTIC_CHAPA(ID_TP_PARTIC_CHAPA),
    ID_TP_MEMBRO_CHAPA INTEGER NOT NULL REFERENCES eleitoral.TB_TP_MEMBRO_CHAPA(ID_TP_MEMBRO_CHAPA),
    ID_SUPLENTE INTEGER REFERENCES eleitoral.TB_MEMBRO_CHAPA(ID_MEMBRO_CHAPA),
    ID_PROFISSIONAL INTEGER NOT NULL REFERENCES public.tb_profissional(id),
    NR_ORDEM INTEGER,
    ST_RESPONSAVEL BOOLEAN NOT NULL,
    ST_RESPOSTA_DECLARACAO BOOLEAN NOT NULL,
    DS_SINTESE_CURRICULO TEXT,
    NM_ARQUIVO_FOTO VARCHAR(200)
);
CREATE SEQUENCE eleitoral.tb_membro_chapa_id_seq;
```

#### **TABELA: TB_CALENDARIO**
```sql
CREATE TABLE eleitoral.TB_CALENDARIO (
    ID_CALENDARIO INTEGER PRIMARY KEY,
    ST_IES BOOLEAN NOT NULL,
    DT_INI_VIGENCIA DATE NOT NULL,
    DT_FIM_VIGENCIA DATE NOT NULL,
    NU_IDADE_INI INTEGER(2) NOT NULL,
    NU_IDADE_FIM INTEGER(2) NOT NULL,
    DT_INI_MANDATO DATE NOT NULL,
    DT_FIM_MANDATO DATE NOT NULL,
    ST_ATIVO BOOLEAN NOT NULL,
    ST_EXCLUIDO BOOLEAN NOT NULL
);
CREATE SEQUENCE eleitoral.TB_CALENDARIO_ID_SEQ;
```

#### **TABELA: TB_DENUNCIA**
```sql
CREATE TABLE eleitoral.TB_DENUNCIA (
    ID_DENUNCIA INTEGER PRIMARY KEY,
    ID_PESSOA INTEGER NOT NULL REFERENCES public.tb_pessoa(id),
    ID_TIPO_DENUNCIA INTEGER NOT NULL REFERENCES eleitoral.TB_TIPO_DENUNCIA(ID_TIPO_DENUNCIA),
    ID_ATIV_SECUNDARIA INTEGER NOT NULL REFERENCES eleitoral.TB_ATIV_SECUNDARIA_CALENDARIO(ID_ATIV_SECUNDARIA),
    DS_FATOS VARCHAR(2000) NOT NULL,
    SQ_DENUNCIA INTEGER NOT NULL,
    id_cau_uf INTEGER REFERENCES public.tb_filial(id)
);
CREATE SEQUENCE eleitoral.tb_denuncia_id_seq;
```

### 2.2 SCHEMA PUBLIC (Schema Compartilhado)

#### **TABELA: tb_profissional**
```sql
CREATE TABLE public.tb_profissional (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    nome_social VARCHAR,
    registro_nacional VARCHAR,
    data_nascimento TIMESTAMP,
    cpf VARCHAR(11) NOT NULL,
    pessoa_id INTEGER NOT NULL REFERENCES public.tb_pessoa(id),
    identidade VARCHAR,
    identidade_data_expedicao TIMESTAMP,
    rne VARCHAR,
    rne_data_validade TIMESTAMP,
    sexo VARCHAR(1),
    naturalidade VARCHAR,
    uf_naturalidade VARCHAR,
    nome_pai VARCHAR,
    nome_mae VARCHAR,
    observacao VARCHAR,
    tipo_sanguineo VARCHAR(2)
);
```

#### **TABELA: tb_pessoa**
```sql
CREATE TABLE public.tb_pessoa (
    id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL
);
CREATE SEQUENCE public.tb_pessoa_id_seq;
```

#### **TABELA: tb_filial**
```sql
CREATE TABLE public.tb_filial (
    id INTEGER PRIMARY KEY,
    prefixo VARCHAR NOT NULL,
    descricao VARCHAR NOT NULL
);
```

---

## 3. ANÁLISE DE RELACIONAMENTOS

### 3.1 Relacionamentos Principais (1:N)

1. **Eleição → Chapas**
   - `TB_ELEICAO.ID_ELEICAO` ← `TB_CHAPA_ELEICAO.ID_ELEICAO` (via calendário)

2. **Chapa → Membros**
   - `TB_CHAPA_ELEICAO.ID_CHAPA_ELEICAO` ← `TB_MEMBRO_CHAPA.ID_CHAPA_ELEICAO`

3. **Profissional → Membros de Chapa**
   - `public.tb_profissional.id` ← `TB_MEMBRO_CHAPA.ID_PROFISSIONAL`

4. **Filial (CAU/UF) → Chapas**
   - `public.tb_filial.id` ← `TB_CHAPA_ELEICAO.ID_CAU_UF`

### 3.2 Relacionamentos de Autoreferência

1. **Membro Titular ← Suplente**
   - `TB_MEMBRO_CHAPA.ID_MEMBRO_CHAPA` ← `TB_MEMBRO_CHAPA.ID_SUPLENTE`

### 3.3 Relacionamentos 1:1

1. **Eleição ↔ Calendário**
   - `TB_ELEICAO.ID_CALENDARIO` ↔ `TB_CALENDARIO.ID_CALENDARIO`

2. **Profissional ↔ Pessoa**
   - `public.tb_profissional.pessoa_id` ↔ `public.tb_pessoa.id`

### 3.4 Tabelas de Domínio/Lookup

#### Tipos de Participação e Membros:
- `TB_TP_PARTIC_CHAPA` - Tipos de participação na chapa
- `TB_TP_MEMBRO_CHAPA` - Tipos de membro da chapa
- `TB_TP_CANDIDATURA` - Tipos de candidatura
- `TB_TIPO_PROCESSO` - Tipos de processo eleitoral
- `TB_TIPO_DENUNCIA` - Tipos de denúncia

#### Status e Situações:
- `TB_STATUS_CHAPA_JULGAMENTO_FINAL` - Status de julgamento final
- `TB_SITUACAO_CALENDARIO` - Situações do calendário
- `TB_SITUACAO_ELEICAO` - Situações da eleição
- `TB_SITUACAO_MEMBRO_CHAPA` - Situações do membro da chapa

---

## 4. ENTIDADES POR CATEGORIA

### 4.1 Entidades Principais (22 entidades)
- Eleicao, ChapaEleicao, MembroChapa, Calendario, Denuncia
- Profissional, Pessoa, Filial, Usuario
- JulgamentoFinal, JulgamentoImpugnacao, PedidoSubstituicaoChapa
- ImpugnacaoResultado, RecursoImpugnacao, etc.

### 4.2 Entidades de Arquivos (23 entidades)
- ArquivoCalendario, ArquivoDenuncia, ArquivoPedidoImpugnacao
- ArquivoDefesaImpugnacao, ArquivoJulgamentoDenuncia, etc.

### 4.3 Entidades de Histórico (12 entidades)
- HistoricoChapaEleicao, HistoricoCalendario, HistoricoDenuncia
- HistoricoParametroConselheiro, etc.

### 4.4 Entidades de Tipos/Domínio (45 entidades)
- TipoMembroChapa, TipoParticipacaoChapa, TipoCandidatura
- TipoDenuncia, TipoProcesso, TipoEncaminhamento, etc.

### 4.5 Entidades de Status/Situação (18 entidades)
- StatusChapa, StatusJulgamentoFinal, SituacaoEleicao
- SituacaoCalendario, SituacaoMembroChapa, etc.

### 4.6 Entidades de Julgamento/Recurso (25 entidades)
- JulgamentoFinal, JulgamentoImpugnacao, JulgamentoDenuncia
- RecursoImpugnacao, RecursoJulgamentoFinal, etc.

### 4.7 Entidades de Email/Comunicação (8 entidades)
- CabecalhoEmail, CorpoEmail, EmailAtividadeSecundaria, etc.

### 4.8 Entidades de Atividades/Calendário (12 entidades)
- AtividadePrincipalCalendario, AtividadeSecundariaCalendario
- PrazoCalendario, UfCalendario, etc.

### 4.9 Entidades de Apoio/Auxiliares (12 entidades)
- Declaracao, RespostaDeclaracao, PublicacaoDocumento
- RedeSocialChapa, TestemunhaDenuncia, etc.

---

## 5. DADOS DE SEEDS E INICIALIZAÇÃO

### 5.1 DatabaseSeeder
- **Arquivo**: `database/seeds/DatabaseSeeder.php`
- **Status**: Vazio - não há seeds configurados

### 5.2 Dados Iniciais Identificados
Os scripts SQL manuais inserem dados para tipos de corpo de email:

**Tipos de Email (TB_TP_CORPO_EMAIL):**
- IDs 122-135: Emails para diferentes etapas do processo eleitoral
- Notificações para denúncias, julgamentos, recursos, etc.

---

## 6. SCRIPT DDL COMPLETO

### 6.1 Criação dos Schemas
```sql
CREATE SCHEMA eleitoral;
CREATE SCHEMA public;
```

### 6.2 Tabelas Principais do Schema Eleitoral
```sql
-- =============================================
-- SCHEMA ELEITORAL - TABELAS PRINCIPAIS
-- =============================================

-- Tabela de Eleições
CREATE TABLE eleitoral.TB_ELEICAO (
    ID_ELEICAO INTEGER NOT NULL,
    NU_ANO INTEGER NOT NULL,
    ID_CALENDARIO INTEGER NOT NULL,
    ID_TIPO_PROCESSO INTEGER NOT NULL,
    SQ_ANO INTEGER NOT NULL,
    CONSTRAINT PK_TB_ELEICAO PRIMARY KEY (ID_ELEICAO)
);

-- Tabela de Calendário Eleitoral
CREATE TABLE eleitoral.TB_CALENDARIO (
    ID_CALENDARIO INTEGER NOT NULL,
    ST_IES BOOLEAN NOT NULL,
    DT_INI_VIGENCIA DATE NOT NULL,
    DT_FIM_VIGENCIA DATE NOT NULL,
    NU_IDADE_INI INTEGER NOT NULL,
    NU_IDADE_FIM INTEGER NOT NULL,
    DT_INI_MANDATO DATE NOT NULL,
    DT_FIM_MANDATO DATE NOT NULL,
    ST_ATIVO BOOLEAN NOT NULL,
    ST_EXCLUIDO BOOLEAN NOT NULL,
    CONSTRAINT PK_TB_CALENDARIO PRIMARY KEY (ID_CALENDARIO)
);

-- Tabela de Chapas Eleitorais
CREATE TABLE eleitoral.TB_CHAPA_ELEICAO (
    ID_CHAPA_ELEICAO INTEGER NOT NULL,
    ID_CAU_UF INTEGER NOT NULL,
    ID_PROFISSIONAL_INCLUSAO INTEGER,
    ID_ETAPA INTEGER NOT NULL,
    NU_CHAPA INTEGER,
    DS_PLATAFORMA TEXT NOT NULL,
    ST_RESPOSTA_DECLARACAO BOOLEAN NOT NULL,
    ST_EXCLUIDO BOOLEAN NOT NULL,
    ID_ATIV_SECUNDARIA INTEGER NOT NULL,
    ID_TP_CANDIDATURA INTEGER NOT NULL,
    ID_STATUS_CHAPA_JULGAMENTO_FINAL INTEGER NOT NULL,
    ID_PROFISSIONAL_INCLUSAO_PLATAFORMA INTEGER,
    ID_USUARIO_INCLUSAO_PLATAFORMA INTEGER,
    CONSTRAINT PK_TB_CHAPA_ELEICAO PRIMARY KEY (ID_CHAPA_ELEICAO)
);

-- Tabela de Membros da Chapa
CREATE TABLE eleitoral.TB_MEMBRO_CHAPA (
    ID_MEMBRO_CHAPA INTEGER NOT NULL,
    ID_CHAPA_ELEICAO INTEGER NOT NULL,
    ID_TP_PARTIC_CHAPA INTEGER NOT NULL,
    ID_TP_MEMBRO_CHAPA INTEGER NOT NULL,
    ID_SUPLENTE INTEGER,
    ID_PROFISSIONAL INTEGER NOT NULL,
    NR_ORDEM INTEGER,
    ST_RESPONSAVEL BOOLEAN NOT NULL,
    ST_RESPOSTA_DECLARACAO BOOLEAN NOT NULL,
    DS_SINTESE_CURRICULO TEXT,
    NM_ARQUIVO_FOTO VARCHAR(200),
    CONSTRAINT PK_TB_MEMBRO_CHAPA PRIMARY KEY (ID_MEMBRO_CHAPA)
);

-- Tabela de Denúncias
CREATE TABLE eleitoral.TB_DENUNCIA (
    ID_DENUNCIA INTEGER NOT NULL,
    ID_PESSOA INTEGER NOT NULL,
    ID_TIPO_DENUNCIA INTEGER NOT NULL,
    ID_ATIV_SECUNDARIA INTEGER NOT NULL,
    DS_FATOS VARCHAR(2000) NOT NULL,
    SQ_DENUNCIA INTEGER NOT NULL,
    id_cau_uf INTEGER,
    CONSTRAINT PK_TB_DENUNCIA PRIMARY KEY (ID_DENUNCIA)
);

-- Tabelas de Tipos/Domínio
CREATE TABLE eleitoral.TB_TP_CANDIDATURA (
    ID_TP_CANDIDATURA INTEGER NOT NULL,
    DS_TP_CANDIDATURA VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_TP_CANDIDATURA PRIMARY KEY (ID_TP_CANDIDATURA)
);

CREATE TABLE eleitoral.TB_TP_MEMBRO_CHAPA (
    ID_TP_MEMBRO_CHAPA INTEGER NOT NULL,
    DS_TP_MEMBRO_CHAPA VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_TP_MEMBRO_CHAPA PRIMARY KEY (ID_TP_MEMBRO_CHAPA)
);

CREATE TABLE eleitoral.TB_TP_PARTIC_CHAPA (
    ID_TP_PARTIC_CHAPA INTEGER NOT NULL,
    DS_TP_PARTIC_CHAPA VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_TP_PARTIC_CHAPA PRIMARY KEY (ID_TP_PARTIC_CHAPA)
);

CREATE TABLE eleitoral.TB_TIPO_PROCESSO (
    ID_TIPO_PROCESSO INTEGER NOT NULL,
    DS_TIPO_PROCESSO VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_TIPO_PROCESSO PRIMARY KEY (ID_TIPO_PROCESSO)
);

CREATE TABLE eleitoral.TB_TIPO_DENUNCIA (
    ID_TIPO_DENUNCIA INTEGER NOT NULL,
    DS_TIPO_DENUNCIA VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_TIPO_DENUNCIA PRIMARY KEY (ID_TIPO_DENUNCIA)
);

-- Tabela de Status de Julgamento Final
CREATE TABLE eleitoral.TB_STATUS_CHAPA_JULGAMENTO_FINAL (
    ID INTEGER NOT NULL,
    DS_STATUS VARCHAR(100) NOT NULL,
    CONSTRAINT PK_TB_STATUS_CHAPA_JULGAMENTO_FINAL PRIMARY KEY (ID)
);

-- Tabela de Atividades Secundárias do Calendário
CREATE TABLE eleitoral.TB_ATIV_SECUNDARIA_CALENDARIO (
    ID_ATIV_SECUNDARIA INTEGER NOT NULL,
    DS_ATIV_SECUNDARIA VARCHAR(200) NOT NULL,
    CONSTRAINT PK_TB_ATIV_SECUNDARIA_CALENDARIO PRIMARY KEY (ID_ATIV_SECUNDARIA)
);

-- Tabela de Usuários
CREATE TABLE eleitoral.TB_USUARIO (
    id INTEGER NOT NULL,
    nome VARCHAR(250) NOT NULL,
    email VARCHAR(200) NOT NULL,
    CONSTRAINT PK_TB_USUARIO PRIMARY KEY (id)
);

-- Tabela de Tipos de Corpo de Email
CREATE TABLE eleitoral.TB_TP_CORPO_EMAIL (
    id_tp_corpo_email INTEGER NOT NULL,
    ds_corpo_email VARCHAR(500) NOT NULL,
    CONSTRAINT PK_TB_TP_CORPO_EMAIL PRIMARY KEY (id_tp_corpo_email)
);
```

### 6.3 Tabelas do Schema Public
```sql
-- =============================================
-- SCHEMA PUBLIC - TABELAS COMPARTILHADAS
-- =============================================

-- Tabela de Pessoas
CREATE TABLE public.tb_pessoa (
    id INTEGER NOT NULL,
    email VARCHAR NOT NULL,
    CONSTRAINT PK_tb_pessoa PRIMARY KEY (id)
);

-- Tabela de Profissionais
CREATE TABLE public.tb_profissional (
    id INTEGER NOT NULL,
    nome VARCHAR(250) NOT NULL,
    nome_social VARCHAR,
    registro_nacional VARCHAR,
    data_nascimento TIMESTAMP,
    cpf VARCHAR(11) NOT NULL,
    pessoa_id INTEGER NOT NULL,
    identidade VARCHAR,
    identidade_data_expedicao TIMESTAMP,
    rne VARCHAR,
    rne_data_validade TIMESTAMP,
    sexo VARCHAR(1),
    naturalidade VARCHAR,
    uf_naturalidade VARCHAR,
    nome_pai VARCHAR,
    nome_mae VARCHAR,
    observacao VARCHAR,
    tipo_sanguineo VARCHAR(2),
    CONSTRAINT PK_tb_profissional PRIMARY KEY (id)
);

-- Tabela de Filiais (CAU/UF)
CREATE TABLE public.tb_filial (
    id INTEGER NOT NULL,
    prefixo VARCHAR NOT NULL,
    descricao VARCHAR NOT NULL,
    CONSTRAINT PK_tb_filial PRIMARY KEY (id)
);
```

### 6.4 Sequences
```sql
-- =============================================
-- SEQUENCES
-- =============================================

CREATE SEQUENCE eleitoral.TB_ELEICAO_ID_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE eleitoral.TB_CALENDARIO_ID_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE eleitoral.tb_chapa_eleicao_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE eleitoral.tb_membro_chapa_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE eleitoral.tb_denuncia_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.tb_pessoa_id_seq START WITH 1 INCREMENT BY 1;
```

### 6.5 Chaves Estrangeiras Principais
```sql
-- =============================================
-- FOREIGN KEYS
-- =============================================

-- Relacionamentos do Schema Eleitoral
ALTER TABLE eleitoral.TB_ELEICAO 
ADD CONSTRAINT FK_ELEICAO_CALENDARIO 
FOREIGN KEY (ID_CALENDARIO) REFERENCES eleitoral.TB_CALENDARIO(ID_CALENDARIO);

ALTER TABLE eleitoral.TB_ELEICAO 
ADD CONSTRAINT FK_ELEICAO_TIPO_PROCESSO 
FOREIGN KEY (ID_TIPO_PROCESSO) REFERENCES eleitoral.TB_TIPO_PROCESSO(ID_TIPO_PROCESSO);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_CAU_UF 
FOREIGN KEY (ID_CAU_UF) REFERENCES public.tb_filial(id);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_ATIV_SECUNDARIA 
FOREIGN KEY (ID_ATIV_SECUNDARIA) REFERENCES eleitoral.TB_ATIV_SECUNDARIA_CALENDARIO(ID_ATIV_SECUNDARIA);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_TP_CANDIDATURA 
FOREIGN KEY (ID_TP_CANDIDATURA) REFERENCES eleitoral.TB_TP_CANDIDATURA(ID_TP_CANDIDATURA);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_STATUS_JULGAMENTO 
FOREIGN KEY (ID_STATUS_CHAPA_JULGAMENTO_FINAL) REFERENCES eleitoral.TB_STATUS_CHAPA_JULGAMENTO_FINAL(ID);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_PROF_INCLUSAO_PLATAFORMA 
FOREIGN KEY (ID_PROFISSIONAL_INCLUSAO_PLATAFORMA) REFERENCES public.tb_profissional(id);

ALTER TABLE eleitoral.TB_CHAPA_ELEICAO 
ADD CONSTRAINT FK_CHAPA_USUARIO_INCLUSAO_PLATAFORMA 
FOREIGN KEY (ID_USUARIO_INCLUSAO_PLATAFORMA) REFERENCES eleitoral.TB_USUARIO(id);

ALTER TABLE eleitoral.TB_MEMBRO_CHAPA 
ADD CONSTRAINT FK_MEMBRO_CHAPA_ELEICAO 
FOREIGN KEY (ID_CHAPA_ELEICAO) REFERENCES eleitoral.TB_CHAPA_ELEICAO(ID_CHAPA_ELEICAO);

ALTER TABLE eleitoral.TB_MEMBRO_CHAPA 
ADD CONSTRAINT FK_MEMBRO_TP_PARTIC 
FOREIGN KEY (ID_TP_PARTIC_CHAPA) REFERENCES eleitoral.TB_TP_PARTIC_CHAPA(ID_TP_PARTIC_CHAPA);

ALTER TABLE eleitoral.TB_MEMBRO_CHAPA 
ADD CONSTRAINT FK_MEMBRO_TP_MEMBRO 
FOREIGN KEY (ID_TP_MEMBRO_CHAPA) REFERENCES eleitoral.TB_TP_MEMBRO_CHAPA(ID_TP_MEMBRO_CHAPA);

ALTER TABLE eleitoral.TB_MEMBRO_CHAPA 
ADD CONSTRAINT FK_MEMBRO_SUPLENTE 
FOREIGN KEY (ID_SUPLENTE) REFERENCES eleitoral.TB_MEMBRO_CHAPA(ID_MEMBRO_CHAPA);

ALTER TABLE eleitoral.TB_MEMBRO_CHAPA 
ADD CONSTRAINT FK_MEMBRO_PROFISSIONAL 
FOREIGN KEY (ID_PROFISSIONAL) REFERENCES public.tb_profissional(id);

ALTER TABLE eleitoral.TB_DENUNCIA 
ADD CONSTRAINT FK_DENUNCIA_PESSOA 
FOREIGN KEY (ID_PESSOA) REFERENCES public.tb_pessoa(id);

ALTER TABLE eleitoral.TB_DENUNCIA 
ADD CONSTRAINT FK_DENUNCIA_TIPO 
FOREIGN KEY (ID_TIPO_DENUNCIA) REFERENCES eleitoral.TB_TIPO_DENUNCIA(ID_TIPO_DENUNCIA);

ALTER TABLE eleitoral.TB_DENUNCIA 
ADD CONSTRAINT FK_DENUNCIA_ATIV_SECUNDARIA 
FOREIGN KEY (ID_ATIV_SECUNDARIA) REFERENCES eleitoral.TB_ATIV_SECUNDARIA_CALENDARIO(ID_ATIV_SECUNDARIA);

ALTER TABLE eleitoral.TB_DENUNCIA 
ADD CONSTRAINT FK_DENUNCIA_CAU_UF 
FOREIGN KEY (id_cau_uf) REFERENCES public.tb_filial(id);

-- Relacionamentos do Schema Public
ALTER TABLE public.tb_profissional 
ADD CONSTRAINT FK_PROFISSIONAL_PESSOA 
FOREIGN KEY (pessoa_id) REFERENCES public.tb_pessoa(id);
```

### 6.6 Índices Importantes
```sql
-- =============================================
-- INDEXES
-- =============================================

-- Índices para performance em consultas frequentes
CREATE INDEX IDX_CHAPA_CAU_UF ON eleitoral.TB_CHAPA_ELEICAO(ID_CAU_UF);
CREATE INDEX IDX_CHAPA_ANO ON eleitoral.TB_CHAPA_ELEICAO(ID_ETAPA);
CREATE INDEX IDX_MEMBRO_CHAPA ON eleitoral.TB_MEMBRO_CHAPA(ID_CHAPA_ELEICAO);
CREATE INDEX IDX_MEMBRO_PROFISSIONAL ON eleitoral.TB_MEMBRO_CHAPA(ID_PROFISSIONAL);
CREATE INDEX IDX_DENUNCIA_UF ON eleitoral.TB_DENUNCIA(id_cau_uf);
CREATE INDEX IDX_PROFISSIONAL_CPF ON public.tb_profissional(cpf);
CREATE INDEX IDX_PESSOA_EMAIL ON public.tb_pessoa(email);
```

### 6.7 Dados Iniciais Obrigatórios
```sql
-- =============================================
-- DADOS INICIAIS OBRIGATÓRIOS
-- =============================================

-- Tipos de Corpo de Email (baseado nos scripts HST132 e HST133)
INSERT INTO eleitoral.TB_TP_CORPO_EMAIL (id_tp_corpo_email, ds_corpo_email) VALUES 
(122, 'Envia e-mail para o usuário que cadastrou a denúncia'),
(123, 'Envia e-mail para o assessor CEN'),
(124, 'Envia e-mail aos coordenadores da CEN'),
(125, 'Envia e-mail para o coordenador CE atual da denúncia, informando sobre o não cadastramento de defesa e consequente arquivamento da solicitação'),
(126, 'Envia e-mail para o assessor CE da respectiva UF do denunciado ou da chapa. Envia e-mail para o assessor CEN de qualquer tipo ou UF de denúncia, informando sobre o não cadastramento de defesa e consequente arquivamento da solicitação'),
(127, 'Envia e-mail para o denunciante, informando sobre o não cadastramento de defesa e consequente arquivamento da solicitação'),
(128, 'Envia e-mail para o coordenador CE ou CEN, informando que ele possui uma denúncia julgada provida pelo assessor CE e que ele precisa selecionar um relator para a denúncia'),
(129, 'Envia e-mail para o assessor CEN informando que ele julgou a denúncia'),
(130, 'Envia e-mail para o assessor CE ou CEN a cada 24h caso a denúncia provida ainda não possua um relator'),
(131, 'Envia e-mail para o denunciante informando que a denúncia foi admitida'),
(132, 'Envia e-mail para o denunciado informando que a denúncia foi admitida'),
(133, 'Envia e-mail para o coordenador CEN, informando que a denúncia foi julgada improvida'),
(134, 'Envia e-mail para o assessor CEN, informando que ele julgou a denúncia improvida'),
(135, 'Envia e-mail para quem cadastrou a denúncia com o improvimento da denúncia');
```

---

## 7. CONSIDERAÇÕES ARQUITETURAIS

### 7.1 Padrões Identificados
1. **Naming Convention**: Tabelas do schema eleitoral usam TB_ prefix, schema public usa tb_ prefix
2. **Primary Keys**: Sempre INTEGER com sequences
3. **Soft Delete**: Muitas tabelas possuem ST_EXCLUIDO para exclusão lógica
4. **Auditoria**: Presença de campos de histórico e situação
5. **Multilocalização**: Separação por CAU/UF (filiais)

### 7.2 Complexidade do Domínio
- **Alta Complexidade**: Sistema com workflows complexos de processos eleitorais
- **Múltiplas Instâncias**: Julgamentos de primeira e segunda instância
- **Gestão de Estados**: Controle rigoroso de status e situações
- **Rastreabilidade**: Histórico completo de alterações

### 7.3 Pontos de Atenção
1. **Performance**: 177 entidades requerem otimização de consultas
2. **Manutenibilidade**: Alto acoplamento entre entidades
3. **Migração**: Ausência de migrations formais pode dificultar versionamento
4. **Validação**: Dependência forte de validações em nível de aplicação

---

## 8. CONCLUSÃO

O schema do sistema eleitoral CAU PHP é altamente complexo e abrangente, cobrindo todos os aspectos de um processo eleitoral institucional:

### 8.1 Pontos Fortes
- **Completude Funcional**: Cobre todo o ciclo eleitoral
- **Flexibilidade**: Suporte a múltiplos tipos de processos e candidaturas
- **Rastreabilidade**: Histórico completo de alterações
- **Segregação**: Separação clara entre dados eleitorais e dados gerais

### 8.2 Desafios para Migração
- **Volume de Entidades**: 177 entidades requerem migração cuidadosa
- **Relacionamentos Complexos**: Múltiplos níveis de dependência
- **Dados Críticos**: Informações sensíveis de processos eleitorais
- **Integridade Referencial**: Manutenção de consistência entre schemas

### 8.3 Recomendações
1. **Migração Incremental**: Migrar por domínios funcionais
2. **Validação Extensiva**: Testes rigorosos de integridade
3. **Backup Completo**: Estratégia robusta de backup/recovery
4. **Documentação**: Manter documentação atualizada do mapeamento

---

**Data da Análise**: 25/08/2025  
**Versão do Sistema**: PHP Legacy  
**Total de Entidades Analisadas**: 177  
**Schemas Identificados**: 2 (eleitoral, public)