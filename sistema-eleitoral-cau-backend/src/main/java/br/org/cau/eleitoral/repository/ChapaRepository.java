package br.org.cau.eleitoral.repository;

import br.org.cau.eleitoral.entity.Chapa;
import br.org.cau.eleitoral.entity.Chapa.StatusChapa;
import br.org.cau.eleitoral.entity.Eleicao;
import br.org.cau.eleitoral.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapaRepository extends JpaRepository<Chapa, Long> {

    List<Chapa> findByEleicao(Eleicao eleicao);

    List<Chapa> findByStatus(StatusChapa status);

    List<Chapa> findByResponsavel(Usuario responsavel);

    Optional<Chapa> findByNumero(String numero);

    List<Chapa> findByEleicaoAndStatus(Eleicao eleicao, StatusChapa status);

    Page<Chapa> findByEleicaoAndStatus(Eleicao eleicao, StatusChapa status, Pageable pageable);

    @Query("SELECT c FROM Chapa c WHERE c.eleicao.id = :eleicaoId AND c.status = :status")
    List<Chapa> findByEleicaoIdAndStatus(@Param("eleicaoId") Long eleicaoId, @Param("status") StatusChapa status);

    @Query("SELECT c FROM Chapa c WHERE c.nome LIKE %:nome% AND c.eleicao = :eleicao")
    List<Chapa> findByNomeContainingAndEleicao(@Param("nome") String nome, @Param("eleicao") Eleicao eleicao);

    @Query("SELECT c FROM Chapa c WHERE c.responsavel.id = :responsavelId")
    List<Chapa> findByResponsavelId(@Param("responsavelId") Long responsavelId);

    @Query("SELECT COUNT(c) FROM Chapa c WHERE c.eleicao = :eleicao AND c.status = :status")
    Long countByEleicaoAndStatus(@Param("eleicao") Eleicao eleicao, @Param("status") StatusChapa status);

    @Query("SELECT c FROM Chapa c WHERE c.eleicao = :eleicao ORDER BY c.totalVotos DESC")
    List<Chapa> findByEleicaoOrderByTotalVotosDesc(@Param("eleicao") Eleicao eleicao);

    @Query("SELECT c FROM Chapa c JOIN c.membros m WHERE m.usuario.id = :usuarioId")
    List<Chapa> findChapasByMembroUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT c FROM Chapa c WHERE c.eleicao.uf = :uf AND c.status = :status")
    List<Chapa> findByUfAndStatus(@Param("uf") String uf, @Param("status") StatusChapa status);

    Boolean existsByNumeroAndEleicao(String numero, Eleicao eleicao);
}