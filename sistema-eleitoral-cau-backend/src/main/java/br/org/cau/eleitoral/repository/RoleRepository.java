package br.org.cau.eleitoral.repository;

import br.org.cau.eleitoral.entity.Role;
import br.org.cau.eleitoral.entity.Role.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(ERole name);

    Boolean existsByName(ERole name);
}