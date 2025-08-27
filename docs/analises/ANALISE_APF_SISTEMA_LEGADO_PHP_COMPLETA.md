
# ANÁLISE APF - SISTEMA ELEITORAL CAU (PHP LEGACY)
Data da Análise: 25/08/2025

## 1. ESTRUTURA DE DADOS (ALI - Arquivos Lógicos Internos)

### Resumo ALI:
- **Total de Entities**: 177
- **Baixa Complexidade**: 84 entities (588 PF)
- **Média Complexidade**: 76 entities (760 PF)
- **Alta Complexidade**: 17 entities (255 PF)
- **Total PF ALI**: 1603

### Detalhamento das Entities (ALI):
- **AgendamentoEncaminhamentoDenuncia** (TB_AGENDAMENTO_ENCAMINHAMENTO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **AlegacaoFinal** (TB_ALEGACAO_FINAL) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 2
- **AlegacaoImpugnacaoResultado** (TB_ALEGACAO_IMPUGNACAO_RESULTADO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 2
- **ArquivoAlegacaoFinal** (TB_ARQUIVO_ALEGACAO_FINAL) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoCalendario** (TB_ARQUIVO_CALENDARIO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDecMembroComissao** (TB_ARQUIVO_DEC_MEMBRO_COMISSAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDefesaImpugnacao** (TB_ARQUIVO_DEFESA_IMPUGNACAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenuncia** (TB_ARQUIVO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaAdmissibilidade** (TB_ARQUIVO_DENUNCIA_ADMITIDA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaAdmitida** (TB_ARQUIVO_DENUNCIA_ADMITIDA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaAudienciaInstrucao** (TB_ARQUIVO_AUDIENCIA_INSTRUCAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaDefesa** (TB_ARQUIVO_DENUNCIA_DEFESA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaInadmitida** (TB_ARQUIVO_DENUNCIA_INADMITIDA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoDenunciaProvas** (TB_ARQUIVO_DENUNCIA_PROVAS) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoEncaminhamentoDenuncia** (TB_ARQUIVO_ENCAMINHAMENTO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoJulgamentoAdmissibilidade** (tb_arquivo_julgamento_admissibilidade) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoJulgamentoDenuncia** (TB_ARQUIVO_JULGAMENTO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoJulgamentoRecursoAdmissibilidade** (tb_arquivo_julgamentorecursojulgamentoadmissibilidade) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoJulgamentoRecursoDenuncia** (TB_ARQUIVO_JULGAMENTO_RECURSO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoPedidoImpugnacao** (TB_ARQUIVO_PEDIDO_IMPUGNACAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoRecursoContrarrazaoDenuncia** (TB_ARQUIVO_RECURSO_CONTRARRAZAO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoRecursoJulgamentoAdmissibilidade** (tb_arquivo_recursojulgamentoadmissibilidade) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ArquivoRespostaDeclaracaoChapa** (TB_ARQUIVO_RESP_DEC_CHAPA) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **AtividadePrincipalCalendario** (TB_ATIV_PRINCIPAL) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 3
- **AtividadeSecundariaCalendario** (TB_ATIV_SECUNDARIA) - ALTA - 15 PF
  - Campos: 6
  - Relacionamentos: 7
- **CabecalhoEmail** (TB_CABECALHO_EMAIL) - MEDIA - 10 PF
  - Campos: 10
  - Relacionamentos: 2
- **CabecalhoEmailUf** (TB_CABECALHO_EMAIL_UF) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **Calendario** (TB_CALENDARIO) - ALTA - 15 PF
  - Campos: 10
  - Relacionamentos: 6
- **CalendarioSituacao** (TB_CALENDARIO_SITUACAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **ChapaEleicao** (TB_CHAPA_ELEICAO) - ALTA - 15 PF
  - Campos: 8
  - Relacionamentos: 14
- **ChapaEleicaoStatus** (TB_CHAPA_ELEICAO_STATUS) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **Conselheiro** (tb_conselheiro) - MEDIA - 10 PF
  - Campos: 12
  - Relacionamentos: 2
- **ContrarrazaoRecursoDenuncia** (TB_RECURSO_CONTRARRAZAO_DENUNCIA) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 4
- **ContrarrazaoRecursoImpugnacao** (TB_CONTRARRAZAO_RECURSO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 2
- **ContrarrazaoRecursoImpugnacaoResultado** (TB_CONTRARRAZAO_RECURSO_IMPUGNACAO_RESULTADO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 2
- **CorpoEmail** (TB_CORPO_EMAIL) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 2
- **Declaracao** (TB_DECLARACAO) - MEDIA - 10 PF
  - Campos: 12
  - Relacionamentos: 2
- **DeclaracaoAtividade** (TB_DECLARACAO_ATIVIDADE) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **DefesaImpugnacao** (TB_DEFESA_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 2
- **Denuncia** (TB_DENUNCIA) - ALTA - 15 PF
  - Campos: 6
  - Relacionamentos: 19
- **DenunciaAdmissibilidade** (TB_DENUNCIA_ADMITIDA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 4
- **DenunciaAdmitida** (TB_DENUNCIA_ADMITIDA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 4
- **DenunciaAudienciaInstrucao** (TB_DENUNCIA_AUDIENCIA_INSTRUCAO) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 3
- **DenunciaChapa** (TB_DENUNCIA_CHAPA) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **DenunciaDefesa** (TB_DENUNCIA_DEFESA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 2
- **DenunciaInadmitida** (TB_DENUNCIA_INADMITIDA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 3
- **DenunciaMembroChapa** (TB_DENUNCIA_MEMBRO_CHAPA) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **DenunciaMembroComissao** (TB_DENUNCIA_MEMBRO_COMISSAO) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **DenunciaOutro** (TB_DENUNCIA_OUTRO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **DenunciaProvas** (TB_DENUNCIA_PROVAS) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 3
- **DenunciaSituacao** (TB_DENUNCIA_SITUACAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **DocumentoComissaoMembro** (TB_DOC_COMISSAO_MEMBRO) - MEDIA - 10 PF
  - Campos: 9
  - Relacionamentos: 2
- **DocumentoComprobatorioSinteseCurriculo** (TB_DOC_COMPROB_SINTESE_CURRICULO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **DocumentoEleicao** (TB_DOC_ELEICAO) - BAIXA - 7 PF
  - Campos: 10
  - Relacionamentos: 1
- **Eleicao** (TB_ELEICAO) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 3
- **EleicaoSituacao** (TB_ELEICAO_SITUACAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **EmailAtividadeSecundaria** (TB_EMAIL_ATIV_SECUNDARIA) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 3
- **EmailAtividadeSecundariaTipo** (tb_email_tp_corpo_email) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **EncaminhamentoDenuncia** (TB_ENCAMINHAMENTO_DENUNCIA) - ALTA - 15 PF
  - Campos: 9
  - Relacionamentos: 11
- **Endereco** (tb_enderecos) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **Entity** (N/A) - BAIXA - 7 PF
  - Campos: 0
  - Relacionamentos: 0
- **Filial** (tb_filial) - BAIXA - 7 PF
  - Campos: 13
  - Relacionamentos: 0
- **Historico** (TB_HISTORICO) - BAIXA - 7 PF
  - Campos: 8
  - Relacionamentos: 0
- **HistoricoAlteracaoInformacaoComissaoMembro** (TB_HIST_ALT_COMISSAO_MEMBRO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **HistoricoCalendario** (TB_HIST_CALENDARIO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 2
- **HistoricoChapaEleicao** (TB_HIST_CHAPA_ELEICAO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 3
- **HistoricoDenuncia** (TB_HIST_DENUNCIA) - BAIXA - 7 PF
  - Campos: 5
  - Relacionamentos: 1
- **HistoricoExtratoConselheiro** (TB_HIST_EXTRATO) - MEDIA - 10 PF
  - Campos: 7
  - Relacionamentos: 2
- **HistoricoInformacaoComissaoMembro** (TB_HIST_COMISSAO_MEMBRO) - BAIXA - 7 PF
  - Campos: 6
  - Relacionamentos: 1
- **HistoricoJugamentoAlegacaoImpugResultado** (tb_hist_julgamento_alegacao_resultado) - BAIXA - 7 PF
  - Campos: 5
  - Relacionamentos: 1
- **HistoricoParametroConselheiro** (tb_hist_param_conselheiro) - BAIXA - 7 PF
  - Campos: 7
  - Relacionamentos: 1
- **HistoricoProfissional** (TB_HISTORICO_PROFISSIONAL) - BAIXA - 7 PF
  - Campos: 7
  - Relacionamentos: 1
- **ImpedimentoSuspeicao** (TB_IMPEDIMENTO_SUSPEICAO) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **ImpugnacaoResultado** (TB_PEDIDO_IMPUGNACAO_RESULTADO) - ALTA - 15 PF
  - Campos: 6
  - Relacionamentos: 7
- **IndicacaoJulgamentoFinal** (TB_INDICACAO_JULGAMENTO_FINAL) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **IndicacaoJulgamentoRecursoPedidoSubstituicao** (TB_INDICACAO_JULGAMENTO_RECURSO_PEDIDO_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **IndicacaoJulgamentoSegundaInstanciaRecurso** (TB_INDICACAO_JULGAMENTO_SEGUNDA_INSTANCIA_RECURSO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **IndicacaoJulgamentoSegundaInstanciaSubstituicao** (TB_INDICACAO_JULGAMENTO_SEGUNDA_INSTANCIA_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **InformacaoComissaoMembro** (TB_INF_COMISSAO_MEMBRO) - MEDIA - 10 PF
  - Campos: 7
  - Relacionamentos: 3
- **ItemDeclaracao** (TB_ITEM_DECLARACAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **ItemRespostaDeclaracao** (TB_ITEM_RESPOSTA_DECLARACAO) - BAIXA - 7 PF
  - Campos: 4
  - Relacionamentos: 1
- **JulgamentoAdmissibilidade** (tb_julgamento_admissibilidade) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 4
- **JulgamentoAlegacaoImpugResultado** (TB_JULGAMENTO_ALEGACAO_RESULTADO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 4
- **JulgamentoDenuncia** (TB_JULGAMENTO_DENUNCIA) - ALTA - 15 PF
  - Campos: 8
  - Relacionamentos: 6
- **JulgamentoFinal** (TB_JULGAMENTO_FINAL) - ALTA - 15 PF
  - Campos: 6
  - Relacionamentos: 7
- **JulgamentoImpugnacao** (TB_JULGAMENTO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 4
- **JulgamentoRecursoAdmissibilidade** (tb_julgamento_recursojulgamentoadmissibilidade) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 3
- **JulgamentoRecursoDenuncia** (TB_JULGAMENTO_RECURSO_DENUNCIA) - ALTA - 15 PF
  - Campos: 8
  - Relacionamentos: 8
- **JulgamentoRecursoImpugResultado** (TB_JULGAMENTO_RECURSO_RESULTADO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 3
- **JulgamentoRecursoImpugnacao** (TB_JULGAMENTO_RECURSO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 3
- **JulgamentoRecursoPedidoSubstituicao** (TB_JULGAMENTO_RECURSO_PEDIDO_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 5
- **JulgamentoRecursoSubstituicao** (TB_JULGAMENTO_RECURSO_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 3
- **JulgamentoSegundaInstanciaRecurso** (TB_JULGAMENTO_SEGUNDA_INSTANCIA_RECURSO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 5
- **JulgamentoSegundaInstanciaSubstituicao** (TB_JULGAMENTO_SEGUNDA_INSTANCIA_SUBSTITUICAO) - ALTA - 15 PF
  - Campos: 6
  - Relacionamentos: 6
- **JulgamentoSubstituicao** (TB_JULGAMENTO_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 3
- **JustificativaAlteracaoCalendario** (TB_JUSTIFIC_ALTERACAO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **Lei** (TB_LEI) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **MembroChapa** (TB_MEMBRO_CHAPA) - ALTA - 15 PF
  - Campos: 7
  - Relacionamentos: 15
- **MembroChapaPendencia** (TB_MEMBRO_CHAPA_PENDENCIA) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **MembroChapaSubstituicao** (TB_MEMBRO_CHAPA_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 3
- **MembroComissao** (TB_MEMBRO_COMISSAO) - ALTA - 15 PF
  - Campos: 5
  - Relacionamentos: 9
- **MembroComissaoSituacao** (TB_MEMBRO_COMISSAO_STATUS) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **MembroSubstituicaoJulgamentoFinal** (TB_MEMBRO_SUBSTITUICAO_JULGAMENTO_FINAL) - ALTA - 15 PF
  - Campos: 1
  - Relacionamentos: 6
- **Modulo** (TB_MODULO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **ParametroConselheiro** (TB_PARAM_CONSELHEIRO) - MEDIA - 10 PF
  - Campos: 7
  - Relacionamentos: 2
- **ParecerFinal** (TB_PARECER_FINAL) - MEDIA - 10 PF
  - Campos: 4
  - Relacionamentos: 3
- **ParecerJulgamentoRecursoAdmissibilidade** (tb_parecer_julgamentorecursoadmissibilidade) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **PedidoImpugnacao** (TB_PEDIDO_IMPUGNACAO) - ALTA - 15 PF
  - Campos: 4
  - Relacionamentos: 8
- **PedidoSubstituicaoChapa** (TB_PEDIDO_SUBSTITUICAO_CHAPA) - MEDIA - 10 PF
  - Campos: 7
  - Relacionamentos: 4
- **Permissao** (tb_permissoes) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 0
- **Pessoa** (tb_pessoa) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **PlataformaChapaHistorico** (TB_PLATAFORMA_CHAPA_HISTORICO) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 4
- **PrazoCalendario** (TB_PRAZO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 3
- **Profissional** (tb_profissional) - MEDIA - 10 PF
  - Campos: 17
  - Relacionamentos: 2
- **ProfissionalRegistro** (tb_profissional_registro) - MEDIA - 10 PF
  - Campos: 8
  - Relacionamentos: 2
- **ProporcaoConselheiroExtrato** (TB_PROPORCAO_CONSELHEIRO_EXTRATO) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 1
- **PublicacaoDocumento** (TB_PUBLICACAO_DOC) - BAIXA - 7 PF
  - Campos: 4
  - Relacionamentos: 1
- **RecursoDenuncia** (TB_RECURSO_CONTRARRAZAO_DENUNCIA) - ALTA - 15 PF
  - Campos: 5
  - Relacionamentos: 7
- **RecursoImpugnacao** (TB_RECURSO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 4
- **RecursoImpugnacaoResultado** (TB_RECURSO_IMPUGNACAO_RESULTADO) - MEDIA - 10 PF
  - Campos: 6
  - Relacionamentos: 4
- **RecursoIndicacao** (TB_RECURSO_INDICACAO) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **RecursoJulgamentoAdmissibilidade** (tb_recurso_julgamentoadmissibilidade) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 3
- **RecursoJulgamentoFinal** (TB_RECURSO_JULGAMENTO_FINAL) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 4
- **RecursoSegundoJulgamentoSubstituicao** (TB_RECURSO_JULGAMENTO_SEGUNDA_INSTANCIA_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 3
- **RecursoSubstituicao** (TB_RECURSO_SUBSTITUICAO) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 2
- **RedeSocialChapa** (TB_REDE_SOCIAL_CHAPA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 2
- **RedeSocialHistoricoPlataforma** (TB_REDE_SOCIAL_HISTORICO_PLATAFORMA) - MEDIA - 10 PF
  - Campos: 3
  - Relacionamentos: 2
- **RespostaDeclaracao** (TB_RESPOSTA_DECLARACAO) - BAIXA - 7 PF
  - Campos: 4
  - Relacionamentos: 1
- **RespostaDeclaracaoPedidoImpugnacao** (TB_RESPOSTA_DECLARACAO_PEDIDO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **RespostaDeclaracaoRepresentatividade** (tb_resposta_declaracao_representatividade) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2
- **RetificacaoJulgamentoDenuncia** (TB_JULGAMENTO_DENUNCIA) - ALTA - 15 PF
  - Campos: 8
  - Relacionamentos: 6
- **RetificacaoJulgamentoRecursoDenuncia** (TB_JULGAMENTO_RECURSO_DENUNCIA) - ALTA - 15 PF
  - Campos: 8
  - Relacionamentos: 8
- **SituacaoCalendario** (TB_SITUACAO_CALENDARIO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **SituacaoDenuncia** (TB_SITUACAO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **SituacaoEleicao** (TB_SITUACAO_ELEICAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **SituacaoMembroChapa** (TB_SITUACAO_MEMBRO_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **SituacaoMembroComissao** (TB_STATUS_MEMBRO_COMISSAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **SituacaoRegistro** (tb_situacaoregistro) - BAIXA - 7 PF
  - Campos: 8
  - Relacionamentos: 0
- **StatusChapa** (TB_STATUS_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusChapaJulgamentoFinal** (TB_STATUS_CHAPA_JULGAMENTO_FINAL) - BAIXA - 7 PF
  - Campos: 3
  - Relacionamentos: 0
- **StatusImpugnacaoResultado** (TB_STATUS_PEDIDO_IMPUGNACAO_RESULTADO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusJulgamentoAlegacaoResultado** (TB_STATUS_JULGAMENTO_ALEGACAO_RESULTADO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusJulgamentoFinal** (TB_STATUS_JULGAMENTO_FINAL) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusJulgamentoImpugnacao** (TB_STATUS_JULGAMENTO_IMPUGNACAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusJulgamentoRecursoImpugResultado** (TB_STATUS_JULGAMENTO_RECURSO_RESULTADO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusJulgamentoSubstituicao** (TB_STATUS_JULGAMENTO_SUBSTITUICAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusParticipacaoChapa** (TB_STATUS_PARTIC_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusPedidoImpugnacao** (TB_STATUS_PEDIDO_IMPUGNACAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusRecursoDenuncia** (TB_STATUS_RECURSO_DENUNCIA) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 2
- **StatusSubstituicaoChapa** (TB_STATUS_SUBSTITUICAO_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **StatusValidacaoMembroChapa** (TB_STATUS_VALIDACAO_MEMBRO_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **SubstituicaoImpugnacao** (TB_SUBSTITUICAO_IMPUGNACAO) - MEDIA - 10 PF
  - Campos: 2
  - Relacionamentos: 3
- **SubstituicaoJulgamentoFinal** (TB_SUBSTITUICAO_JULGAMENTO_FINAL) - MEDIA - 10 PF
  - Campos: 5
  - Relacionamentos: 4
- **TestemunhaDenuncia** (TB_TESTEMUNHA) - BAIXA - 7 PF
  - Campos: 4
  - Relacionamentos: 1
- **TipoAlteracao** (TB_TP_ALTERACAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoCandidatura** (TB_TP_CANDIDATURA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoDeclaracaoAtividade** (TB_TP_DECLARACAO_ATIVIDADE) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **TipoDeclaracaoMembroChapa** (TB_TP_DECLARACAO_MEMBRO_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoDenuncia** (TB_TIPO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoEmailAtividadeSecundaria** (TB_TP_CORPO_EMAIL) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoEncaminhamento** (TB_TIPO_ENCAMINHAMENTO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoJulgamento** (TB_TIPO_JULGAMENTO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoJulgamentoAdmissibilidade** (tb_tipo_julgamento_admissibilidade) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoMembroChapa** (TB_TP_MEMBRO_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoParticipacaoChapa** (TB_TP_PARTIC_CHAPA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoParticipacaoMembro** (TB_TIPO_PARTICIPACAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoPendencia** (TB_TP_PENDENCIA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoProcesso** (TB_TIPO_PROCESSO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoRecursoImpugnacaoResultado** (TB_TP_RECURSO_IMPUGNACAO_RESULTADO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoRedeSocial** (TB_TP_REDE_SOCIAL) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoSentencaJulgamento** (TB_TIPO_SENTENCA_JULGAMENTO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoSituacaoEncaminhamentoDenuncia** (TB_TP_SITUACAO_ENCAMINHAMENTO_DENUNCIA) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **TipoSolicitacaoRecursoImpugnacao** (TB_TP_SOLICITACAO_RECURSO_IMPUGNACAO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **Uf** (TB_UF) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 0
- **UfCalendario** (TB_CAU_UF_CALENDARIO) - BAIXA - 7 PF
  - Campos: 2
  - Relacionamentos: 1
- **Usuario** (tb_usuarios) - MEDIA - 10 PF
  - Campos: 7
  - Relacionamentos: 2
- **UsuarioPermissao** (tb_usuarios_permissoes) - MEDIA - 10 PF
  - Campos: 1
  - Relacionamentos: 2

## 2. INTERFACES EXTERNAS (AIE)

### Resumo AIE:
- **Total**: 4
- **Baixa Complexidade**: 1 (5 PF)
- **Média Complexidade**: 2 (14 PF)
- **Alta Complexidade**: 1 (10 PF)
- **Total PF AIE**: 29

### Interfaces Identificadas:
- **Sistema CAU Nacional** - API - MEDIA - 7 PF
- **TRE - Tribunal Regional Eleitoral** - Export/Import - ALTA - 10 PF
- **Sistema de Email** - Serviço - BAIXA - 5 PF
- **Sistema de Documentos** - Arquivo - MEDIA - 7 PF

## 3. CONTROLLERS E FUNCIONALIDADES

### Resumo Controllers:
- **Total de Controllers**: 66

### Agrupamento por Módulo:
- **Outros**: 9 controllers
    - AlegacaoFinalController
    - ArquivoController
    - ArtisanController
    - AuthController
    - DiplomaEleitoralController
    - FilialController
    - ParecerFinalController
    - TermoDePosseController
    - TipoFinalizacaoMandatoController
- **Sistema de Impugnações**: 11 controllers
    - AlegacaoImpugnacaoResultadoController
    - ContrarrazaoRecursoImpugnacaoController
    - ContrarrazaoRecursoImpugnacaoResultadoController
    - DefesaImpugnacaoController
    - ImpugnacaoResultadoController
    - JulgamentoImpugnacaoController
    - JulgamentoRecursoImpugnacaoController
    - PedidoImpugnacaoController
    - RecursoImpugnacaoController
    - RecursoImpugnacaoResultadoController
    - SubstituicaoImpugnacaoController
- **Gestão de Calendário Eleitoral**: 3 controllers
    - AtividadePrincipalCalendarioController
    - AtividadeSecundariaCalendarioController
    - CalendarioController
- **Sistema de Notificações**: 3 controllers
    - CabecalhoEmailController
    - CorpoEmailController
    - EmailAtividadeSecundariaController
- **Gestão de Chapas**: 6 controllers
    - ChapaEleicaoController
    - DenunciaChapaController
    - DenunciaMembroChapaController
    - MembroChapaController
    - PedidoSubstituicaoChapaController
    - SubstituicaoChapaEleicaoController
- **Gestão de Conselheiros**: 3 controllers
    - ConselheiroController
    - HistoricoExtratoConselheiroController
    - ParametroConselheiroController
- **Sistema de Denúncias**: 10 controllers
    - ContrarrazaoRecursoDenunciaController
    - DenunciaAdmitidaController
    - DenunciaAudienciaInstrucaoController
    - DenunciaController
    - DenunciaDefesaController
    - DenunciaMembroComissaoController
    - DenunciaProvasController
    - EncaminhamentoDenunciaController
    - JulgamentoDenunciaController
    - JulgamentoRecursoDenunciaController
- **Gestão de Membros**: 3 controllers
    - DocumentoComissaoMembroController
    - InformacaoComissaoMembroController
    - MembroComissaoController
- **Gestão de Documentos**: 2 controllers
    - DocumentoEleicaoController
    - PublicacaoDocumentoController
- **Sistema de Julgamentos**: 14 controllers
    - JulgamentoAdmissibilidadeController
    - JulgamentoAlegacaoImpugResultadoController
    - JulgamentoFinalController
    - JulgamentoRecursoAdmissibilidadeController
    - JulgamentoRecursoImpugResultadoController
    - JulgamentoRecursoPedidoSubstituicaoController
    - JulgamentoRecursoSubstituicaoController
    - JulgamentoSegundaInstanciaRecursoController
    - JulgamentoSegundaInstanciaSubstituicaoController
    - JulgamentoSubstituicaoController
    - RecursoJulgamentoAdmissibilidadeController
    - RecursoJulgamentoFinalController
    - RecursoSegundoJulgamentoSubstituicaoController
    - SubstituicaoJulgamentoFinalController
- **Gestão de Profissionais**: 1 controllers
    - ProfissionalController
- **Sistema de Recursos**: 1 controllers
    - RecursoSubstituicaoController

## 4. ENTRADAS, SAÍDAS E CONSULTAS EXTERNAS

### Entradas Externas (EE):
- **Total**: 32
- **Total PF EE**: 96

### Saídas Externas (SE):
- **Total**: 52
- **Total PF SE**: 208

### Consultas Externas (CE):
- **Total**: 233
- **Total PF CE**: 699

## 5. BUSINESS OBJECTS (CAMADA DE NEGÓCIO)

### Resumo Business Objects:
- **Total**: 97

### Business Objects por Complexidade:
- **BAIXA**: 46 objects
- **ALTA**: 26 objects
- **MEDIA**: 25 objects

## 6. REPOSITORIES (PADRÃO DE ACESSO A DADOS)

### Resumo Repositories:
- **Total**: 165
- **Padrão**: Data Access Object (DAO)

### Repositories Identificados:
- AgendamentoEncaminhamentoDenunciaRepository
- AlegacaoFinalRepository
- AlegacaoImpugnacaoResultadoRepository
- ArquivoAlegacaoFinalRepository
- ArquivoCalendarioRepository
- ArquivoDecMembroComissaoRepository
- ArquivoDefesaImpugnacaoRepository
- ArquivoDenunciaAdmissibilidadeRepository
- ArquivoDenunciaAdmitidaRepository
- ArquivoDenunciaAudienciaInstrucaoRepository

... e mais 155 repositories

## 7. MODELS/ENTITIES ADICIONAIS

### Models Eloquent:
- **Total**: 22

## 8. RESUMO FINAL APF

### Contagem de Pontos de Função:

| Tipo | Baixa | Média | Alta | Total | PF Total |
|------|-------|-------|------|-------|----------|
| ALI  | 84 | 76 | 17 | 177 | 1603 |
| AIE  | 1 | 2 | 1 | 4 | 29 |
| EE   | 32 | 0 | 0 | 32 | 96 |
| SE   | 52 | 0 | 0 | 52 | 208 |
| CE   | 233 | 0 | 0 | 233 | 699 |

### **TOTAL DE PONTOS DE FUNÇÃO: 2635 PF**

## 9. OBSERVAÇÕES

### Tecnologias Identificadas:
- **Framework**: Laravel/Lumen
- **ORM**: Doctrine
- **Arquitetura**: MVC com camada de Business Objects
- **Padrão de Acesso**: Repository Pattern
- **Sistema de Filas**: Laravel Jobs
- **Sistema de Email**: Laravel Mail

### Módulos Funcionais Principais:
1. **Gestão de Calendário Eleitoral**
2. **Sistema de Chapas**
3. **Sistema de Denúncias e Defesas**
4. **Sistema de Impugnações**
5. **Sistema de Julgamentos (1ª e 2ª Instância)**
6. **Sistema de Recursos**
7. **Gestão de Membros e Comissões**
8. **Sistema de Documentos e Relatórios**
9. **Sistema de Notificações por Email**
10. **Gestão de Profissionais e Conselheiros**

---
*Análise gerada automaticamente para fins de migração PHP → .NET*
        