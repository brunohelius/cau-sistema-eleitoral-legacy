package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_voto")
@EntityListeners(AuditingEntityListener.class)
public class Voto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleicao_id")
    @NotNull
    private Eleicao eleicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleitor_id")
    @NotNull
    private Eleitor eleitor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapa_id")
    private Chapa chapa;

    @Enumerated(EnumType.STRING)
    private TipoVoto tipoVoto;

    @Column(name = "hash_voto", unique = true)
    private String hashVoto;

    private String ipAddress;

    private String userAgent;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Voto() {}

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

    public Eleitor getEleitor() {
        return eleitor;
    }

    public void setEleitor(Eleitor eleitor) {
        this.eleitor = eleitor;
    }

    public Chapa getChapa() {
        return chapa;
    }

    public void setChapa(Chapa chapa) {
        this.chapa = chapa;
    }

    public TipoVoto getTipoVoto() {
        return tipoVoto;
    }

    public void setTipoVoto(TipoVoto tipoVoto) {
        this.tipoVoto = tipoVoto;
    }

    public String getHashVoto() {
        return hashVoto;
    }

    public void setHashVoto(String hashVoto) {
        this.hashVoto = hashVoto;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
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
        Voto voto = (Voto) obj;
        return id != null && id.equals(voto.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum TipoVoto {
        VALIDO,
        BRANCO,
        NULO,
        ABSTENCAO
    }
}