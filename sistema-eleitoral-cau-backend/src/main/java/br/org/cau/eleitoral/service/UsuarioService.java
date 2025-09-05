package br.org.cau.eleitoral.service;

import br.org.cau.eleitoral.entity.Role;
import br.org.cau.eleitoral.entity.Usuario;
import br.org.cau.eleitoral.entity.Usuario.StatusUsuario;
import br.org.cau.eleitoral.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> findByCpf(String cpf) {
        return usuarioRepository.findByCpf(cpf);
    }

    public Optional<Usuario> findByNumeroConselho(String numeroConselho) {
        return usuarioRepository.findByNumeroConselho(numeroConselho);
    }

    public Page<Usuario> findByStatusAndUf(StatusUsuario status, String uf, Pageable pageable) {
        return usuarioRepository.findByStatusAndUf(status, uf, pageable);
    }

    public List<Usuario> findByNomeCompletoContainingAndStatus(String nome, StatusUsuario status) {
        return usuarioRepository.findByNomeCompletoContainingAndStatus(nome, status);
    }

    public Usuario save(Usuario usuario) {
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario create(Usuario usuario, Set<Role> roles) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRoles(roles);
        usuario.setStatus(StatusUsuario.ATIVO);
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNomeCompleto(usuarioAtualizado.getNomeCompleto());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setCpf(usuarioAtualizado.getCpf());
                    usuario.setNumeroConselho(usuarioAtualizado.getNumeroConselho());
                    usuario.setUf(usuarioAtualizado.getUf());
                    usuario.setTelefone(usuarioAtualizado.getTelefone());
                    
                    if (usuarioAtualizado.getPassword() != null && !usuarioAtualizado.getPassword().isEmpty()) {
                        usuario.setPassword(passwordEncoder.encode(usuarioAtualizado.getPassword()));
                    }
                    
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
    }

    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    public void ativar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        usuario.setStatus(StatusUsuario.ATIVO);
        usuarioRepository.save(usuario);
    }

    public void inativar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        usuario.setStatus(StatusUsuario.INATIVO);
        usuarioRepository.save(usuario);
    }

    public void suspender(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        usuario.setStatus(StatusUsuario.SUSPENSO);
        usuarioRepository.save(usuario);
    }

    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public boolean existsByCpf(String cpf) {
        return usuarioRepository.existsByCpf(cpf);
    }

    public boolean existsByNumeroConselho(String numeroConselho) {
        return usuarioRepository.existsByNumeroConselho(numeroConselho);
    }

    public Long countByStatus(StatusUsuario status) {
        return usuarioRepository.countByStatus(status);
    }

    public Long countByUfAndStatus(String uf, StatusUsuario status) {
        return usuarioRepository.countByUfAndStatus(uf, status);
    }
}