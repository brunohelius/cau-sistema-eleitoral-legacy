
# 📊 ANÁLISE COMPLETA DE PONTOS DE FUNÇÃO (APF)
## Sistema Eleitoral CAU - Legacy PHP

**Data da Análise:** 25/08/2025  
**Metodologia:** Análise de Pontos de Função (APF) segundo IFPUG  
**Sistema Analisado:** CAU Sistema Eleitoral Legacy (PHP/Lumen)

---

## 🎯 RESUMO EXECUTIVO

### Contagem Total de Funções Transacionais:
- **📥 Entradas Externas (EE)**: 102 funções ➜ **315 PF**
- **📤 Saídas Externas (SE)**: 64 funções ➜ **262 PF**
- **🔍 Consultas Externas (CE)**: 256 funções ➜ **777 PF**

### **🏆 TOTAL GERAL: 1354 PONTOS DE FUNÇÃO TRANSACIONAIS**

---

## 📈 DISTRIBUIÇÃO POR COMPLEXIDADE

### Entradas Externas (EE):
- **Baixa**: 99 funções (297 PF)
- **Média**: 0 funções (0 PF)
- **Alta**: 3 funções (18 PF)

### Saídas Externas (SE):
- **Baixa**: 62 funções (248 PF)
- **Média**: 0 funções (0 PF)
- **Alta**: 2 funções (14 PF)

### Consultas Externas (CE):
- **Baixa**: 253 funções (759 PF)
- **Média**: 0 funções (0 PF)
- **Alta**: 3 funções (18 PF)

---

## 🏗️ ANÁLISE POR MÓDULOS FUNCIONAIS


### 1. Gestão de Chapas e Candidaturas
- **📊 Funções**: EE: 26 | SE: 10 | CE: 46 | **Total**: 82
- **🎯 Pontos de Função**: **256 PF** (18.9% do total)
- **📋 Principais Funções**:
  - ChapaEleicao.validarCauUfProfissionalConvidadoChapa (4 PF - Baixa)
  - ChapaEleicao.gerarDocumentoPDFExtratoQuantidadeChapa (4 PF - Baixa)
  - ChapaEleicao.gerarXMLChapas (4 PF - Baixa)
  - ChapaEleicao.downloadFotoMembro (4 PF - Baixa)
  - ChapaEleicao.gerarCSVChapas (4 PF - Baixa)

### 2. Sistema de Denúncias
- **📊 Funções**: EE: 10 | SE: 10 | CE: 48 | **Total**: 68
- **🎯 Pontos de Função**: **214 PF** (15.8% do total)
- **📋 Principais Funções**:
  - ContrarrazaoRecursoDenuncia.download (4 PF - Baixa)
  - DenunciaAudienciaInstrucao.download (4 PF - Baixa)
  - Denuncia.download (4 PF - Baixa)
  - Denuncia.downloadInadmitida (4 PF - Baixa)
  - Denuncia.gerarDocumento (4 PF - Baixa)

### 3. Sistema de Impugnações
- **📊 Funções**: EE: 20 | SE: 6 | CE: 38 | **Total**: 64
- **🎯 Pontos de Função**: **198 PF** (14.6% do total)
- **📋 Principais Funções**:
  - ContrarrazaoRecursoImpugnacao.download (4 PF - Baixa)
  - ContrarrazaoRecursoImpugnacaoResultado.download (4 PF - Baixa)
  - JulgamentoImpugnacao.download (4 PF - Baixa)
  - JulgamentoImpugnacao.getDocumentoPDFJulgamentoImpugnacao (4 PF - Baixa)
  - JulgamentoRecursoImpugnacao.download (4 PF - Baixa)

### 4. Sistema de Julgamentos
- **📊 Funções**: EE: 18 | SE: 14 | CE: 24 | **Total**: 56
- **🎯 Pontos de Função**: **182 PF** (13.4% do total)
- **📋 Principais Funções**:
  - JulgamentoAdmissibilidade.download (4 PF - Baixa)
  - JulgamentoFinal.download (4 PF - Baixa)
  - JulgamentoRecursoAdmissibilidade.download (4 PF - Baixa)
  - JulgamentoRecursoPedidoSubstituicao.download (4 PF - Baixa)
  - JulgamentoRecursoSubstituicao.download (4 PF - Baixa)

### 5. Gestão de Calendário Eleitoral
- **📊 Funções**: EE: 6 | SE: 4 | CE: 32 | **Total**: 42
- **🎯 Pontos de Função**: **130 PF** (9.6% do total)
- **📋 Principais Funções**:
  - AtividadeSecundariaCalendario.getDeclaracaoPorAtividadeSecundariaTipo (4 PF - Baixa)
  - AtividadeSecundariaCalendario.getCountAtividadesPorDeclaracao (4 PF - Baixa)
  - Calendario.download (4 PF - Baixa)
  - Calendario.gerarDocumento (4 PF - Baixa)
  - AtividadeSecundariaCalendario.getQuantidadeRespostaDeclaracaoPorAtividade (3 PF - Baixa)

### 6. Gestão de Membros de Comissão
- **📊 Funções**: EE: 3 | SE: 2 | CE: 23 | **Total**: 28
- **🎯 Pontos de Função**: **86 PF** (6.4% do total)
- **📋 Principais Funções**:
  - MembroComissao.gerarDocumentoRelacaoMembros (4 PF - Baixa)
  - MembroComissao.getDeclaracaoPorIdProfissional (4 PF - Baixa)
  - MembroComissao.salvar (3 PF - Baixa)
  - MembroComissao.aceitarConvite (3 PF - Baixa)
  - MembroComissao.enviarEmailsConvitesPendentes (3 PF - Baixa)

### 7. Gestão de Conselheiros
- **📊 Funções**: EE: 2 | SE: 5 | CE: 5 | **Total**: 12
- **🎯 Pontos de Função**: **44 PF** (3.2% do total)
- **📋 Principais Funções**:
  - Conselheiro.store (6 PF - Alta)
  - HistoricoExtratoConselheiro.gerarDocumentoListaConselheiros (4 PF - Baixa)
  - HistoricoExtratoConselheiro.gerarDocumentoZIPListaConselheiros (4 PF - Baixa)
  - HistoricoExtratoConselheiro.gerarDocumentoXSLListaConselheiros (4 PF - Baixa)
  - ParametroConselheiro.gerarDocumentoXSLListaConselheiros (4 PF - Baixa)

### 8. Documentos Oficiais
- **📊 Funções**: EE: 4 | SE: 2 | CE: 2 | **Total**: 8
- **🎯 Pontos de Função**: **32 PF** (2.4% do total)
- **📋 Principais Funções**:
  - DiplomaEleitoral.imprimir (7 PF - Alta)
  - TermoDePosse.imprimir (7 PF - Alta)
  - DiplomaEleitoral.store (3 PF - Baixa)
  - DiplomaEleitoral.update (3 PF - Baixa)
  - TermoDePosse.store (3 PF - Baixa)

### 9. Gestão Documental
- **📊 Funções**: EE: 3 | SE: 5 | CE: 1 | **Total**: 9
- **🎯 Pontos de Função**: **32 PF** (2.4% do total)
- **📋 Principais Funções**:
  - DocumentoEleicao.getDocumentosPorEleicao (4 PF - Baixa)
  - DocumentoEleicao.download (4 PF - Baixa)
  - PublicacaoDocumento.gerarPDF (4 PF - Baixa)
  - PublicacaoDocumento.gerarDocumento (4 PF - Baixa)
  - PublicacaoDocumento.downloadPdf (4 PF - Baixa)

### 10. Sistema de Comunicação
- **📊 Funções**: EE: 2 | SE: 0 | CE: 8 | **Total**: 10
- **🎯 Pontos de Função**: **30 PF** (2.2% do total)
- **📋 Principais Funções**:
  - CabecalhoEmail.salvar (3 PF - Baixa)
  - CorpoEmail.salvar (3 PF - Baixa)
  - CabecalhoEmail.getPorId (3 PF - Baixa)
  - CabecalhoEmail.getUfs (3 PF - Baixa)
  - CabecalhoEmail.getCabecalhoEmailPorFiltro (3 PF - Baixa)

### 11. Gerenciamento de Arquivos
- **📊 Funções**: EE: 0 | SE: 3 | CE: 5 | **Total**: 8
- **🎯 Pontos de Função**: **27 PF** (2.0% do total)
- **📋 Principais Funções**:
  - Arquivo.validarResolucaoPDF (4 PF - Baixa)
  - Arquivo.validarArquivoViaDeclaracao (4 PF - Baixa)
  - Arquivo.validarArquivoDeclaracaoChapa (4 PF - Baixa)
  - Arquivo.validarAriquivosCabecalhoEmail (3 PF - Baixa)
  - Arquivo.validarArquivoEleicao (3 PF - Baixa)

### 12. Outros Módulos
- **📊 Funções**: EE: 0 | SE: 0 | CE: 5 | **Total**: 5
- **🎯 Pontos de Função**: **24 PF** (1.8% do total)
- **📋 Principais Funções**:
  - Artisan.verificaMenusPortal (6 PF - Alta)
  - Artisan.verificaPermissoesUsuario (6 PF - Alta)
  - Artisan.recuperaInformacaoTabela (6 PF - Alta)
  - Artisan.chamarComandoSchedule (3 PF - Baixa)
  - Artisan.verificaAgendamentos (3 PF - Baixa)

### 13. Configurações
- **📊 Funções**: EE: 3 | SE: 0 | CE: 2 | **Total**: 5
- **🎯 Pontos de Função**: **21 PF** (1.6% do total)
- **📋 Principais Funções**:
  - TipoFinalizacaoMandato.store (6 PF - Alta)
  - TipoFinalizacaoMandato.update (6 PF - Alta)
  - TipoFinalizacaoMandato.delete (3 PF - Baixa)
  - TipoFinalizacaoMandato.show (3 PF - Baixa)
  - TipoFinalizacaoMandato.index (3 PF - Baixa)

### 14. Gestão de Unidades
- **📊 Funções**: EE: 0 | SE: 0 | CE: 7 | **Total**: 7
- **🎯 Pontos de Função**: **21 PF** (1.6% do total)
- **📋 Principais Funções**:
  - Filial.getFiliaisIES (3 PF - Baixa)
  - Filial.getFiliais (3 PF - Baixa)
  - Filial.getPorId (3 PF - Baixa)
  - Filial.getFiliaisComBandeiras (3 PF - Baixa)
  - Filial.getFilialComBandeira (3 PF - Baixa)

### 15. Alegações Finais
- **📊 Funções**: EE: 1 | SE: 1 | CE: 2 | **Total**: 4
- **🎯 Pontos de Função**: **13 PF** (1.0% do total)
- **📋 Principais Funções**:
  - AlegacaoFinal.download (4 PF - Baixa)
  - AlegacaoFinal.salvar (3 PF - Baixa)
  - AlegacaoFinal.validarArquivo (3 PF - Baixa)
  - AlegacaoFinal.getPorEncaminhamento (3 PF - Baixa)

### 16. Sistema de Recursos
- **📊 Funções**: EE: 1 | SE: 1 | CE: 2 | **Total**: 4
- **🎯 Pontos de Função**: **13 PF** (1.0% do total)
- **📋 Principais Funções**:
  - RecursoSubstituicao.download (4 PF - Baixa)
  - RecursoSubstituicao.salvar (3 PF - Baixa)
  - RecursoSubstituicao.getPorPedidoSubstituicao (3 PF - Baixa)
  - RecursoSubstituicao.getAtividadeSecundariaRecursoPorPedidoSubstituicao (3 PF - Baixa)

### 17. Informações de Comissão
- **📊 Funções**: EE: 2 | SE: 0 | CE: 2 | **Total**: 4
- **🎯 Pontos de Função**: **12 PF** (0.9% do total)
- **📋 Principais Funções**:
  - InformacaoComissaoMembro.salvar (3 PF - Baixa)
  - InformacaoComissaoMembro.concluir (3 PF - Baixa)
  - InformacaoComissaoMembro.getPorCalendario (3 PF - Baixa)
  - InformacaoComissaoMembro.getHistoricoPorInformacaoComissao (3 PF - Baixa)

### 18. Pareceres Finais
- **📊 Funções**: EE: 1 | SE: 1 | CE: 1 | **Total**: 3
- **🎯 Pontos de Função**: **10 PF** (0.7% do total)
- **📋 Principais Funções**:
  - ParecerFinal.download (4 PF - Baixa)
  - ParecerFinal.salvar (3 PF - Baixa)
  - ParecerFinal.getParecerFinalPorEncaminhamento (3 PF - Baixa)

### 19. Gestão de Profissionais
- **📊 Funções**: EE: 0 | SE: 0 | CE: 2 | **Total**: 2
- **🎯 Pontos de Função**: **6 PF** (0.4% do total)
- **📋 Principais Funções**:
  - Profissional.getProfissionaisPorFiltro (3 PF - Baixa)
  - Profissional.getProfissionais (3 PF - Baixa)

### 20. Atividades do Calendário
- **📊 Funções**: EE: 0 | SE: 0 | CE: 1 | **Total**: 1
- **🎯 Pontos de Função**: **3 PF** (0.2% do total)
- **📋 Principais Funções**:
  - EmailAtividadeSecundaria.hasDefinicaoEmail (3 PF - Baixa)


---

## 🔍 TOP 15 FUNÇÕES MAIS COMPLEXAS

### 🥇 Entradas Externas (EE):
1. **Conselheiro.store** - Alta (6 PF)
   📝 Cadastra novo registro - Conselheiro

2. **TipoFinalizacaoMandato.store** - Alta (6 PF)
   📝 Cadastra novo registro - Tipo Finalizacao Mandato

3. **TipoFinalizacaoMandato.update** - Alta (6 PF)
   📝 Atualiza registro - Tipo Finalizacao Mandato

4. **AlegacaoFinal.salvar** - Baixa (3 PF)
   📝 Processamento de entrada - Alegacao Final

5. **AlegacaoImpugnacaoResultado.salvar** - Baixa (3 PF)
   📝 Processamento de entrada - Alegacao Impugnacao Resultado

### 🥈 Saídas Externas (SE):
1. **DiplomaEleitoral.imprimir** - Alta (7 PF)
   📝 Geração de saída - Diploma Eleitoral

2. **TermoDePosse.imprimir** - Alta (7 PF)
   📝 Geração de saída - Termo De Posse

3. **AlegacaoFinal.download** - Baixa (4 PF)
   📝 Faz download - Alegacao Final

4. **Arquivo.validarResolucaoPDF** - Baixa (4 PF)
   📝 Gera PDF - Arquivo

5. **Arquivo.validarArquivoViaDeclaracao** - Baixa (4 PF)
   📝 Geração de saída - Arquivo

### 🥉 Consultas Externas (CE):
1. **Artisan.verificaMenusPortal** - Alta (6 PF)
   📝 Consulta dados - Artisan

2. **Artisan.verificaPermissoesUsuario** - Alta (6 PF)
   📝 Consulta dados - Artisan

3. **Artisan.recuperaInformacaoTabela** - Alta (6 PF)
   📝 Consulta dados - Artisan

4. **AlegacaoFinal.validarArquivo** - Baixa (3 PF)
   📝 Consulta dados - Alegacao Final

5. **AlegacaoFinal.getPorEncaminhamento** - Baixa (3 PF)
   📝 Obtém dados - Alegacao Final

---

## 📋 LISTAGEM COMPLETA DAS FUNÇÕES

### 📥 ENTRADAS EXTERNAS (102 funções)


**1. Conselheiro.store**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Cadastra novo registro - Conselheiro  
- **ALRs Referenciados**: 3 (Email, fails, errors)
- **DER Entrada**: 1

**2. TipoFinalizacaoMandato.store**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Cadastra novo registro - Tipo Finalizacao Mandato  
- **ALRs Referenciados**: 3 (all, fails, errors)
- **DER Entrada**: 1

**3. TipoFinalizacaoMandato.update**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Atualiza registro - Tipo Finalizacao Mandato  
- **ALRs Referenciados**: 3 (all, fails, errors)
- **DER Entrada**: 2

**4. AlegacaoFinal.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Alegacao Final  
- **ALRs Referenciados**: 2 (AlegacaoFinal, getAlegacaoFinalBO)
- **DER Entrada**: 0

**5. AlegacaoImpugnacaoResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Alegacao Impugnacao Resultado  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**6. AlegacaoImpugnacaoResultado.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Alegacao Impugnacao Resultado  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**7. AtividadeSecundariaCalendario.getQuantidadeRespostaDeclaracaoPorAtividade**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Atividade Secundaria Calendario  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**8. CabecalhoEmail.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Cabecalho Email  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**9. Calendario.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Calendario  
- **ALRs Referenciados**: 1 (Calendario)
- **DER Entrada**: 1

**10. Calendario.excluir**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Calendario  
- **ALRs Referenciados**: 1 (Calendario)
- **DER Entrada**: 1

**11. Calendario.inativar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Calendario  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**12. Calendario.concluir**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Calendario  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**13. Calendario.salvarPrazos**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Calendario  
- **ALRs Referenciados**: 1 (Calendario)
- **DER Entrada**: 1

**14. ChapaEleicao.alterarStatus**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**15. ChapaEleicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 1 (ChapaEleicao)
- **DER Entrada**: 0

**16. ChapaEleicao.alterarPlataforma**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 1 (ChapaEleicao)
- **DER Entrada**: 0

**17. ChapaEleicao.salvarMembros**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**18. ChapaEleicao.confirmarChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Confirma operação - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**19. ChapaEleicao.salvarNumeroChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 1 (ChapaEleicao)
- **DER Entrada**: 0

**20. ChapaEleicao.incluirMembro**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**21. ChapaEleicao.excluir**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**22. ChapaEleicao.excluirComJustificativa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Chapa Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**23. ChapaEleicao.getChapaEleicaoJulgamentoFinalPorResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Chapa Eleicao  
- **ALRs Referenciados**: 1 (getChapaEleicaoJulgamentoFinalPorResponsavelChapa)
- **DER Entrada**: 0

**24. ContrarrazaoRecursoDenuncia.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Contrarrazao Recurso Denuncia  
- **ALRs Referenciados**: 1 (getContrarrazaoRecursoDenunciaBO)
- **DER Entrada**: 0

**25. ContrarrazaoRecursoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Contrarrazao Recurso Impugnacao  
- **ALRs Referenciados**: 2 (Julgamento, getContrarrazaoRecursoImpugnacaoBO)
- **DER Entrada**: 0

**26. ContrarrazaoRecursoImpugnacaoResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Contrarrazao Recurso Impugnacao Resultado  
- **ALRs Referenciados**: 2 (Contrarrazao, getContrarrazaoRecursoImpugnacaoResultadoBO)
- **DER Entrada**: 0

**27. CorpoEmail.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Corpo Email  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**28. DefesaImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Defesa Impugnacao  
- **ALRs Referenciados**: 1 (DefesaImpugnacao)
- **DER Entrada**: 0

**29. DefesaImpugnacao.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Defesa Impugnacao  
- **ALRs Referenciados**: 1 (getArquivoDefesaImpugnacaoBO)
- **DER Entrada**: 1

**30. DenunciaAdmitida.createRelator**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Cria novo registro - Denuncia Admitida  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 2

**31. DenunciaAudienciaInstrucao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Denuncia Audiencia Instrucao  
- **ALRs Referenciados**: 1 (getDenunciaAudienciaInstrucaoBO)
- **DER Entrada**: 0

**32. Denuncia.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Denuncia  
- **ALRs Referenciados**: 2 (Denuncia, getDenunciaBO)
- **DER Entrada**: 0

**33. Denuncia.enviarEmailResponsaveis**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Denuncia  
- **ALRs Referenciados**: 1 (getDenunciaBO)
- **DER Entrada**: 1

**34. DenunciaProvas.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Denuncia Provas  
- **ALRs Referenciados**: 1 (getDenunciaProvasBO)
- **DER Entrada**: 0

**35. DiplomaEleitoral.store**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Cadastra novo registro - Diploma Eleitoral  
- **ALRs Referenciados**: 2 (fails, errors)
- **DER Entrada**: 1

**36. DiplomaEleitoral.update**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Atualiza registro - Diploma Eleitoral  
- **ALRs Referenciados**: 2 (fails, errors)
- **DER Entrada**: 2

**37. DocumentoComissaoMembro.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Documento Comissao Membro  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**38. DocumentoEleicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Documento Eleicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**39. EncaminhamentoDenuncia.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Encaminhamento Denuncia  
- **ALRs Referenciados**: 1 (getEncaminhamentoDenunciaBO)
- **DER Entrada**: 0

**40. EncaminhamentoDenuncia.downloadDenunciaAdmitida**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Encaminhamento Denuncia  
- **ALRs Referenciados**: 1 (getEncaminhamentoDenunciaBO)
- **DER Entrada**: 1

**41. ImpugnacaoResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Impugnacao Resultado  
- **ALRs Referenciados**: 1 (Impugnacao)
- **DER Entrada**: 0

**42. ImpugnacaoResultado.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Impugnacao Resultado  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**43. InformacaoComissaoMembro.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Informacao Comissao Membro  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**44. InformacaoComissaoMembro.concluir**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Informacao Comissao Membro  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**45. JulgamentoAdmissibilidade.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Admissibilidade  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 2

**46. JulgamentoAlegacaoImpugResultado.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Alegacao Impug Resultado  
- **ALRs Referenciados**: 1 (getJulgamentoAlegacaoImpugResultadoBO)
- **DER Entrada**: 1

**47. JulgamentoAlegacaoImpugResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Alegacao Impug Resultado  
- **ALRs Referenciados**: 1 (getJulgamentoAlegacaoImpugResultadoBO)
- **DER Entrada**: 0

**48. JulgamentoDenuncia.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Denuncia  
- **ALRs Referenciados**: 1 (getJulgamentoDenunciaBO)
- **DER Entrada**: 0

**49. JulgamentoFinal.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Final  
- **ALRs Referenciados**: 2 (Julgamento, getJulgamentoFinalBO)
- **DER Entrada**: 0

**50. JulgamentoFinal.getPorChapaEleicaoResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Julgamento Final  
- **ALRs Referenciados**: 1 (getJulgamentoFinalBO)
- **DER Entrada**: 1

**51. JulgamentoImpugnacao.getPorPedidoImpugnacaoResponsavel**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Julgamento Impugnacao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**52. JulgamentoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Impugnacao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**53. JulgamentoRecursoAdmissibilidade.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Admissibilidade  
- **ALRs Referenciados**: 1 (getId)
- **DER Entrada**: 1

**54. JulgamentoRecursoDenuncia.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Denuncia  
- **ALRs Referenciados**: 1 (getJulgamentoRecursoDenunciaBO)
- **DER Entrada**: 0

**55. JulgamentoRecursoImpugResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Impug Resultado  
- **ALRs Referenciados**: 2 (Julgamento, getJulgamentoRecursoImpugResultadoBO)
- **DER Entrada**: 0

**56. JulgamentoRecursoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Impugnacao  
- **ALRs Referenciados**: 2 (Julgamento, getJulgamentoRecursoImpugnacaoBO)
- **DER Entrada**: 0

**57. JulgamentoRecursoImpugnacao.getPorPedidoImpugnacaoResponsavel**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Julgamento Recurso Impugnacao  
- **ALRs Referenciados**: 1 (getJulgamentoRecursoImpugnacaoBO)
- **DER Entrada**: 1

**58. JulgamentoRecursoPedidoSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Pedido Substituicao  
- **ALRs Referenciados**: 1 (getJulgamentoRecursoPedidoSubstituicaoBO)
- **DER Entrada**: 0

**59. JulgamentoRecursoSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Recurso Substituicao  
- **ALRs Referenciados**: 2 (PedidoImpugnacao, getJulgamentoRecursoSubstituicaoBO)
- **DER Entrada**: 0

**60. JulgamentoRecursoSubstituicao.getPorPedidoSubstituicaoResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Julgamento Recurso Substituicao  
- **ALRs Referenciados**: 1 (getJulgamentoRecursoSubstituicaoBO)
- **DER Entrada**: 1

**61. JulgamentoSegundaInstanciaRecurso.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Segunda Instancia Recurso  
- **ALRs Referenciados**: 1 (getJulgamentoSegundaInstanciaRecursoBO)
- **DER Entrada**: 0

**62. JulgamentoSegundaInstanciaSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Segunda Instancia Substituicao  
- **ALRs Referenciados**: 1 (getJulgamentoSegundaInstanciaSubstituicaoBO)
- **DER Entrada**: 0

**63. JulgamentoSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Julgamento Substituicao  
- **ALRs Referenciados**: 1 (PedidoImpugnacao)
- **DER Entrada**: 0

**64. JulgamentoSubstituicao.getPorPedidoSubstituicaoResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Julgamento Substituicao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**65. MembroChapa.aceitarConvite**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**66. MembroChapa.alterarDadosCurriculo**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**67. MembroChapa.rejeitarConvite**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**68. MembroChapa.reenviarConvite**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**69. MembroChapa.alterarSituacaoResponsavel**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Membro Chapa  
- **ALRs Referenciados**: 1 (MembroChapa)
- **DER Entrada**: 1

**70. MembroChapa.alterarStatusConvite**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 1 (MembroChapa)
- **DER Entrada**: 1

**71. MembroChapa.alterarStatusValidacao**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 1 (MembroChapa)
- **DER Entrada**: 1

**72. MembroChapa.enviarEmailPendencias**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**73. MembroChapa.downloadDocumentoComprobatorio**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 1 (getDocumentoComprobatorioBO)
- **DER Entrada**: 1

**74. MembroChapa.downloadDocumentoRepresentatividade**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**75. MembroChapa.excluir**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**76. MembroChapa.excluirByResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**77. MembroChapa.getResponsaveisChapaPorIdChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Membro Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**78. MembroComissao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Comissao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**79. MembroComissao.aceitarConvite**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Comissao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**80. MembroComissao.enviarEmailsConvitesPendentes**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Membro Comissao  
- **ALRs Referenciados**: 1 (enviarEmailsConvitesPendentes)
- **DER Entrada**: 0

**81. ParametroConselheiro.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Parametro Conselheiro  
- **ALRs Referenciados**: 1 (getParametroConselheiroBO)
- **DER Entrada**: 1

**82. ParecerFinal.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Parecer Final  
- **ALRs Referenciados**: 1 (getParecerFinalBO)
- **DER Entrada**: 0

**83. PedidoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Pedido Impugnacao  
- **ALRs Referenciados**: 1 (PedidoImpugnacao)
- **DER Entrada**: 0

**84. PedidoImpugnacao.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Pedido Impugnacao  
- **ALRs Referenciados**: 1 (getArquivoPedidoImpugnacaoBO)
- **DER Entrada**: 1

**85. PedidoImpugnacao.getRespostasDeclaracaoTO**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Pedido Impugnacao  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**86. PedidoImpugnacao.getPedidosPorResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Pedido Impugnacao  
- **ALRs Referenciados**: 1 (getPedidosPorResponsavelChapa)
- **DER Entrada**: 0

**87. PedidoSubstituicaoChapa.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Pedido Substituicao Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**88. PedidoSubstituicaoChapa.getPedidosChapaPorResponsavelChapa**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Salva dados - Pedido Substituicao Chapa  
- **ALRs Referenciados**: 1 (getPedidosChapaPorResponsavelChapa)
- **DER Entrada**: 0

**89. PedidoSubstituicaoChapa.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Pedido Substituicao Chapa  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**90. PublicacaoDocumento.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Publicacao Documento  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**91. RecursoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Impugnacao  
- **ALRs Referenciados**: 1 (getRecursoImpugnacaoBO)
- **DER Entrada**: 0

**92. RecursoImpugnacaoResultado.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Impugnacao Resultado  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**93. RecursoImpugnacaoResultado.downloadDocumento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Impugnacao Resultado  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1

**94. RecursoJulgamentoAdmissibilidade.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Julgamento Admissibilidade  
- **ALRs Referenciados**: 1 (getId)
- **DER Entrada**: 1

**95. RecursoJulgamentoFinal.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Julgamento Final  
- **ALRs Referenciados**: 2 (Julgamento, getRecursoJulgamentoFinalBO)
- **DER Entrada**: 0

**96. RecursoSegundoJulgamentoSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Segundo Julgamento Substituicao  
- **ALRs Referenciados**: 2 (Julgamento, getRecursoSegundoJulgamentoSubstituicaoBO)
- **DER Entrada**: 0

**97. RecursoSubstituicao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Recurso Substituicao  
- **ALRs Referenciados**: 1 (getRecursoSubstituicaoBO)
- **DER Entrada**: 0

**98. SubstituicaoImpugnacao.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Substituicao Impugnacao  
- **ALRs Referenciados**: 1 (getSubstituicaoImpugnacaoBO)
- **DER Entrada**: 0

**99. SubstituicaoJulgamentoFinal.salvar**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Processamento de entrada - Substituicao Julgamento Final  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 0

**100. TermoDePosse.store**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Cadastra novo registro - Termo De Posse  
- **ALRs Referenciados**: 2 (fails, errors)
- **DER Entrada**: 1

**101. TermoDePosse.update**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Atualiza registro - Termo De Posse  
- **ALRs Referenciados**: 2 (fails, errors)
- **DER Entrada**: 2

**102. TipoFinalizacaoMandato.delete**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Remove registro - Tipo Finalizacao Mandato  
- **ALRs Referenciados**: 0 ()
- **DER Entrada**: 1


### 📤 SAÍDAS EXTERNAS (64 funções)


**1. DiplomaEleitoral.imprimir**
- **Complexidade**: Alta (7 PF)
- **Descrição**: Geração de saída - Diploma Eleitoral
- **ALRs Referenciados**: 3 (Arquivo, fails, errors)
- **DER Saída**: 12

**2. TermoDePosse.imprimir**
- **Complexidade**: Alta (7 PF)
- **Descrição**: Geração de saída - Termo De Posse
- **ALRs Referenciados**: 3 (Arquivo, fails, errors)
- **DER Saída**: 12

**3. AlegacaoFinal.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Alegacao Final
- **ALRs Referenciados**: 1 (getAlegacaoFinalBO)
- **DER Saída**: 5

**4. Arquivo.validarResolucaoPDF**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**5. Arquivo.validarArquivoViaDeclaracao**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**6. Arquivo.validarArquivoDeclaracaoChapa**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Arquivo
- **ALRs Referenciados**: 1 (getChapaEleicaoBO)
- **DER Saída**: 7

**7. AtividadeSecundariaCalendario.getDeclaracaoPorAtividadeSecundariaTipo**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Atividade Secundaria Calendario
- **ALRs Referenciados**: 1 (getDeclaracaoAtividadeBO)
- **DER Saída**: 7

**8. AtividadeSecundariaCalendario.getCountAtividadesPorDeclaracao**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Atividade Secundaria Calendario
- **ALRs Referenciados**: 1 (getDeclaracaoAtividadeBO)
- **DER Saída**: 7

**9. Calendario.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**10. Calendario.gerarDocumento**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Calendario
- **ALRs Referenciados**: 1 (gerarDocumento)
- **DER Saída**: 5

**11. ChapaEleicao.validarCauUfProfissionalConvidadoChapa**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**12. ChapaEleicao.gerarDocumentoPDFExtratoQuantidadeChapa**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**13. ChapaEleicao.gerarXMLChapas**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**14. ChapaEleicao.downloadFotoMembro**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**15. ChapaEleicao.gerarCSVChapas**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**16. ChapaEleicao.gerarCSVChapasPorUf**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**17. ChapaEleicao.gerarDocumentoPDFExtratoChapa**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Chapa Eleicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**18. ChapaEleicao.gerarDadosExtratoChapaJson**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 9

**19. ChapaEleicao.gerarCSVChapasTrePorUf**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Chapa Eleicao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**20. ContrarrazaoRecursoDenuncia.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Contrarrazao Recurso Denuncia
- **ALRs Referenciados**: 1 (getContrarrazaoRecursoDenunciaBO)
- **DER Saída**: 5

**21. ContrarrazaoRecursoImpugnacao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Contrarrazao Recurso Impugnacao
- **ALRs Referenciados**: 1 (getContrarrazaoRecursoImpugnacaoBO)
- **DER Saída**: 5

**22. ContrarrazaoRecursoImpugnacaoResultado.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Contrarrazao Recurso Impugnacao Resultado
- **ALRs Referenciados**: 1 (getContrarrazaoRecursoImpugnacaoResultadoBO)
- **DER Saída**: 5

**23. DenunciaAudienciaInstrucao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Denuncia Audiencia Instrucao
- **ALRs Referenciados**: 1 (getDenunciaAudienciaInstrucaoBO)
- **DER Saída**: 5

**24. Denuncia.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Denuncia
- **ALRs Referenciados**: 1 (getDenunciaBO)
- **DER Saída**: 5

**25. Denuncia.downloadInadmitida**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Denuncia
- **ALRs Referenciados**: 1 (getDenunciaBO)
- **DER Saída**: 5

**26. Denuncia.gerarDocumento**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Denuncia
- **ALRs Referenciados**: 1 (getDenunciaBO)
- **DER Saída**: 5

**27. DenunciaDefesa.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Denuncia Defesa
- **ALRs Referenciados**: 1 (getDenunciaDefesaBO)
- **DER Saída**: 5

**28. DenunciaProvas.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Denuncia Provas
- **ALRs Referenciados**: 1 (getDenunciaProvasBO)
- **DER Saída**: 5

**29. DocumentoEleicao.getDocumentosPorEleicao**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Documento Eleicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**30. DocumentoEleicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Documento Eleicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**31. EncaminhamentoDenuncia.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Encaminhamento Denuncia
- **ALRs Referenciados**: 1 (getEncaminhamentoDenunciaBO)
- **DER Saída**: 5

**32. HistoricoExtratoConselheiro.gerarDocumentoListaConselheiros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Historico Extrato Conselheiro
- **ALRs Referenciados**: 2 (Documento, getHistoricoExtratoConselheiroBO)
- **DER Saída**: 5

**33. HistoricoExtratoConselheiro.gerarDocumentoZIPListaConselheiros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Historico Extrato Conselheiro
- **ALRs Referenciados**: 2 (Documento, getHistoricoExtratoConselheiroBO)
- **DER Saída**: 5

**34. HistoricoExtratoConselheiro.gerarDocumentoXSLListaConselheiros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Historico Extrato Conselheiro
- **ALRs Referenciados**: 2 (Documento, getHistoricoExtratoConselheiroBO)
- **DER Saída**: 5

**35. JulgamentoAdmissibilidade.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Admissibilidade
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**36. JulgamentoDenuncia.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Denuncia
- **ALRs Referenciados**: 1 (getJulgamentoDenunciaBO)
- **DER Saída**: 5

**37. JulgamentoFinal.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Final
- **ALRs Referenciados**: 1 (getJulgamentoFinalBO)
- **DER Saída**: 5

**38. JulgamentoImpugnacao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Impugnacao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**39. JulgamentoImpugnacao.getDocumentoPDFJulgamentoImpugnacao**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Julgamento Impugnacao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**40. JulgamentoRecursoAdmissibilidade.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Recurso Admissibilidade
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**41. JulgamentoRecursoDenuncia.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Recurso Denuncia
- **ALRs Referenciados**: 1 (getJulgamentoRecursoDenunciaBO)
- **DER Saída**: 5

**42. JulgamentoRecursoImpugnacao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Recurso Impugnacao
- **ALRs Referenciados**: 1 (getJulgamentoRecursoImpugnacaoBO)
- **DER Saída**: 5

**43. JulgamentoRecursoPedidoSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Recurso Pedido Substituicao
- **ALRs Referenciados**: 1 (getJulgamentoRecursoPedidoSubstituicaoBO)
- **DER Saída**: 5

**44. JulgamentoRecursoSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Recurso Substituicao
- **ALRs Referenciados**: 1 (getJulgamentoRecursoSubstituicaoBO)
- **DER Saída**: 5

**45. JulgamentoSegundaInstanciaRecurso.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Segunda Instancia Recurso
- **ALRs Referenciados**: 1 (getJulgamentoSegundaInstanciaRecursoBO)
- **DER Saída**: 5

**46. JulgamentoSegundaInstanciaSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Segunda Instancia Substituicao
- **ALRs Referenciados**: 1 (getJulgamentoSegundaInstanciaSubstituicaoBO)
- **DER Saída**: 5

**47. JulgamentoSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Julgamento Substituicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**48. JulgamentoSubstituicao.getDocumentoPDFJulgamentoSubstituicao**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Julgamento Substituicao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**49. MembroComissao.gerarDocumentoRelacaoMembros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Membro Comissao
- **ALRs Referenciados**: 1 (Documento)
- **DER Saída**: 5

**50. MembroComissao.getDeclaracaoPorIdProfissional**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Membro Comissao
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**51. ParametroConselheiro.gerarDocumentoXSLListaConselheiros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Parametro Conselheiro
- **ALRs Referenciados**: 2 (Documento, getParametroConselheiroBO)
- **DER Saída**: 5

**52. ParametroConselheiro.gerarDocumentoPDFListaConselheiros**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Parametro Conselheiro
- **ALRs Referenciados**: 2 (Documento, getParametroConselheiroBO)
- **DER Saída**: 5

**53. ParecerFinal.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Parecer Final
- **ALRs Referenciados**: 1 (getParecerFinalBO)
- **DER Saída**: 5

**54. PedidoSubstituicaoChapa.getDocumentoPDFPedidoSubstituicaoMembro**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Pedido Substituicao Chapa
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**55. PublicacaoDocumento.gerarPDF**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Gera PDF - Publicacao Documento
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**56. PublicacaoDocumento.gerarDocumento**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Geração de saída - Publicacao Documento
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**57. PublicacaoDocumento.downloadPdf**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Publicacao Documento
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**58. RecursoImpugnacao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Recurso Impugnacao
- **ALRs Referenciados**: 1 (getRecursoImpugnacaoBO)
- **DER Saída**: 5

**59. RecursoJulgamentoAdmissibilidade.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Recurso Julgamento Admissibilidade
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**60. RecursoJulgamentoFinal.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Recurso Julgamento Final
- **ALRs Referenciados**: 1 (getRecursoJulgamentoFinalBO)
- **DER Saída**: 5

**61. RecursoSegundoJulgamentoSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Recurso Segundo Julgamento Substituicao
- **ALRs Referenciados**: 1 (getRecursoSegundoJulgamentoSubstituicaoBO)
- **DER Saída**: 5

**62. RecursoSubstituicao.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Recurso Substituicao
- **ALRs Referenciados**: 1 (getRecursoSubstituicaoBO)
- **DER Saída**: 5

**63. SubstituicaoJulgamentoFinal.download**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Substituicao Julgamento Final
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**64. SubstituicaoJulgamentoFinal.downloadRecurso**
- **Complexidade**: Baixa (4 PF)
- **Descrição**: Faz download - Substituicao Julgamento Final
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5


### 🔍 CONSULTAS EXTERNAS (256 funções)


**1. Artisan.verificaMenusPortal**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Consulta dados - Artisan
- **ALRs Referenciados**: 4 (portal, getConnection, execute...)
- **DER Saída**: 7

**2. Artisan.verificaPermissoesUsuario**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Consulta dados - Artisan
- **ALRs Referenciados**: 4 (portal, getConnection, execute...)
- **DER Saída**: 7

**3. Artisan.recuperaInformacaoTabela**
- **Complexidade**: Alta (6 PF)
- **Descrição**: Consulta dados - Artisan
- **ALRs Referenciados**: 5 (information_schema, eleitoral, getConnection...)
- **DER Saída**: 7

**4. AlegacaoFinal.validarArquivo**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Alegacao Final
- **ALRs Referenciados**: 1 (getAlegacaoFinalBO)
- **DER Saída**: 7

**5. AlegacaoFinal.getPorEncaminhamento**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Alegacao Final
- **ALRs Referenciados**: 1 (getAlegacaoFinalBO)
- **DER Saída**: 7

**6. AlegacaoImpugnacaoResultado.getAlegacaoPorIdImpugnacao**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Alegacao Impugnacao Resultado
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**7. AlegacaoImpugnacaoResultado.getValidacaoCadastroAlegacaoTO**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Alegacao Impugnacao Resultado
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**8. Arquivo.validarAriquivosCabecalhoEmail**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**9. Arquivo.validarArquivoEleicao**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**10. Arquivo.validarFotoSinteseCurriculo**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**11. Arquivo.validarArquivo**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**12. Arquivo.validarArquivoDenuncia**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Arquivo
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**13. Artisan.chamarComandoSchedule**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Artisan
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**14. Artisan.verificaAgendamentos**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Artisan
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 5

**15. AtividadePrincipalCalendario.getAtividadePrincipalPorCalendario**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Principal Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**16. AtividadePrincipalCalendario.getAtividadePrincipalPorCalendarioComFiltro**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Principal Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**17. AtividadePrincipalCalendario.getAtividadePrincipal**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Principal Calendario
- **ALRs Referenciados**: 1 (getAtividadePrincipal)
- **DER Saída**: 7

**18. AtividadeSecundariaCalendario.getPorId**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**19. AtividadeSecundariaCalendario.definirEmailsDeclaracoesPorAtividadeSecundaria**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Consulta dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**20. AtividadeSecundariaCalendario.getUfsCalendariosPorAtividadeSecundaria**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**21. AtividadeSecundariaCalendario.getProfissionaisPorCpfNome**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 1 (getProfissionalBO)
- **DER Saída**: 7

**22. AtividadeSecundariaCalendario.getDeclaracoesPorAtividadeSecundaria**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 1 (getDeclaracaoAtividadeBO)
- **DER Saída**: 7

**23. AtividadeSecundariaCalendario.getInformacaoDefinicaoEmails**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**24. AtividadeSecundariaCalendario.getInformacaoDefinicaoDeclaracoes**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**25. AtividadeSecundariaCalendario.getAtividadeSecundariaAtivaPorNivel**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Atividade Secundaria Calendario
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**26. CabecalhoEmail.getPorId**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Cabecalho Email
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**27. CabecalhoEmail.getUfs**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Cabecalho Email
- **ALRs Referenciados**: 1 (getUfs)
- **DER Saída**: 7

**28. CabecalhoEmail.getCabecalhoEmailPorFiltro**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Cabecalho Email
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**29. CabecalhoEmail.getTotalCorpoEmailVinculado**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Cabecalho Email
- **ALRs Referenciados**: 0 ()
- **DER Saída**: 7

**30. Calendario.getAnos**
- **Complexidade**: Baixa (3 PF)
- **Descrição**: Obtém dados - Calendario
- **ALRs Referenciados**: 1 (getAnos)
- **DER Saída**: 7



*... e mais 226 consultas externas de menor complexidade*


---

## 📊 ESTATÍSTICAS E MÉTRICAS

### Distribuição Geral por Complexidade:
- **🟢 Baixa**: 414 funções (1304 PF - 96.3%)
- **🟡 Média**: 0 funções (0 PF - 0.0%)
- **🔴 Alta**: 8 funções (50 PF - 3.7%)

### Métricas de Qualidade:
- **Complexidade Média por Função**: 3.21 PF
- **Módulo Mais Complexo**: Gestão de Chapas e Candidaturas
- **Taxa de Funções de Alta Complexidade**: 1.9%

---

## 🎯 RECOMENDAÇÕES PARA MIGRAÇÃO

### Estratégia de Migração por Complexidade:

#### 🟢 Funções de BAIXA Complexidade (414 funções):
- **Abordagem**: Migração direta e automatizada
- **Riscos**: Baixos
- **Estimativa**: 166 dias úteis
- **Recomendação**: Priorizar para liberação rápida de funcionalidades básicas

#### 🟡 Funções de MÉDIA Complexidade (0 funções):
- **Abordagem**: Revisão detalhada e otimização durante migração
- **Riscos**: Médios - requer análise de regras de negócio
- **Estimativa**: 0 dias úteis  
- **Recomendação**: Revisar lógica de negócio e otimizar performance

#### 🔴 Funções de ALTA Complexidade (8 funções):
- **Abordagem**: Re-engenharia completa com refatoração
- **Riscos**: Altos - requer especialistas em domínio
- **Estimativa**: 12 dias úteis
- **Recomendação**: Redesign de arquitetura e simplificação de fluxos

### **📅 ESTIMATIVA TOTAL DE MIGRAÇÃO: 178 dias úteis**

### 🏆 Módulos Prioritários para Migração:
1. **Gestão de Chapas e Candidaturas** - 256 PF (82 funções)
   - Impacto: CRÍTICO
   - Prioridade: 🔴 ALTA
2. **Sistema de Denúncias** - 214 PF (68 funções)
   - Impacto: CRÍTICO
   - Prioridade: 🔴 ALTA
3. **Sistema de Impugnações** - 198 PF (64 funções)
   - Impacto: CRÍTICO
   - Prioridade: 🟡 MÉDIA
4. **Sistema de Julgamentos** - 182 PF (56 funções)
   - Impacto: CRÍTICO
   - Prioridade: 🟡 MÉDIA
5. **Gestão de Calendário Eleitoral** - 130 PF (42 funções)
   - Impacto: CRÍTICO
   - Prioridade: 🟢 BAIXA
6. **Gestão de Membros de Comissão** - 86 PF (28 funções)
   - Impacto: ALTO
   - Prioridade: 🟢 BAIXA

---

## 📝 CONCLUSÕES E PRÓXIMOS PASSOS

### Principais Achados:
1. **Volume Total**: 1354 PF transacionais identificados
2. **Complexidade Dominante**: Baixa
3. **Módulo Crítico**: Gestão de Chapas e Candidaturas (maior concentração de funcionalidades)
4. **Distribuição**: 57% consultas, 23% entradas, 19% saídas

### Recomendações Estratégicas:
1. **Faseamento**: Iniciar pelos módulos de menor complexidade
2. **Arquitetura**: Implementar padrões modernos (CQRS, DDD)  
3. **Testes**: Cobertura mínima de 80% para funções críticas
4. **Performance**: Otimizar consultas complexas identificadas
5. **Documentação**: Mapear regras de negócio das funções de alta complexidade

---

**📋 Relatório gerado automaticamente em 25/08/2025 às 20:06:29**  
**🔍 Metodologia**: Análise de Pontos de Função (APF) segundo IFPUG 4.3+  
**📊 Escopo**: 422 funções transacionais em 20 módulos funcionais  
**⚡ Ferramenta**: Analisador APF Supremo v2.0
        