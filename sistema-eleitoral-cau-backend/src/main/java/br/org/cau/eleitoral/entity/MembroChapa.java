package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_membro_chapa")
@EntityListeners(AuditingEntityListener.class)
public class MembroChapa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapa_id")
    @NotNull
    private Chapa chapa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @NotNull
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private TipoMembro tipoMembro;

    @Enumerated(EnumType.STRING)
    private StatusMembro status = StatusMembro.PENDENTE;

    private Boolean titular = true;

    private Integer ordem;

    private String observacoes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MembroChapa() {}

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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public TipoMembro getTipoMembro() {
        return tipoMembro;
    }

    public void setTipoMembro(TipoMembro tipoMembro) {
        this.tipoMembro = tipoMembro;
    }

    public StatusMembro getStatus() {
        return status;
    }

    public void setStatus(StatusMembro status) {
        this.status = status;
    }

    public Boolean getTitular() {
        return titular;
    }

    public void setTitular(Boolean titular) {
        this.titular = titular;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
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
        MembroChapa membro = (MembroChapa) obj;
        return id != null && id.equals(membro.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum TipoMembro {
        PRESIDENTE,
        VICE_PRESIDENTE,
        CONSELHEIRO_TITULAR,
        CONSELHEIRO_SUPLENTE,
        REPRESENTANTE_TITULAR,
        REPRESENTANTE_SUPLENTE
    }

    public enum StatusMembro {
        PENDENTE,
        CONFIRMADO,
        REJEITADO,
        SUBSTITUIDO
    }
}