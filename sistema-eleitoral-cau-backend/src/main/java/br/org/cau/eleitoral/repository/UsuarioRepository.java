package br.org.cau.eleitoral.repository;

import br.org.cau.eleitoral.entity.Usuario;
import br.org.cau.eleitoral.entity.Usuario.StatusUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByNumeroConselho(String numeroConselho);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByCpf(String cpf);

    Boolean existsByNumeroConselho(String numeroConselho);

    List<Usuario> findByStatus(StatusUsuario status);

    List<Usuario> findByUf(String uf);

    Page<Usuario> findByStatusAndUf(StatusUsuario status, String uf, Pageable pageable);

    @Query("SELECT u FROM Usuario u WHERE u.nomeCompleto LIKE %:nome% AND u.status = :status")
    List<Usuario> findByNomeCompletoContainingAndStatus(@Param("nome") String nome, @Param("status") StatusUsuario status);

    @Query("SELECT u FROM Usuario u WHERE u.email LIKE %:email% OR u.username LIKE %:username%")
    List<Usuario> findByEmailOrUsernameContaining(@Param("email") String email, @Param("username") String username);

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.status = :status")
    Long countByStatus(@Param("status") StatusUsuario status);

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.uf = :uf AND u.status = :status")
    Long countByUfAndStatus(@Param("uf") String uf, @Param("status") StatusUsuario status);
}