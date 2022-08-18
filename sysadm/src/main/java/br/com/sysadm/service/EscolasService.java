package br.com.sysadm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.sysadm.model.Escolas;
import br.com.sysadm.repository.EscolasRepository;

@Service
public class EscolasService {

	@Autowired
	private EscolasRepository escolasRepository;

	public ResponseEntity<Escolas> salvar(Escolas escolas) {
		Escolas newescola = escolasRepository.save(escolas);
		 
		 return new ResponseEntity<Escolas>(newescola, HttpStatus.OK);
	}

	public Page<Escolas> listatodos(Pageable pageable) {
		 Page<Escolas> escPage = escolasRepository.findAll(pageable);
				   	    	
		 return escPage;
	}

	public ResponseEntity<Escolas> pegaEscolaId(Long iduser) {
		Escolas escola = escolasRepository.findById(iduser).get();
    	
    	return new ResponseEntity<Escolas>(escola, HttpStatus.OK);
	}

	public Page<Escolas> pesqEscola(String name, Pageable pageable) {
		Page<Escolas> escPage = escolasRepository.pesqAno(name.trim().toUpperCase(), pageable);
		 
		return escPage;
	}

	public ResponseEntity<List<Escolas>> listaEscola() {
		List<Escolas> escolas = escolasRepository.findAll();
		return new ResponseEntity<List<Escolas>>(escolas, HttpStatus.OK);
	}
}
