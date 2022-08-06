package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.service.AnoLetivoService;

@RestController
@RequestMapping(value = "/anoletivo")
public class AnoLetivoController {

	@Autowired
	private AnoLetivoService anoLetivoService;
}
