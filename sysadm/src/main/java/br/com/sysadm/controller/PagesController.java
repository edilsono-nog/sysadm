package br.com.sysadm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PagesController {

	@GetMapping("/dashboard")
	private String dashboard() {
		return "login";
	}
	
	/*@RequestMapping(value = "login", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public String home() {
		
		return "login";
		
	}*/
}
