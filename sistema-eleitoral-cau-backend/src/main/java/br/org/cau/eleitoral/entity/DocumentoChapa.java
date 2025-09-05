package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_documento_chapa")
@EntityListeners(AuditingEntityListener.class)
public class DocumentoChapa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapa_id")
    @NotNull
    private Chapa chapa;

    @NotBlank
    @Size(max = 200)
    private String nomeArquivo;

    @NotBlank
    @Size(max = 500)
    private String caminhoArquivo;

    @Size(max = 100)
    private String tipoArquivo;

    private Long tamanhoArquivo;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @Enumerated(EnumType.STRING)
    private StatusDocumento status = StatusDocumento.PENDENTE;

    private String observacoes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DocumentoChapa() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chapa getChapa() {
        return chapa;
    }

    public void setChapa(Chapa chapa) {
        this.chapa = chapa;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getCaminhoArquivo() {
        return caminhoArquivo;
    }

    public void setCaminhoArquivo(String caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
    }

    public String getTipoArquivo() {
        return tipoArquivo;
    }

    public void setTipoArquivo(String tipoArquivo) {
        this.tipoArquivo = tipoArquivo;
    }

    public Long getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    public void setTamanhoArquivo(Long tamanhoArquivo) {
        this.tamanhoArquivo = tamanhoArquivo;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public StatusDocumento getStatus() {
        return status;
    }

    public void setStatus(StatusDocumento status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        DocumentoChapa documento = (DocumentoChapa) obj;
        return id != null && id.equals(documento.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum TipoDocumento {
        PLATAFORMA_ELEITORAL,
        DOCUMENTACAO_MEMBRO,
        COMPROVANTE_QUITACAO,
        ATA_CONSTITUICAO,
        PROCURACAO,
        OUTROS
    }

    public enum StatusDocumento {
        PENDENTE,
        APROVADO,
        REJEITADO
    }
}