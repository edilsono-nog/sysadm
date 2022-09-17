package br.com.sysadm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.sysadm.model.Matricula;
import br.com.sysadm.repository.MatriculasRepository;

@Service
public class MatriculasService {

	@Autowired
	private MatriculasRepository matriculasRepository;

	public Page<Matricula> listatodos(Pageable pageable) {
		Page<Matricula> matriculaPage = matriculasRepository.findAll(pageable);
	    	
		 return matriculaPage;
	}

	public ResponseEntity<Matricula> save(Matricula matricula) {

		Matricula newmatricula = matriculasRepository.save(matricula);
		
	return new ResponseEntity<Matricula>(newmatricula, HttpStatus.OK);
	}

	public ResponseEntity<Matricula> pegaMatriculaId(Long idmatricula) {
		
		Matricula matricula = matriculasRepository.findById(idmatricula).get();
    	
    	return new ResponseEntity<Matricula>(matricula, HttpStatus.OK);
	}

}
