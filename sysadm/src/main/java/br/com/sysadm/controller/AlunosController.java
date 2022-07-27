package br.com.sysadm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.Dto.AlunosDto;
import br.com.sysadm.converter.EntityDtoConverter;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.service.AlunosService;

@RestController
@RequestMapping(value = "/aluno")
public class AlunosController {
	
	@Autowired
	private AlunosService alunosService;
	
	 @PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Alunos> salvar(@RequestBody Alunos aluno ){
		 return alunosService.salvar(aluno);
	 }
	 
	 @GetMapping(value = "listatodos")
     @ResponseBody
     public Page<AlunosDto> alunos(Pageable pageable){
		 return alunosService.listatodos(pageable);
     }

}
