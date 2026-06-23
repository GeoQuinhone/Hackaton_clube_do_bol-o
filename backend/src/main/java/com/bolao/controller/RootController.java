package com.bolao.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping("/")
    public String root() {
        return "redirect:/admin-login";
    }

    @GetMapping("/admin")
    public String admin() {
        return "redirect:/admin/dashboard";
    }
}
