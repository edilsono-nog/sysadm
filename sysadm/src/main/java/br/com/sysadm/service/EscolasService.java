package br.com.sysadm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sysadm.repository.EscolasRepository;

@Service
public class EscolasService {

	@Autowired
	private EscolasRepository escolasRepository;
}
