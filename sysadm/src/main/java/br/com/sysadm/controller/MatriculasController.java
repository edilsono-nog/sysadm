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
	
	@PostMapping(value = "salv")
	@ResponseBody
	public ResponseEntity<Alunos> salv(@RequestParam(name = "idAluno") String idAluno, @RequestBody Matricula matricula){

		Alunos aluno = alunosRepository.findById(Long.parseLong( idAluno )).get();
		
		matricula.setAluno(aluno);
		
		matriculasService.save(matricula);
				
		aluno.getMatricula().add(matricula);
		aluno.setMatricula(aluno.getMatricula());
		
		return alunosService.salvar(aluno);
	}
	
	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<Matricula> salvar(@RequestParam(name = "idAluno") String idAluno, @RequestBody Matricula matricula){

		if(matricula.getAluno() == null) {
			Alunos aluno = alunosRepository.findById(Long.parseLong(idAluno)).get();
		
			matricula.setAluno(aluno);
		}
		
		return matriculasService.save(matricula);
	}
	
	@GetMapping(value = "buscarmatriculaid")
    @ResponseBody
    public ResponseEntity<Matricula> buscaruserid (@RequestParam(name = "idmatricula") Long idmatricula){
		 return matriculasService.pegaMatriculaId(idmatricula);
    }
}
