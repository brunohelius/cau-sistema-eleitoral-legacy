package br.org.cau.eleitoral.controller;

import br.org.cau.eleitoral.entity.Eleicao;
import br.org.cau.eleitoral.entity.Eleicao.StatusEleicao;
import br.org.cau.eleitoral.entity.Eleicao.TipoEleicao;
import br.org.cau.eleitoral.service.EleicaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/eleicoes")
@Tag(name = "Eleições", description = "Gerenciamento de eleições")
public class EleicaoController {

    @Autowired
    private EleicaoService eleicaoService;

    @GetMapping
    @Operation(summary = "Listar todas as eleições")
    public ResponseEntity<List<Eleicao>> getAllEleicoes() {
        List<Eleicao> eleicoes = eleicaoService.findAll();
        return ResponseEntity.ok(eleicoes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar eleição por ID")
    public ResponseEntity<Eleicao> getEleicaoById(@PathVariable Long id) {
        return eleicaoService.findById(id)
                .map(eleicao -> ResponseEntity.ok().body(eleicao))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar eleições por status")
    public ResponseEntity<List<Eleicao>> getEleicoesByStatus(@PathVariable StatusEleicao status) {
        List<Eleicao> eleicoes = eleicaoService.findByStatus(status);
        return ResponseEntity.ok(eleicoes);
    }

    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Listar eleições por tipo")
    public ResponseEntity<List<Eleicao>> getEleicoesByTipo(@PathVariable TipoEleicao tipo) {
        List<Eleicao> eleicoes = eleicaoService.findByTipo(tipo);
        return ResponseEntity.ok(eleicoes);
    }

    @GetMapping("/uf/{uf}")
    @Operation(summary = "Listar eleições por UF")
    public ResponseEntity<List<Eleicao>> getEleicoesByUf(@PathVariable String uf) {
        List<Eleicao> eleicoes = eleicaoService.findByUf(uf);
        return ResponseEntity.ok(eleicoes);
    }

    @GetMapping("/em-andamento/{uf}")
    @Operation(summary = "Buscar eleição em andamento por UF")
    public ResponseEntity<Eleicao> getEleicaoEmAndamentoByUf(@PathVariable String uf) {
        return eleicaoService.findEleicaoEmAndamentoByUf(uf)
                .map(eleicao -> ResponseEntity.ok().body(eleicao))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/resultados-publicados")
    @Operation(summary = "Listar eleições com resultados publicados")
    public ResponseEntity<List<Eleicao>> getEleicaoComResultadoPublicado() {
        List<Eleicao> eleicoes = eleicaoService.findEleicaoComResultadoPublicado();
        return ResponseEntity.ok(eleicoes);
    }

    @GetMapping("/paginadas")
    @Operation(summary = "Listar eleições paginadas por status e tipo")
    public ResponseEntity<Page<Eleicao>> getEleicoesPaginadas(
            @RequestParam StatusEleicao status,
            @RequestParam TipoEleicao tipo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Eleicao> eleicoes = eleicaoService.findByStatusAndTipo(status, tipo, pageable);
        return ResponseEntity.ok(eleicoes);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Criar nova eleição")
    public ResponseEntity<Eleicao> createEleicao(@Valid @RequestBody Eleicao eleicao) {
        try {
            Eleicao novaEleicao = eleicaoService.create(eleicao);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaEleicao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Atualizar eleição")
    public ResponseEntity<Eleicao> updateEleicao(@PathVariable Long id, @Valid @RequestBody Eleicao eleicao) {
        try {
            Eleicao eleicaoAtualizada = eleicaoService.update(id, eleicao);
            return ResponseEntity.ok(eleicaoAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir eleição")
    public ResponseEntity<?> deleteEleicao(@PathVariable Long id) {
        try {
            eleicaoService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Eleição excluída com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erro ao excluir eleição: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/iniciar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Iniciar eleição")
    public ResponseEntity<Eleicao> iniciarEleicao(@PathVariable Long id) {
        try {
            Eleicao eleicao = eleicaoService.iniciarEleicao(id);
            return ResponseEntity.ok(eleicao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/finalizar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Finalizar eleição")
    public ResponseEntity<Eleicao> finalizarEleicao(@PathVariable Long id) {
        try {
            Eleicao eleicao = eleicaoService.finalizarEleicao(id);
            return ResponseEntity.ok(eleicao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/publicar-resultado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Publicar resultado da eleição")
    public ResponseEntity<Eleicao> publicarResultado(@PathVariable Long id) {
        try {
            Eleicao eleicao = eleicaoService.publicarResultado(id);
            return ResponseEntity.ok(eleicao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/abrir-inscricoes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Abrir inscrições para eleição")
    public ResponseEntity<Eleicao> abrirInscricoes(@PathVariable Long id) {
        try {
            Eleicao eleicao = eleicaoService.abrirInscricoes(id);
            return ResponseEntity.ok(eleicao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/iniciar-validacao")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMISSAO_ELEITORAL')")
    @Operation(summary = "Iniciar validação de chapas")
    public ResponseEntity<Eleicao> iniciarValidacaoChapas(@PathVariable Long id) {
        try {
            Eleicao eleicao = eleicaoService.iniciarValidacaoChapas(id);
            return ResponseEntity.ok(eleicao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}