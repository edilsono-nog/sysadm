package br.com.sysadm.service;

import java.util.List;

import javax.persistence.criteria.Order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.sysadm.model.AnoLetivo;
import br.com.sysadm.repository.AnoLetivoRepository;

@Service
public class AnoLetivoService {

	@Autowired
	private AnoLetivoRepository anoLetivoRepository;

	public ResponseEntity<AnoLetivo> salvar(AnoLetivo anoLetivo) {
		AnoLetivo newano = anoLetivoRepository.save(anoLetivo);
		 
		 return new ResponseEntity<AnoLetivo>(newano, HttpStatus.OK);
	}

	public Page<AnoLetivo> listatodos(Pageable pageable) {
		 Page<AnoLetivo> aluPage = anoLetivoRepository.findAll(pageable);
				   	    	
		 return aluPage;
	}

	public ResponseEntity<AnoLetivo> pegaAnoId(Long iduser) {
		AnoLetivo anoLetivo = anoLetivoRepository.findById(iduser).get();
    	
    	return new ResponseEntity<AnoLetivo>(anoLetivo, HttpStatus.OK);
	}

	public Page<AnoLetivo> pesqAno(String name, Pageable pageable) {
		Page<AnoLetivo> aluPage = anoLetivoRepository.pesqAno(name.trim().toUpperCase(), pageable);
		 
		return aluPage;
	}

	public ResponseEntity<List<AnoLetivo>> listaAno() {
		List<AnoLetivo> letivos = anoLetivoRepository.findAll();
		return new ResponseEntity<List<AnoLetivo>>(letivos, HttpStatus.OK);
	}
	
}
