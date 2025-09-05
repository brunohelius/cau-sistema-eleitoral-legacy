package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_eleicao")
@EntityListeners(AuditingEntityListener.class)
public class Eleicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String titulo;

    @Lob
    private String descricao;

    @NotNull
    private LocalDate dataInicio;

    @NotNull
    private LocalDate dataFim;

    @NotNull
    private LocalTime horaInicio;

    @NotNull
    private LocalTime horaFim;

    @Column(length = 2)
    private String uf;

    @Enumerated(EnumType.STRING)
    private TipoEleicao tipo;

    @Enumerated(EnumType.STRING)
    private StatusEleicao status = StatusEleicao.PREPARACAO;

    private Integer totalEleitores = 0;

    private Integer totalVotos = 0;

    private Integer totalAbstencoes = 0;

    private Integer totalVotosBrancos = 0;

    private Integer totalVotosNulos = 0;

    private Boolean resultadoPublicado = false;

    private LocalDateTime dataPublicacaoResultado;

    @OneToMany(mappedBy = "eleicao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chapa> chapas = new ArrayList<>();

    @OneToMany(mappedBy = "eleicao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Voto> votos = new ArrayList<>();

    @OneToMany(mappedBy = "eleicao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Eleitor> eleitores = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Eleicao() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public TipoEleicao getTipo() {
        return tipo;
    }

    public void setTipo(TipoEleicao tipo) {
        this.tipo = tipo;
    }

    public StatusEleicao getStatus() {
        return status;
    }

    public void setStatus(StatusEleicao status) {
        this.status = status;
    }

    public Integer getTotalEleitores() {
        return totalEleitores;
    }

    public void setTotalEleitores(Integer totalEleitores) {
        this.totalEleitores = totalEleitores;
    }

    public Integer getTotalVotos() {
        return totalVotos;
    }

    public void setTotalVotos(Integer totalVotos) {
        this.totalVotos = totalVotos;
    }

    public Integer getTotalAbstencoes() {
        return totalAbstencoes;
    }

    public void setTotalAbstencoes(Integer totalAbstencoes) {
        this.totalAbstencoes = totalAbstencoes;
    }

    public Integer getTotalVotosBrancos() {
        return totalVotosBrancos;
    }

    public void setTotalVotosBrancos(Integer totalVotosBrancos) {
        this.totalVotosBrancos = totalVotosBrancos;
    }

    public Integer getTotalVotosNulos() {
        return totalVotosNulos;
    }

    public void setTotalVotosNulos(Integer totalVotosNulos) {
        this.totalVotosNulos = totalVotosNulos;
    }

    public Boolean getResultadoPublicado() {
        return resultadoPublicado;
    }

    public void setResultadoPublicado(Boolean resultadoPublicado) {
        this.resultadoPublicado = resultadoPublicado;
    }

    public LocalDateTime getDataPublicacaoResultado() {
        return dataPublicacaoResultado;
    }

    public void setDataPublicacaoResultado(LocalDateTime dataPublicacaoResultado) {
        this.dataPublicacaoResultado = dataPublicacaoResultado;
    }

    public List<Chapa> getChapas() {
        return chapas;
    }

    public void setChapas(List<Chapa> chapas) {
        this.chapas = chapas;
    }

    public List<Voto> getVotos() {
        return votos;
    }

    public void setVotos(List<Voto> votos) {
        this.votos = votos;
    }

    public List<Eleitor> getEleitores() {
        return eleitores;
    }

    public void setEleitores(List<Eleitor> eleitores) {
        this.eleitores = eleitores;
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
        Eleicao eleicao = (Eleicao) obj;
        return id != null && id.equals(eleicao.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum TipoEleicao {
        CONSELHEIROS_FEDERAIS,
        CONSELHEIROS_ESTADUAIS,
        REPRESENTANTES_CAU_BR,
        COMISSAO_ELEITORAL
    }

    public enum StatusEleicao {
        PREPARACAO,
        INSCRICOES_ABERTAS,
        VALIDACAO_CHAPAS,
        EM_ANDAMENTO,
        FINALIZADA,
        CANCELADA
    }
}