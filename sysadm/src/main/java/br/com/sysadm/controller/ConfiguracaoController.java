package br.com.sysadm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConfiguracaoController {

	@GetMapping("anoletivo")
	private String anoletivo() {
		return "config/anoletivo";
	}
	
	@GetMapping("anoletivocad")
	private String anoletivocad() {
		return "config/anoletivocad";
	}
	
}
