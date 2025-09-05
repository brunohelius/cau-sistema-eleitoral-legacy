package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_eleitor")
@EntityListeners(AuditingEntityListener.class)
public class Eleitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleicao_id")
    @NotNull
    private Eleicao eleicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @NotNull
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private StatusEleitor status = StatusEleitor.APTO;

    private Boolean jaVotou = false;

    private LocalDateTime dataUltimoAcesso;

    private String observacoes;

    @OneToMany(mappedBy = "eleitor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Voto> votos = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Eleitor() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Eleicao getEleicao() {
        return eleicao;
    }

    public void setEleicao(Eleicao eleicao) {
        this.eleicao = eleicao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public StatusEleitor getStatus() {
        return status;
    }

    public void setStatus(StatusEleitor status) {
        this.status = status;
    }

    public Boolean getJaVotou() {
        return jaVotou;
    }

    public void setJaVotou(Boolean jaVotou) {
        this.jaVotou = jaVotou;
    }

    public LocalDateTime getDataUltimoAcesso() {
        return dataUltimoAcesso;
    }

    public void setDataUltimoAcesso(LocalDateTime dataUltimoAcesso) {
        this.dataUltimoAcesso = dataUltimoAcesso;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public List<Voto> getVotos() {
        return votos;
    }

    public void setVotos(List<Voto> votos) {
        this.votos = votos;
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
        Eleitor eleitor = (Eleitor) obj;
        return id != null && id.equals(eleitor.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum StatusEleitor {
        APTO,
        INAPTO,
        SUSPENSO,
        IMPEDIDO
    }
}