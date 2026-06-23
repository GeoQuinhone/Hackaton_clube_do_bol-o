package com.bolao.controller.admin;

import com.bolao.dto.*;
import com.bolao.entity.Partida;
import com.bolao.repository.UserRepository;
import com.bolao.service.DashboardService;
import com.bolao.service.PartidaService;
import com.bolao.service.SelecaoService;
import com.bolao.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class AdminWebController {

    private final DashboardService dashboardService;
    private final PartidaService partidaService;
    private final SelecaoService selecaoService;
    private final UserService userService;
    private final UserRepository userRepository;

    // ===== LOGIN =====

    @GetMapping("/admin-login")
    public String loginPage(@RequestParam(required = false) String error,
                            @RequestParam(required = false) String logout,
                            Model model) {
        if (error != null) model.addAttribute("erro", "Email ou senha inválidos.");
        if (logout != null) model.addAttribute("msg", "Você saiu com sucesso.");
        return "admin/login";
    }

    // ===== DASHBOARD =====

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("stats", dashboardService.obterEstatisticas());
        model.addAttribute("partidasRecentes", partidaService.listarTodas(
                PageRequest.of(0, 5, Sort.by("dataHora").descending())).getContent());
        return "admin/dashboard";
    }

    // ===== PARTIDAS =====

    @GetMapping("/admin/partidas")
    public String listarPartidas(@RequestParam(required = false) String status, Model model) {
        if (status != null && !status.isBlank()) {
            model.addAttribute("partidas", partidaService.listarPorStatus(
                    Partida.StatusPartida.valueOf(status),
                    PageRequest.of(0, 100, Sort.by("dataHora").ascending())).getContent());
            model.addAttribute("filtroStatus", status);
        } else {
            model.addAttribute("partidas", partidaService.listarTodas(
                    PageRequest.of(0, 100, Sort.by("dataHora").ascending())).getContent());
        }
        model.addAttribute("statusList", Partida.StatusPartida.values());
        return "admin/partidas/lista";
    }

    @GetMapping("/admin/partidas/nova")
    public String novaPartidaForm(Model model) {
        model.addAttribute("partida", new PartidaRequest());
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "admin/partidas/form";
    }

    @PostMapping("/admin/partidas/nova")
    public String salvarPartida(@Valid @ModelAttribute("partida") PartidaRequest request,
                                BindingResult result, Model model,
                                RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) {
            model.addAttribute("selecoes", selecaoService.listarTodas());
            return "admin/partidas/form";
        }
        try {
            partidaService.criar(request);
            redirectAttrs.addFlashAttribute("sucesso", "Partida criada com sucesso!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/partidas";
    }

    @GetMapping("/admin/partidas/{id}/resultado")
    public String resultadoForm(@PathVariable Long id, Model model) {
        model.addAttribute("partida", partidaService.buscarPorId(id));
        model.addAttribute("resultado", new AtualizarResultadoRequest());
        model.addAttribute("statusList", Partida.StatusPartida.values());
        return "admin/partidas/resultado";
    }

    @PostMapping("/admin/partidas/{id}/resultado")
    public String salvarResultado(@PathVariable Long id,
                                  @Valid @ModelAttribute("resultado") AtualizarResultadoRequest request,
                                  BindingResult result, Model model,
                                  RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) {
            model.addAttribute("partida", partidaService.buscarPorId(id));
            model.addAttribute("statusList", Partida.StatusPartida.values());
            return "admin/partidas/resultado";
        }
        try {
            partidaService.atualizarResultado(id, request);
            // Finaliza automaticamente após registrar resultado
            AtualizarStatusRequest statusReq = new AtualizarStatusRequest();
            statusReq.setStatus(Partida.StatusPartida.FINALIZADA);
            partidaService.atualizarStatus(id, statusReq);
            redirectAttrs.addFlashAttribute("sucesso", "Resultado registrado e partida finalizada!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/partidas";
    }

    @PostMapping("/admin/partidas/{id}/excluir")
    public String excluirPartida(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        try {
            partidaService.excluir(id);
            redirectAttrs.addFlashAttribute("sucesso", "Partida excluída com sucesso!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/partidas";
    }

    // ===== SELEÇÕES =====

    @GetMapping("/admin/selecoes")
    public String listarSelecoes(Model model) {
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "admin/selecoes/lista";
    }

    @GetMapping("/admin/selecoes/nova")
    public String novaSelecaoForm(Model model) {
        model.addAttribute("selecao", new SelecaoRequest());
        return "admin/selecoes/form";
    }

    @PostMapping("/admin/selecoes/nova")
    public String salvarSelecao(@Valid @ModelAttribute("selecao") SelecaoRequest request,
                                BindingResult result, Model model,
                                RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) return "admin/selecoes/form";
        try {
            selecaoService.criar(request);
            redirectAttrs.addFlashAttribute("sucesso", "Seleção cadastrada com sucesso!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    @GetMapping("/admin/selecoes/{id}/editar")
    public String editarSelecaoForm(@PathVariable Long id, Model model) {
        SelecaoDTO dto = selecaoService.buscarPorId(id);
        SelecaoRequest req = new SelecaoRequest();
        req.setNome(dto.getNome());
        req.setSigla(dto.getSigla());
        req.setGrupo(dto.getGrupo());
        req.setBandeiraUrl(dto.getBandeiraUrl());
        model.addAttribute("selecao", req);
        model.addAttribute("selecaoId", id);
        return "admin/selecoes/form";
    }

    @PostMapping("/admin/selecoes/{id}/editar")
    public String atualizarSelecao(@PathVariable Long id,
                                   @Valid @ModelAttribute("selecao") SelecaoRequest request,
                                   BindingResult result, Model model,
                                   RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) {
            model.addAttribute("selecaoId", id);
            return "admin/selecoes/form";
        }
        try {
            selecaoService.atualizar(id, request);
            redirectAttrs.addFlashAttribute("sucesso", "Seleção atualizada!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    @PostMapping("/admin/selecoes/{id}/excluir")
    public String excluirSelecao(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        try {
            selecaoService.excluir(id);
            redirectAttrs.addFlashAttribute("sucesso", "Seleção excluída!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    // ===== USUÁRIOS =====

    @GetMapping("/admin/usuarios")
    public String listarUsuarios(@RequestParam(required = false) String nome, Model model) {
        var pageable = PageRequest.of(0, 100, Sort.by("name").ascending());
        if (nome != null && !nome.isBlank()) {
            model.addAttribute("usuarios", userService.searchUsers(nome, pageable).getContent());
            model.addAttribute("busca", nome);
        } else {
            model.addAttribute("usuarios", userService.listAllUsers(pageable).getContent());
        }
        return "admin/usuarios/lista";
    }

    @PostMapping("/admin/usuarios/{id}/toggle")
    public String toggleUsuario(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        try {
            UserProfileDTO user = userService.toggleUserStatus(id);
            String acao = user.isActive() ? "desbloqueado" : "bloqueado";
            redirectAttrs.addFlashAttribute("sucesso", "Usuário " + acao + " com sucesso!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/usuarios";
    }

    @PostMapping("/admin/usuarios/{id}/promover")
    public String promoverAdmin(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        try {
            userService.promoteToAdmin(id);
            redirectAttrs.addFlashAttribute("sucesso", "Usuário promovido a ADMIN!");
        } catch (Exception e) {
            redirectAttrs.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/usuarios";
    }
}
// Nota: adicionar este método na classe AdminWebController existente
