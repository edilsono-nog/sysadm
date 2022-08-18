package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.Matricula;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.service.AlunosService;
import br.com.sysadm.service.MatriculasService;

@RestController
@RequestMapping(value = "/matricula")
public class MatriculasController {

	@Autowired
	private MatriculasService matriculasService;
	
	@Autowired
	private AlunosService alunosService;
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@GetMapping(value = "listatodos")
    @ResponseBody
    public Page<Matricula> anoLetivo(Pageable pageable){
		 return matriculasService.listatodos(pageable);
    }
	
	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<Alunos> salvar(@RequestParam(name = "idAluno") String idAluno, @RequestBody Matricula matricula){

		Alunos aluno = alunosRepository.findById(Long.parseLong( idAluno )).get();
				
		aluno.getMatricula().add(matricula);
		
		return alunosService.salvar(aluno);
	}
	
}
