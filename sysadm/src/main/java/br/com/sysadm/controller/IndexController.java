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
	
	/*@RequestMapping(value = "dashboard", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public String home() {
		return "dashboar";
	}*/
}
