package br.com.sysadm.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.sysadm.Dto.AlunosDto;
import br.com.sysadm.converter.EntityDtoConverter;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.repository.AlunosRepository;

@Service
public class AlunosService {
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	public ResponseEntity<Alunos> salvar(@RequestBody Alunos aluno ){
		 
		 Alunos newaluno = alunosRepository.save(aluno);
		 
		 return new ResponseEntity<Alunos>(newaluno, HttpStatus.OK);
	 }
	
	public Page<AlunosDto> listatodos(Pageable pageable){
		 
		 Page<Alunos> aluPage = alunosRepository.findAll(pageable);
		 
		 Page<AlunosDto> pages = aluPage.map(entity -> {
			 AlunosDto aluno = EntityDtoConverter.entityToDto(entity);
			 return aluno;
		 });
  	
  	    	
  	return pages;
}

	public ResponseEntity<Alunos> pegaAlunoId(Long iduser) {
		
		Alunos aluno = alunosRepository.findById(iduser).get();
    	
    	return new ResponseEntity<Alunos>(aluno, HttpStatus.OK);
	}
	
	
	public Page<AlunosDto> listaAlunos(@RequestParam(name = "name") String name, Pageable pageable ){
		
		Page<Alunos> aluPage = alunosRepository.listAluno(name.trim().toUpperCase(), pageable);
		
		 Page<AlunosDto> pages = aluPage.map(entity -> {
			 AlunosDto aluno = EntityDtoConverter.entityToDto(entity);
			 return aluno;
		 });
		 
		 return pages;
	}

	public Page<AlunosDto> listatodosStatus(@RequestParam(name = "status") String status, Pageable pageable) {
		
		Page<Alunos> aluPage = alunosRepository.listAlunosStatus(status.trim(), pageable);
		
		 Page<AlunosDto> pages = aluPage.map(entity -> {
			 AlunosDto aluno = EntityDtoConverter.entityToDto(entity);
			 return aluno;
		 });
		 
		 return pages;
	}

	public Page<AlunosDto> pesqAlunos(@RequestParam(name = "status") String status, 
									  @RequestParam(name = "name") String name, Pageable pageable) {
		Page<Alunos> aluPage = alunosRepository.pesqAlunos(status.trim(), name.trim().toUpperCase(), pageable);
		
		 Page<AlunosDto> pages = aluPage.map(entity -> {
			 AlunosDto aluno = EntityDtoConverter.entityToDto(entity);
			 return aluno;
		 });
		 
		 return pages;
	}

	public Page<AlunosDto> pesqAluno(@RequestParam(name = "name") String name, Pageable pageable) {
		Page<Alunos> aluPage = alunosRepository.pesqAluno(name.trim().toUpperCase(), pageable);
		
		 Page<AlunosDto> pages = aluPage.map(entity -> {
			 AlunosDto aluno = EntityDtoConverter.entityToDto(entity);
			 return aluno;
		 });
		 
		 return pages;
	}

}
