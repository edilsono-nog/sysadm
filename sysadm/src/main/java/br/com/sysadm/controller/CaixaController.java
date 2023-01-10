package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.Caixa;
import br.com.sysadm.repository.CaixaRepository;

@RestController
@RequestMapping(value = "/caixa")
public class CaixaController {

	@Autowired
	private CaixaRepository caixaRepository;

	@GetMapping(value = "listacaixas")
	@ResponseBody
	public Page<Caixa> listacaixas(Pageable pageable) {

		Page<Caixa> caixas = caixaRepository.findAll(pageable);

		return caixas;
	}

	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<Caixa> salvar(@RequestBody Caixa caixa) {

		Caixa newcaixa = caixaRepository.save(caixa);

		return new ResponseEntity<Caixa>(newcaixa, HttpStatus.OK);
	}

	@GetMapping(value = "pesqcaixa")
	@ResponseBody
	public Page<Caixa> pesqcaixa(@RequestParam(name = "name") String name, Pageable pageable) {

		Page<Caixa> caixaPage = caixaRepository.pesqAno(name.trim().toUpperCase(), pageable);

		return caixaPage;
	}

	@GetMapping(value = "buscarcaixaid")
	@ResponseBody
	public ResponseEntity<Caixa> buscarcaixaid(@RequestParam(name = "idcaixa") Long idcaixa) {
		
		Caixa caixa = caixaRepository.findById(idcaixa).get();

		return new ResponseEntity<Caixa>(caixa, HttpStatus.OK);
	}

}
