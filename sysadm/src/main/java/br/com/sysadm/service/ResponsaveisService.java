package br.com.sysadm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.sysadm.Dto.ResponsaveisDto;
import br.com.sysadm.converter.EntityRespDtoConverter;
import br.com.sysadm.model.Responsaveis;
import br.com.sysadm.repository.ResponsaveisRepository;

@Service
public class ResponsaveisService {
	
	@Autowired
	private ResponsaveisRepository responsaveisRepository;
	
	

	public Page<ResponsaveisDto> listatodos(Pageable pageable) {
		
		Page<Responsaveis> respPage = responsaveisRepository.findAll(pageable);
		 
		 Page<ResponsaveisDto> pages = respPage.map(entity -> {
			 ResponsaveisDto responsaveis = EntityRespDtoConverter.entityToDto(entity);
			 return responsaveis;
		 });
  	
  	    	
  	return pages;
	}

	public Responsaveis salvar(Responsaveis responsaveis) {
		
		Responsaveis newresponsavel = responsaveisRepository.save(responsaveis);
		 
		 return newresponsavel;
	}

	public ResponseEntity<Responsaveis> pegaResponsavelId(Long iduser) {
		
		Responsaveis responsaveis = responsaveisRepository.findById(iduser).get();
    	
    	return new ResponseEntity<Responsaveis>(responsaveis, HttpStatus.OK);
	}

	public Page<ResponsaveisDto> pesqResponsavel(String name, Pageable pageable) {
		
		Page<Responsaveis> respPage = responsaveisRepository.pesqResponsavel(name.trim().toUpperCase(), pageable);
		
		 Page<ResponsaveisDto> pages = respPage.map(entity -> {
			 ResponsaveisDto responsavel = EntityRespDtoConverter.entityToDto(entity);
			 return responsavel;
		 });
		 
		 return pages;
	}

	

}
