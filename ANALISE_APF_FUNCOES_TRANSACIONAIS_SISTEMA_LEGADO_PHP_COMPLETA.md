
# ANÁLISE DETALHADA DAS FUNÇÕES TRANSACIONAIS - SISTEMA PHP LEGACY

Data da Análise: 25/08/2025

## RESUMO EXECUTIVO

### Contagem de Funções Transacionais:
- **Entradas Externas (EE)**: 39 (135 PF)
- **Saídas Externas (SE)**: 75 (352 PF)
- **Consultas Externas (CE)**: 222 (771 PF)

### **TOTAL FUNÇÕES TRANSACIONAIS: 1258 PF**

---

## 1. ENTRADAS EXTERNAS (EE)

### Detalhamento por Complexidade:


**Baixa Complexidade**: 29 funções (87 PF)
**Média Complexidade**: 6 funções (24 PF)  
**Alta Complexidade**: 4 funções (24 PF)

### Top 10 Entradas Externas:
1. **ChapaEleicaoController.getChapaEleicaoJulgamentoFinalPorResponsavelChapa** - ALTA (6 PF)
   - Salva dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 0

2. **JulgamentoFinalController.getPorChapaEleicaoResponsavelChapa** - ALTA (6 PF)
   - Salva dados - JulgamentoFinal
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 1

3. **JulgamentoRecursoImpugnacaoController.getPorPedidoImpugnacaoResponsavel** - ALTA (6 PF)
   - Salva dados - JulgamentoRecursoImpugnacao
   - ALIs: Impugnacao, Julgamento, Recurso
   - Elementos: 1

4. **RecursoImpugnacaoResultadoController.downloadDocumento** - ALTA (6 PF)
   - Entrada de dados - RecursoImpugnacaoResultado
   - ALIs: Impugnacao, Julgamento, Recurso, Documento
   - Elementos: 1

5. **AlegacaoImpugnacaoResultadoController.downloadDocumento** - MEDIA (4 PF)
   - Entrada de dados - AlegacaoImpugnacaoResultado
   - ALIs: Impugnacao, Documento
   - Elementos: 1

6. **ChapaEleicaoController.alterarStatus** - MEDIA (4 PF)
   - Entrada de dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao
   - Elementos: 1

7. **ChapaEleicaoController.alterarPlataforma** - MEDIA (4 PF)
   - Entrada de dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao
   - Elementos: 0

8. **ChapaEleicaoController.excluirComJustificativa** - MEDIA (4 PF)
   - Entrada de dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao
   - Elementos: 1

9. **DenunciaController.enviarEmailResponsaveis** - MEDIA (4 PF)
   - Salva dados - Denuncia
   - ALIs: Denuncia, Email
   - Elementos: 1

10. **JulgamentoRecursoSubstituicaoController.getPorPedidoSubstituicaoResponsavelChapa** - MEDIA (4 PF)
   - Salva dados - JulgamentoRecursoSubstituicao
   - ALIs: Julgamento, Recurso
   - Elementos: 1

---

## 2. SAÍDAS EXTERNAS (SE)

### Detalhamento por Complexidade:


**Baixa Complexidade**: 41 funções (164 PF)
**Média Complexidade**: 25 funções (125 PF)  
**Alta Complexidade**: 9 funções (63 PF)

### Top 10 Saídas Externas:
1. **ChapaEleicaoController.gerarDocumentoPDFExtratoQuantidadeChapa** - ALTA (7 PF)
   - Gera PDF - ChapaEleicao
   - ALIs: Eleicao, Calendario, Documento
   - Elementos: 5

2. **ChapaEleicaoController.gerarXMLChapas** - ALTA (7 PF)
   - Saída de dados - ChapaEleicao
   - ALIs: Eleicao, Julgamento, Calendario
   - Elementos: 5

3. **ChapaEleicaoController.gerarCSVChapas** - ALTA (7 PF)
   - Saída de dados - ChapaEleicao
   - ALIs: Eleicao, Julgamento, Calendario
   - Elementos: 5

4. **ChapaEleicaoController.gerarDocumentoPDFExtratoChapa** - ALTA (7 PF)
   - Gera PDF - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao, Calendario, Documento
   - Elementos: 6

5. **DocumentoEleicaoController.getDocumentosPorEleicao** - ALTA (7 PF)
   - Saída de dados - DocumentoEleicao
   - ALIs: Eleicao, Calendario, Documento
   - Elementos: 5

6. **JulgamentoImpugnacaoController.getDocumentoPDFJulgamentoImpugnacao** - ALTA (7 PF)
   - Gera PDF - JulgamentoImpugnacao
   - ALIs: Impugnacao, Julgamento, Documento
   - Elementos: 5

7. **JulgamentoRecursoDenunciaController.download** - ALTA (7 PF)
   - Faz download - JulgamentoRecursoDenuncia
   - ALIs: Denuncia, Julgamento, Recurso
   - Elementos: 5

8. **JulgamentoRecursoImpugnacaoController.download** - ALTA (7 PF)
   - Faz download - JulgamentoRecursoImpugnacao
   - ALIs: Impugnacao, Julgamento, Recurso
   - Elementos: 5

9. **RecursoImpugnacaoResultadoController.downloadDocumento** - ALTA (7 PF)
   - Faz download - RecursoImpugnacaoResultado
   - ALIs: Impugnacao, Julgamento, Recurso, Documento
   - Elementos: 5

10. **AlegacaoImpugnacaoResultadoController.downloadDocumento** - MEDIA (5 PF)
   - Faz download - AlegacaoImpugnacaoResultado
   - ALIs: Impugnacao, Documento
   - Elementos: 5

---

## 3. CONSULTAS EXTERNAS (CE)

### Detalhamento por Complexidade:


**Baixa Complexidade**: 157 funções (471 PF)
**Média Complexidade**: 45 funções (180 PF)  
**Alta Complexidade**: 20 funções (120 PF)

### Top 10 Consultas Externas:
1. **ChapaEleicaoController.getDadosParaExtratoChapa** - ALTA (6 PF)
   - Consulta dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao, Calendario
   - Elementos: 5

2. **ChapaEleicaoController.getChapasEleicaoJulgamentoFinalPorCalendarioCauUf** - ALTA (6 PF)
   - Consulta dados - ChapaEleicao
   - ALIs: Eleicao, Julgamento, Calendario
   - Elementos: 5

3. **ChapaEleicaoController.getChapasEleicaoJulgamentoFinalPorMembroComissao** - ALTA (6 PF)
   - Consulta dados - ChapaEleicao
   - ALIs: Eleicao, Julgamento, MembroComissao
   - Elementos: 5

4. **ChapaEleicaoController.getChapaEleicaoJulgamentoFinalPorResponsavelChapa** - ALTA (6 PF)
   - Consulta dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

5. **ChapaEleicaoController.getChapaEleicaoJulgamentoFinalPorIdChapa** - ALTA (6 PF)
   - Consulta dados - ChapaEleicao
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

6. **DenunciaController.getCondicaoDenuncia** - ALTA (6 PF)
   - Consulta dados - Denuncia
   - ALIs: Denuncia, Julgamento, Recurso
   - Elementos: 5

7. **JulgamentoFinalController.getPorChapaEleicao** - ALTA (6 PF)
   - Consulta dados - JulgamentoFinal
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

8. **JulgamentoFinalController.getPorChapaEleicaoMembroComissao** - ALTA (6 PF)
   - Consulta dados - JulgamentoFinal
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

9. **JulgamentoFinalController.getPorChapaEleicaoResponsavelChapa** - ALTA (6 PF)
   - Consulta dados - JulgamentoFinal
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

10. **JulgamentoFinalController.getMembrosChapaParaJulgamentoFinal** - ALTA (6 PF)
   - Consulta dados - JulgamentoFinal
   - ALIs: Eleicao, ChapaEleicao, Julgamento
   - Elementos: 5

---

## 4. ANÁLISE POR MÓDULOS FUNCIONAIS

### Gestão de Chapas
- **EE**: 20 | **SE**: 12 | **CE**: 44
- **Total PF**: 289

### Sistema de Impugnações
- **EE**: 9 | **SE**: 12 | **CE**: 40
- **Total PF**: 236

### Sistema de Julgamentos
- **EE**: 4 | **SE**: 15 | **CE**: 26
- **Total PF**: 194

### Sistema de Denúncias
- **EE**: 3 | **SE**: 11 | **CE**: 37
- **Total PF**: 191

### Gestão de Calendário Eleitoral
- **EE**: 2 | **SE**: 5 | **CE**: 30
- **Total PF**: 117

### Gestão de Membros
- **EE**: 1 | **SE**: 2 | **CE**: 21
- **Total PF**: 77

### Outros
- **EE**: 0 | **SE**: 7 | **CE**: 9
- **Total PF**: 56

### Gestão de Conselheiros
- **EE**: 0 | **SE**: 5 | **CE**: 3
- **Total PF**: 34

### Gestão de Documentos
- **EE**: 0 | **SE**: 5 | **CE**: 0
- **Total PF**: 24

### Sistema de Notificações
- **EE**: 0 | **SE**: 0 | **CE**: 8
- **Total PF**: 24

### Sistema de Recursos
- **EE**: 0 | **SE**: 1 | **CE**: 2
- **Total PF**: 10

### Gestão de Profissionais
- **EE**: 0 | **SE**: 0 | **CE**: 2
- **Total PF**: 6

---

## 5. CASOS DE USO IDENTIFICADOS

### HST001 - Cadastrar Conselheiro Eleito
**Módulo**: Gestão de Conselheiros
**Funções Relacionadas**: 0



### HST021 - Manter Chapa
**Módulo**: Gestão de Chapas
**Funções Relacionadas**: 20
- ChapaEleicaoController.alterarStatus (4 PF)
- ChapaEleicaoController.alterarPlataforma (4 PF)
- ChapaEleicaoController.confirmarChapa (3 PF)
... e mais 17 funções

### HST051 - Cadastrar Denúncia
**Módulo**: Sistema de Denúncias
**Funções Relacionadas**: 0



### HST032 - Cadastrar Pedido Impugnação
**Módulo**: Sistema de Impugnações
**Funções Relacionadas**: 0




---

## 6. RECOMENDAÇÕES PARA MIGRAÇÃO

### Priorização por Complexidade:
1. **Funções de BAIXA complexidade**: Migração direta e automatizada
2. **Funções de MÉDIA complexidade**: Revisão e otimização durante migração
3. **Funções de ALTA complexidade**: Re-engenharia e refatoração completa

### Módulos Críticos Identificados:

Com base na análise, os módulos mais críticos são:
1. **Sistema de Julgamentos** - Maior complexidade e número de funções
2. **Gestão de Chapas** - Alto volume de transações
3. **Sistema de Denúncias** - Processamento crítico
4. **Sistema de Recursos** - Lógica complexa de negócio
        

### Estimativa de Esforço:
- **Entradas Externas**: 20 dias
- **Saídas Externas**: 60 dias  
- **Consultas Externas**: 67 dias

**TOTAL ESTIMADO**: 147 dias de desenvolvimento

---
*Análise gerada automaticamente em 25/08/2025 às 16:40:48*
        