package br.org.cau.eleitoral.controller;

import br.org.cau.eleitoral.entity.Role;
import br.org.cau.eleitoral.entity.Usuario;
import br.org.cau.eleitoral.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação e autorização")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/signin")
    @Operation(summary = "Fazer login", description = "Autentica usuário e retorna token JWT")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Aqui você implementaria a geração do JWT
            String jwt = "jwt-token-here"; // Implementar JwtUtils
            
            Usuario usuario = usuarioService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("id", usuario.getId());
            response.put("username", usuario.getUsername());
            response.put("email", usuario.getEmail());
            response.put("roles", usuario.getRoles());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciais inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/signup")
    @Operation(summary = "Criar conta", description = "Registra novo usuário no sistema")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (usuarioService.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Erro: Username já está em uso!"));
            }

            if (usuarioService.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Erro: Email já está em uso!"));
            }

            if (usuarioService.existsByCpf(signUpRequest.getCpf())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Erro: CPF já está cadastrado!"));
            }

            // Criar novo usuário
            Usuario usuario = new Usuario(signUpRequest.getUsername(),
                                         signUpRequest.getEmail(),
                                         signUpRequest.getPassword(),
                                         signUpRequest.getNomeCompleto());
            usuario.setCpf(signUpRequest.getCpf());
            usuario.setNumeroConselho(signUpRequest.getNumeroConselho());
            usuario.setUf(signUpRequest.getUf());
            usuario.setTelefone(signUpRequest.getTelefone());

            // Definir roles padrão - implementar lógica de roles
            Set<Role> roles = Set.of(); // Implementar lógica de roles

            usuarioService.create(usuario, roles);

            return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Erro ao registrar usuário: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Fazer logout", description = "Invalida token JWT do usuário")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso!"));
    }

    // DTOs
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String nomeCompleto;
        private String cpf;
        private String numeroConselho;
        private String uf;
        private String telefone;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getNomeCompleto() { return nomeCompleto; }
        public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
        
        public String getCpf() { return cpf; }
        public void setCpf(String cpf) { this.cpf = cpf; }
        
        public String getNumeroConselho() { return numeroConselho; }
        public void setNumeroConselho(String numeroConselho) { this.numeroConselho = numeroConselho; }
        
        public String getUf() { return uf; }
        public void setUf(String uf) { this.uf = uf; }
        
        public String getTelefone() { return telefone; }
        public void setTelefone(String telefone) { this.telefone = telefone; }
    }
}