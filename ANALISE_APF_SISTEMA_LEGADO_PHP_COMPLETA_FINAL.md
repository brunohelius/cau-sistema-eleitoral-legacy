
# ANÁLISE COMPLETA APF - SISTEMA ELEITORAL CAU LEGACY PHP

**Data da Análise:** 25/08/2025
**Sistema Analisado:** CAU Sistema Eleitoral Legacy (PHP/Lumen)

---

## 📊 RESUMO EXECUTIVO

### Contagem de Funções Transacionais:
- **Entradas Externas (EE)**: 5 funções (17 PF)
- **Saídas Externas (SE)**: 7 funções (38 PF)  
- **Consultas Externas (CE)**: 4 funções (15 PF)

### **🎯 TOTAL PONTOS DE FUNÇÃO TRANSACIONAIS: 70 PF**

---

## 📈 ANÁLISE POR COMPLEXIDADE

### Entradas Externas (EE):
- **Baixa**: 3 funções (9 PF)
- **Média**: 2 funções (8 PF)
- **Alta**: 0 funções (0 PF)

### Saídas Externas (SE):
- **Baixa**: 3 funções (12 PF)
- **Média**: 1 funções (5 PF)
- **Alta**: 3 funções (21 PF)

### Consultas Externas (CE):
- **Baixa**: 3 funções (9 PF)
- **Média**: 0 funções (0 PF)
- **Alta**: 1 funções (6 PF)

---

## 🏗️ ANÁLISE POR MÓDULOS FUNCIONAIS


### Sistema de Denúncias
- **Funções**: EE: 1 | SE: 2 | CE: 0 | **Total**: 3
- **Pontos de Função**: 15 PF
- **Percentual do Total**: 21.4%

### Sistema de Julgamentos
- **Funções**: EE: 4 | SE: 0 | CE: 0 | **Total**: 4
- **Pontos de Função**: 13 PF
- **Percentual do Total**: 18.6%

### Gestão de Calendário Eleitoral
- **Funções**: EE: 0 | SE: 1 | CE: 1 | **Total**: 2
- **Pontos de Função**: 10 PF
- **Percentual do Total**: 14.3%

### Gestão de Membros
- **Funções**: EE: 0 | SE: 1 | CE: 1 | **Total**: 2
- **Pontos de Função**: 10 PF
- **Percentual do Total**: 14.3%

### Gestão de Conselheiros
- **Funções**: EE: 0 | SE: 2 | CE: 0 | **Total**: 2
- **Pontos de Função**: 9 PF
- **Percentual do Total**: 12.9%

### Gestão de Profissionais
- **Funções**: EE: 0 | SE: 0 | CE: 1 | **Total**: 1
- **Pontos de Função**: 6 PF
- **Percentual do Total**: 8.6%

### Gestão de Chapas e Candidaturas
- **Funções**: EE: 0 | SE: 1 | CE: 0 | **Total**: 1
- **Pontos de Função**: 4 PF
- **Percentual do Total**: 5.7%

### Sistema de Impugnações
- **Funções**: EE: 0 | SE: 0 | CE: 1 | **Total**: 1
- **Pontos de Função**: 3 PF
- **Percentual do Total**: 4.3%


---

## 🔍 TOP 20 FUNÇÕES MAIS COMPLEXAS

### Entradas Externas (EE):
1. **Denuncia.enviarEmailResponsaveis** - Média (4 PF)
2. **RecursoJulgamentoAdmissibilidade.salvar** - Média (4 PF)
3. **JulgamentoAdmissibilidade.salvar** - Baixa (3 PF)
4. **JulgamentoAlegacaoImpugResultado.downloadDocumento** - Baixa (3 PF)
5. **JulgamentoRecursoAdmissibilidade.salvar** - Baixa (3 PF)

### Saídas Externas (SE):  
1. **Calendario.gerarDocumento** - Alta (7 PF)
2. **Denuncia.emailSend** - Alta (7 PF)
3. **MembroComissao.getPorFiltro** - Alta (7 PF)
4. **ParametroConselheiro.gerarDocumentoPDFListaConselheiros** - Média (5 PF)
5. **ChapaEleicao.gerarCSVChapasTrePorUf** - Baixa (4 PF)
6. **DenunciaAdmitida.inserirRelator** - Baixa (4 PF)
7. **ParametroConselheiro.gerarDocumentoXSLListaConselheiros** - Baixa (4 PF)

### Consultas Externas (CE):
1. **Profissional.getProfissionaisPorFiltro** - Alta (6 PF)
2. **AtividadePrincipalCalendario.getAtividadePrincipal** - Baixa (3 PF)
3. **DefesaImpugnacao.getDefesaImpugnacaoValidacaoAcessoProfissional** - Baixa (3 PF)
4. **MembroComissao.getListaMembrosPorMembroCauUf** - Baixa (3 PF)

---

## 📋 DETALHAMENTO COMPLETO DAS FUNÇÕES

### ENTRADAS EXTERNAS (5 funções):


1. **Denuncia.enviarEmailResponsaveis** - Média (4 PF)
   - **Descrição**: Salva dados - Denuncia
   - **ALRs**: 3 (Denuncia, DenunciaAdmitida, RecursoDenuncia)
   - **DER Entrada**: 1
   - **Rota**: GET teste/email/{idDenuncia}

2. **RecursoJulgamentoAdmissibilidade.salvar** - Média (4 PF)
   - **Descrição**: Processamento de dados - Recurso Julgamento Admissibilidade
   - **ALRs**: 3 (Denuncia, JulgamentoAdmissibilidade, Profissional)
   - **DER Entrada**: 1
   - **Rota**: POST denuncia/recurso-julgamento-admissibilidade

3. **JulgamentoAdmissibilidade.salvar** - Baixa (3 PF)
   - **Descrição**: Processamento de dados - Julgamento Admissibilidade
   - **ALRs**: 1 (Denuncia)
   - **DER Entrada**: 2
   - **Rota**: POST denuncia/{idDenuncia}/julgar_admissibilidade

4. **JulgamentoAlegacaoImpugResultado.downloadDocumento** - Baixa (3 PF)
   - **Descrição**: Processamento de dados - Julgamento Alegacao Impug Resultado
   - **ALRs**: 0 (N/A)
   - **DER Entrada**: 1
   - **Rota**: GET documento/{idJulgamento}/download

5. **JulgamentoRecursoAdmissibilidade.salvar** - Baixa (3 PF)
   - **Descrição**: Processamento de dados - Julgamento Recurso Admissibilidade
   - **ALRs**: 1 (Denuncia)
   - **DER Entrada**: 1
   - **Rota**: POST denuncia/julgamento-recurso-admissibilidade


### SAÍDAS EXTERNAS (7 funções):


1. **Calendario.gerarDocumento** - Alta (7 PF)
   - **Descrição**: Gera documento - Calendario
   - **ALRs**: 2 (Calendario, JustificativaAlteracaoCalendario)
   - **DER Saída**: 45
   - **Rota**: N/A

2. **Denuncia.emailSend** - Alta (7 PF)
   - **Descrição**: Saída de dados - Denuncia
   - **ALRs**: 8 (Denuncia, DenunciaDefesa, DenunciaInadmitida, MembroComissao, Pessoa, Profissional, Uf, Usuario)
   - **DER Saída**: 74
   - **Rota**: GET email/admitir/{idDenuncia}/tipoDenuncia/{idTipoDenuncia}

3. **MembroComissao.getPorFiltro** - Alta (7 PF)
   - **Descrição**: Saída de dados - Membro Comissao
   - **ALRs**: 9 (Calendario, Conselheiro, Declaracao, Denuncia, InformacaoComissaoMembro, MembroComissao, Pessoa, Uf, Usuario)
   - **DER Saída**: 77
   - **Rota**: POST membroComissao/filtro

4. **ParametroConselheiro.gerarDocumentoPDFListaConselheiros** - Média (5 PF)
   - **Descrição**: Gera PDF - Parametro Conselheiro
   - **ALRs**: 1 (ParametroConselheiro)
   - **DER Saída**: 21
   - **Rota**: GET conselheiros/atividadeSecundaria/{id}/gerarPDF

5. **ChapaEleicao.gerarCSVChapasTrePorUf** - Baixa (4 PF)
   - **Descrição**: Saída de dados - Chapa Eleicao
   - **ALRs**: 0 (N/A)
   - **DER Saída**: 3
   - **Rota**: GET chapas/{idCalendario}/gerarCSVChapasTrePorUf/{idCauUf}

6. **DenunciaAdmitida.inserirRelator** - Baixa (4 PF)
   - **Descrição**: Saída de dados - Denuncia Admitida
   - **ALRs**: 2 (Denuncia, Profissional)
   - **DER Saída**: 13
   - **Rota**: POST denuncia/{idDenuncia}/relator

7. **ParametroConselheiro.gerarDocumentoXSLListaConselheiros** - Baixa (4 PF)
   - **Descrição**: Gera documento - Parametro Conselheiro
   - **ALRs**: 0 (N/A)
   - **DER Saída**: 3
   - **Rota**: GET conselheiros/atividadeSecundaria/{id}/gerarXLS


### CONSULTAS EXTERNAS (4 funções):


1. **Profissional.getProfissionaisPorFiltro** - Alta (6 PF)
   - **Descrição**: Obtém dados - Profissional
   - **ALRs**: 0 (N/A)
   - **DER Saída**: 27
   - **Rota**: POST profissionais/filtro

2. **AtividadePrincipalCalendario.getAtividadePrincipal** - Baixa (3 PF)
   - **Descrição**: Obtém dados - Atividade Principal Calendario
   - **ALRs**: 0 (N/A)
   - **DER Saída**: 15
   - **Rota**: GET atividadesPrincipais

3. **DefesaImpugnacao.getDefesaImpugnacaoValidacaoAcessoProfissional** - Baixa (3 PF)
   - **Descrição**: Obtém dados - Defesa Impugnacao
   - **ALRs**: 0 (N/A)
   - **DER Saída**: 9
   - **Rota**: GET defesaImpugnacao/pedidosImpugnacao/{idPedidoImpugnacao}/validarProfissional

4. **MembroComissao.getListaMembrosPorMembroCauUf** - Baixa (3 PF)
   - **Descrição**: Obtém dados - Membro Comissao
   - **ALRs**: 1 (MembroComissao)
   - **DER Saída**: 15
   - **Rota**: GET membroComissao/{id}/cauUf/{idCauUf}/lista




---

## 📊 ESTATÍSTICAS DETALHADAS

### Distribuição por Complexidade:
- **Baixa**: 9 funções (30 PF)
- **Média**: 3 funções (13 PF)  
- **Alta**: 4 funções (27 PF)

### Métricas de Qualidade:
- **Complexidade Média**: 4.38 PF por função
- **Módulo Mais Complexo**: Sistema de Denúncias
- **Taxa de Funções Complexas**: 25.0%

---

## 🎯 RECOMENDAÇÕES PARA MIGRAÇÃO

### Priorização por Complexidade:
1. **Funções de BAIXA complexidade (9 funções)**: 
   - Migração direta e automatizada
   - Estimativa: 3 dias

2. **Funções de MÉDIA complexidade (3 funções)**:
   - Revisão e otimização durante migração  
   - Estimativa: 2 dias

3. **Funções de ALTA complexidade (4 funções)**:
   - Re-engenharia e refatoração completa
   - Estimativa: 5 dias

### **ESTIMATIVA TOTAL DE ESFORÇO: 10 dias úteis**

### Módulos Críticos (por ordem de prioridade):
1. **Sistema de Denúncias** (15 PF) - 3 funções
2. **Sistema de Julgamentos** (13 PF) - 4 funções
3. **Gestão de Calendário Eleitoral** (10 PF) - 2 funções
4. **Gestão de Membros** (10 PF) - 2 funções
5. **Gestão de Conselheiros** (9 PF) - 2 funções

---

**📋 Relatório gerado automaticamente em 25/08/2025 às 20:03:49**
**🔍 Metodologia**: Análise de Pontos de Função (APF) baseada no IFPUG**
**📊 Total de 16 funções transacionais analisadas**
        