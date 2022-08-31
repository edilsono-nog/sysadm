package br.com.sysadm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class IndexController {

	@GetMapping("dashboard")
	private String dashboard() {
		return "dashboard";
	}
	
	@RequestMapping(value = "login", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public String inicio() {
		return "login";
	}
	
	@GetMapping("listacad")
	private String listacad() {
		return "cadastro/listacad";
	}
	
	@GetMapping("alunoscad")
	private String alunoscad() {
		return "cadastro/alunoscad";
	}
	
	@GetMapping("fichaaluno")
	private String fichaaluno() {
		return "cadastro/fichaaluno";
	}
	
	@GetMapping("responsaveis")
	private String responsaveis() {
		return "cadastro/responsaveis";
	}
}
