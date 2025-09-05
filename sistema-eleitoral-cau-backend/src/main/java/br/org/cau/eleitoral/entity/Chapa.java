package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_chapa")
@EntityListeners(AuditingEntityListener.class)
public class Chapa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @NotBlank
    @Size(max = 10)
    @Column(unique = true)
    private String numero;

    @Lob
    private String plataformaEleitoral;

    @Enumerated(EnumType.STRING)
    private StatusChapa status = StatusChapa.EM_FORMACAO;

    private Integer totalVotos = 0;

    private Double percentualVotos = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleicao_id")
    @NotNull
    private Eleicao eleicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @OneToMany(mappedBy = "chapa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MembroChapa> membros = new ArrayList<>();

    @OneToMany(mappedBy = "chapa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Voto> votos = new ArrayList<>();

    @OneToMany(mappedBy = "chapa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DocumentoChapa> documentos = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Chapa() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getPlataformaEleitoral() {
        return plataformaEleitoral;
    }

    public void setPlataformaEleitoral(String plataformaEleitoral) {
        this.plataformaEleitoral = plataformaEleitoral;
    }

    public StatusChapa getStatus() {
        return status;
    }

    public void setStatus(StatusChapa status) {
        this.status = status;
    }

    public Integer getTotalVotos() {
        return totalVotos;
    }

    public void setTotalVotos(Integer totalVotos) {
        this.totalVotos = totalVotos;
    }

    public Double getPercentualVotos() {
        return percentualVotos;
    }

    public void setPercentualVotos(Double percentualVotos) {
        this.percentualVotos = percentualVotos;
    }

    public Eleicao getEleicao() {
        return eleicao;
    }

    public void setEleicao(Eleicao eleicao) {
        this.eleicao = eleicao;
    }

    public Usuario getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(Usuario responsavel) {
        this.responsavel = responsavel;
    }

    public List<MembroChapa> getMembros() {
        return membros;
    }

    public void setMembros(List<MembroChapa> membros) {
        this.membros = membros;
    }

    public List<Voto> getVotos() {
        return votos;
    }

    public void setVotos(List<Voto> votos) {
        this.votos = votos;
    }

    public List<DocumentoChapa> getDocumentos() {
        return documentos;
    }

    public void setDocumentos(List<DocumentoChapa> documentos) {
        this.documentos = documentos;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Chapa chapa = (Chapa) obj;
        return id != null && id.equals(chapa.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum StatusChapa {
        EM_FORMACAO,
        INSCRITA,
        VALIDADA,
        REJEITADA,
        CANCELADA
    }
}