package br.com.sysadm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class IndexController {

	/*Login*/
	@RequestMapping(value = "login", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public String inicio() {
		return "login";
	}
	
	/*Pagina Inicial*/
	@GetMapping("dashboard")
	private String dashboard() {
		return "dashboard";
	}
	
	@GetMapping("recuperacode")
	private String recuperacode() {
		return "confrecupera";
	}
	
	/*Telas de Alunos*/
	@GetMapping("alunos_listagem")
	private String listacad() {
		return "alunos/listagem";
	}
	
	@GetMapping("alunos_ficha")
	private String fichaaluno() {
		return "alunos/ficha";
	}
	
	@GetMapping("alunos_cadastro")
	private String alunoscad() {
		return "alunos/cadastro";
	}
	
	/*Telas de Responsáveis*/
	@GetMapping("responsavel_listagem")
	private String responsaveis() {
		return "responsaveis/listagem";
	}
	
	@GetMapping("responsavel_cadastro")
	private String responsavelcad() {
		return "responsaveis/cadastro";
	}
	
	@GetMapping("responsavel_ficha")
	private String ficharesponsavel() {
		return "responsaveis/ficha";
	}
	
	/*Telas de Configurações*/
	
	@GetMapping("anoletivo")
	private String anoletivo() {
		return "config/anoletivo";
	}
	
	@GetMapping("anoletivocad")
	private String anoletivocad() {
		return "config/anoletivocad";
	}
	
	@GetMapping("escolaslist")
	private String escolaslist() {
		return "config/escolaslist";
	}
	
	@GetMapping("escolascad")
	private String escolascad() {
		return "config/escolascad";
	}
	
	@GetMapping("categoriaslist")
	private String categoriaslist() {
		return "config/categoriaslist";
	}
	
	@GetMapping("categoriascad")
	private String categoriascad() {
		return "config/categoriascad";
	}
	
	@GetMapping("configuracoes")
	private String configuracoes() {
		return "config/configuracoes";
	}
	
	@GetMapping("configemail")
	private String configemail() {
		return "config/configemail";
	}
	
	@GetMapping("usuarios")
	private String usuarios() {
		return "config/usuariolist";
	}
	
	@GetMapping("usuarioscad")
	private String usuarioscad() {
		return "config/usuariocad";
	}
	
	/*Financeiro*/
	@GetMapping("caixas")
	private String caixas() {
		return "finance/caixalist";
	}
	
	@GetMapping("caixascad")
	private String caixascad() {
		return "finance/caixacad";
	}
	
	@GetMapping("contasareceber")
	private String contasareceber() {
		return "finance/contasrec";
	}
	
	@GetMapping("contasarecebercad")
	private String contasarecebercad() {
		return "finance/contasreccad";
	}
	
	@GetMapping("contasapagar")
	private String contasapagar() {
		return "finance/contasapagarlist";
	}
	
	@GetMapping("contasapagarcad")
	private String contasapagarcad() {
		return "finance/contasapagarcad";
	}
	
	/*Gerador de Relatorios*/
	
	@GetMapping("geradorderelatorio")
	private String geradorderelatorio() {
		return "relatorios/geradorderelatorio";
	}
}
