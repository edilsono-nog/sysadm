package br.com.sysadm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sysadm.repository.MatriculasRepository;

@Service
public class MatriculasService {

	@Autowired
	private MatriculasRepository matriculasRepository;
}
