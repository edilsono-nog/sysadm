package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.Alunos;
import br.com.sysadm.repository.AlunosRepository;

@RestController
@RequestMapping(value = "/aluno")
public class AlunosController {
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	 @PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Alunos> salvar(@RequestBody Alunos aluno ){
		 
		 Alunos newaluno = alunosRepository.save(aluno);
		 
		 return new ResponseEntity<Alunos>(newaluno, HttpStatus.OK);
	 }
	 
	 

}
