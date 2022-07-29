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


import br.com.sysadm.Dto.AlunosDto;
import br.com.sysadm.model.Alunos;
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
     public Page<AlunosDto> alunos(@RequestParam(name = "status") String status, Pageable pageable){
		 if (status.equals("Todos")) {
			 return alunosService.listatodos(pageable);
		} else if (!status.equals("Todos")) {
			 return alunosService.listatodosStatus(status, pageable);
		}
		 return alunosService.listatodos(pageable);
     }
	 
	 @GetMapping(value = "buscaralunoid")
     @ResponseBody
     public ResponseEntity<Alunos> buscaruserid (@RequestParam(name = "iduser") Long iduser){
		 return alunosService.pegaAlunoId(iduser);
     }
	 
	 @GetMapping(value = "listaAluno")
     @ResponseBody
     public Page<AlunosDto> listaAlunos(@RequestParam(name = "name") String name,Pageable pageable){
		 return alunosService.listaAlunos(name, pageable);
     }
	 
	 @GetMapping(value = "pesqAluno")
     @ResponseBody
     public Page<AlunosDto> pesqAlunos(@RequestParam(name = "status") String status,
    		 							@RequestParam(name = "name") String name, Pageable pageable){
		 if (status.equals("Todos")) {
			 return alunosService.pesqAluno( name, pageable);
		 }else if (!status.equals("Todos")) {
			 return alunosService.pesqAlunos(status, name, pageable);
		}
		 return alunosService.pesqAluno(name, pageable);
     }


}
