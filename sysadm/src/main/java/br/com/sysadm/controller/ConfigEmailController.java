package br.com.sysadm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.ConfigEmail;
import br.com.sysadm.repository.ConfigEmailRepository;

@RestController
@RequestMapping(value = "/email")
public class ConfigEmailController {
	
	@Autowired
	private ConfigEmailRepository configEmailRepository;
	
	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<ConfigEmail> salvar(@RequestBody ConfigEmail configEmail ){
		
		ConfigEmail novo = configEmailRepository.save(configEmail);
		 
	return new ResponseEntity<ConfigEmail>(novo, HttpStatus.OK);
	}
	
	@GetMapping(value = "configemail")
	@ResponseBody
	public ResponseEntity<List<ConfigEmail>> listaConfig(){
		
		List<ConfigEmail> lista = configEmailRepository.findAll();
		
		return new ResponseEntity<List<ConfigEmail>>(lista, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "delete")
	@ResponseBody
	public ResponseEntity<String> limpaConfig(@RequestParam Long idConfig) {
		
		configEmailRepository.deleteById(idConfig);
		
		return new ResponseEntity<String>("Configuração removido com sucesso", HttpStatus.OK);
	}

}
