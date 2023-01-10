package br.com.sysadm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.ContasReceber;
import br.com.sysadm.repository.ContasReceberRepository;
import br.com.sysadm.repository.MensalidadesRepository;

@RestController
@RequestMapping(value = "/contasbaixasrec")
public class ContasBaixasRecController {
	
	@Autowired
	private MensalidadesRepository mensalidadesRepository;
	
	@Autowired
	private ContasReceberRepository contasReceberRepository;
	
	@GetMapping(value = "listamensalidades")
	@ResponseBody
	public Page<List<?>> listamensalidades(@RequestParam(name = "name") String name, Pageable pageable) {
		
		Page<List<?>> mensalidades = null;
		
		if(name == "") {
			mensalidades = mensalidadesRepository.findmensalidade(pageable);
		}else {
			mensalidades = mensalidadesRepository.findmensalidadeName(name.trim().toUpperCase(), pageable);
		}

		return mensalidades;
	}
	
	@GetMapping(value = "listacontas")
	@ResponseBody
	public Page<ContasReceber> listacontas(@RequestParam(name = "name") String name, Pageable pageable) {

		Page<ContasReceber> contasreceber = null;
		
		if(name == "") {
			contasreceber = contasReceberRepository.findAll(pageable);
		}else {
			contasreceber = contasReceberRepository.findContasName(name.trim().toUpperCase(), pageable);
		}
		
		return contasreceber;
	}

}
