package br.org.cau.eleitoral.repository;

import br.org.cau.eleitoral.entity.Eleicao;
import br.org.cau.eleitoral.entity.Eleicao.StatusEleicao;
import br.org.cau.eleitoral.entity.Eleicao.TipoEleicao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EleicaoRepository extends JpaRepository<Eleicao, Long> {

    List<Eleicao> findByStatus(StatusEleicao status);

    List<Eleicao> findByTipo(TipoEleicao tipo);

    List<Eleicao> findByUf(String uf);

    Optional<Eleicao> findByStatusAndUf(StatusEleicao status, String uf);

    Page<Eleicao> findByStatusAndTipo(StatusEleicao status, TipoEleicao tipo, Pageable pageable);

    @Query("SELECT e FROM Eleicao e WHERE e.dataInicio <= :data AND e.dataFim >= :data")
    List<Eleicao> findEleicaoByData(@Param("data") LocalDate data);

    @Query("SELECT e FROM Eleicao e WHERE e.status = :status AND e.dataInicio <= :hoje")
    List<Eleicao> findEleicaoAtivaByStatus(@Param("status") StatusEleicao status, @Param("hoje") LocalDate hoje);

    @Query("SELECT e FROM Eleicao e WHERE e.status = 'EM_ANDAMENTO' AND e.uf = :uf")
    Optional<Eleicao> findEleicaoEmAndamentoByUf(@Param("uf") String uf);

    @Query("SELECT e FROM Eleicao e WHERE e.titulo LIKE %:titulo%")
    List<Eleicao> findByTituloContaining(@Param("titulo") String titulo);

    @Query("SELECT COUNT(e) FROM Eleicao e WHERE e.status = :status")
    Long countByStatus(@Param("status") StatusEleicao status);

    @Query("SELECT COUNT(e) FROM Eleicao e WHERE e.uf = :uf AND e.status = :status")
    Long countByUfAndStatus(@Param("uf") String uf, @Param("status") StatusEleicao status);

    @Query("SELECT e FROM Eleicao e WHERE e.resultadoPublicado = true ORDER BY e.dataPublicacaoResultado DESC")
    List<Eleicao> findEleicaoComResultadoPublicado();
}