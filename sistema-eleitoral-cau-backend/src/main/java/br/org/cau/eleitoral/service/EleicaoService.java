package br.org.cau.eleitoral.service;

import br.org.cau.eleitoral.entity.Eleicao;
import br.org.cau.eleitoral.entity.Eleicao.StatusEleicao;
import br.org.cau.eleitoral.entity.Eleicao.TipoEleicao;
import br.org.cau.eleitoral.repository.EleicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EleicaoService {

    @Autowired
    private EleicaoRepository eleicaoRepository;

    public List<Eleicao> findAll() {
        return eleicaoRepository.findAll();
    }

    public Optional<Eleicao> findById(Long id) {
        return eleicaoRepository.findById(id);
    }

    public List<Eleicao> findByStatus(StatusEleicao status) {
        return eleicaoRepository.findByStatus(status);
    }

    public List<Eleicao> findByTipo(TipoEleicao tipo) {
        return eleicaoRepository.findByTipo(tipo);
    }

    public List<Eleicao> findByUf(String uf) {
        return eleicaoRepository.findByUf(uf);
    }

    public Optional<Eleicao> findEleicaoEmAndamentoByUf(String uf) {
        return eleicaoRepository.findEleicaoEmAndamentoByUf(uf);
    }

    public Page<Eleicao> findByStatusAndTipo(StatusEleicao status, TipoEleicao tipo, Pageable pageable) {
        return eleicaoRepository.findByStatusAndTipo(status, tipo, pageable);
    }

    public List<Eleicao> findEleicaoByData(LocalDate data) {
        return eleicaoRepository.findEleicaoByData(data);
    }

    public List<Eleicao> findEleicaoComResultadoPublicado() {
        return eleicaoRepository.findEleicaoComResultadoPublicado();
    }

    public Eleicao save(Eleicao eleicao) {
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao create(Eleicao eleicao) {
        eleicao.setStatus(StatusEleicao.PREPARACAO);
        eleicao.setResultadoPublicado(false);
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao update(Long id, Eleicao eleicaoAtualizada) {
        return eleicaoRepository.findById(id)
                .map(eleicao -> {
                    eleicao.setTitulo(eleicaoAtualizada.getTitulo());
                    eleicao.setDescricao(eleicaoAtualizada.getDescricao());
                    eleicao.setDataInicio(eleicaoAtualizada.getDataInicio());
                    eleicao.setDataFim(eleicaoAtualizada.getDataFim());
                    eleicao.setHoraInicio(eleicaoAtualizada.getHoraInicio());
                    eleicao.setHoraFim(eleicaoAtualizada.getHoraFim());
                    eleicao.setUf(eleicaoAtualizada.getUf());
                    eleicao.setTipo(eleicaoAtualizada.getTipo());
                    
                    return eleicaoRepository.save(eleicao);
                })
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
    }

    public void delete(Long id) {
        eleicaoRepository.deleteById(id);
    }

    public Eleicao iniciarEleicao(Long id) {
        Eleicao eleicao = eleicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
        
        if (eleicao.getStatus() != StatusEleicao.VALIDACAO_CHAPAS) {
            throw new RuntimeException("Eleição deve estar em status de Validação de Chapas para ser iniciada");
        }
        
        eleicao.setStatus(StatusEleicao.EM_ANDAMENTO);
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao finalizarEleicao(Long id) {
        Eleicao eleicao = eleicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
        
        if (eleicao.getStatus() != StatusEleicao.EM_ANDAMENTO) {
            throw new RuntimeException("Apenas eleições em andamento podem ser finalizadas");
        }
        
        eleicao.setStatus(StatusEleicao.FINALIZADA);
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao publicarResultado(Long id) {
        Eleicao eleicao = eleicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
        
        if (eleicao.getStatus() != StatusEleicao.FINALIZADA) {
            throw new RuntimeException("Apenas eleições finalizadas podem ter resultado publicado");
        }
        
        eleicao.setResultadoPublicado(true);
        eleicao.setDataPublicacaoResultado(LocalDateTime.now());
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao abrirInscricoes(Long id) {
        Eleicao eleicao = eleicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
        
        if (eleicao.getStatus() != StatusEleicao.PREPARACAO) {
            throw new RuntimeException("Eleição deve estar em preparação para abrir inscrições");
        }
        
        eleicao.setStatus(StatusEleicao.INSCRICOES_ABERTAS);
        return eleicaoRepository.save(eleicao);
    }

    public Eleicao iniciarValidacaoChapas(Long id) {
        Eleicao eleicao = eleicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eleição não encontrada com id: " + id));
        
        if (eleicao.getStatus() != StatusEleicao.INSCRICOES_ABERTAS) {
            throw new RuntimeException("Eleição deve estar com inscrições abertas para iniciar validação");
        }
        
        eleicao.setStatus(StatusEleicao.VALIDACAO_CHAPAS);
        return eleicaoRepository.save(eleicao);
    }

    public Long countByStatus(StatusEleicao status) {
        return eleicaoRepository.countByStatus(status);
    }

    public Long countByUfAndStatus(String uf, StatusEleicao status) {
        return eleicaoRepository.countByUfAndStatus(uf, status);
    }
}