package br.org.cau.eleitoral.repository;

import br.org.cau.eleitoral.entity.Chapa;
import br.org.cau.eleitoral.entity.Eleicao;
import br.org.cau.eleitoral.entity.Eleitor;
import br.org.cau.eleitoral.entity.Voto;
import br.org.cau.eleitoral.entity.Voto.TipoVoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {

    List<Voto> findByEleicao(Eleicao eleicao);

    List<Voto> findByChapa(Chapa chapa);

    List<Voto> findByEleitor(Eleitor eleitor);

    Optional<Voto> findByEleitorAndEleicao(Eleitor eleitor, Eleicao eleicao);

    List<Voto> findByTipoVoto(TipoVoto tipoVoto);

    @Query("SELECT COUNT(v) FROM Voto v WHERE v.eleicao = :eleicao AND v.tipoVoto = :tipoVoto")
    Long countByEleicaoAndTipoVoto(@Param("eleicao") Eleicao eleicao, @Param("tipoVoto") TipoVoto tipoVoto);

    @Query("SELECT COUNT(v) FROM Voto v WHERE v.chapa = :chapa")
    Long countByChapa(@Param("chapa") Chapa chapa);

    @Query("SELECT v FROM Voto v WHERE v.eleicao = :eleicao AND v.createdAt BETWEEN :inicio AND :fim")
    List<Voto> findVotosByPeriodo(@Param("eleicao") Eleicao eleicao, 
                                  @Param("inicio") LocalDateTime inicio, 
                                  @Param("fim") LocalDateTime fim);

    @Query("SELECT v.chapa.id, COUNT(v) FROM Voto v WHERE v.eleicao = :eleicao AND v.tipoVoto = 'VALIDO' GROUP BY v.chapa.id ORDER BY COUNT(v) DESC")
    List<Object[]> findResultadoByEleicao(@Param("eleicao") Eleicao eleicao);

    Boolean existsByEleitorAndEleicao(Eleitor eleitor, Eleicao eleicao);

    @Query("SELECT COUNT(v) FROM Voto v WHERE v.eleicao = :eleicao")
    Long countTotalVotosByEleicao(@Param("eleicao") Eleicao eleicao);

    @Query("SELECT v FROM Voto v WHERE v.hashVoto = :hash")
    Optional<Voto> findByHashVoto(@Param("hash") String hash);
}