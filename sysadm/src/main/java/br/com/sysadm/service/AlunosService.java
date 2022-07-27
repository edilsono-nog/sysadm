package br.com.sysadm.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

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
	
	
	

}
