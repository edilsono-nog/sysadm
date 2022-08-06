package br.com.sysadm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sysadm.repository.AnoLetivoRepository;

@Service
public class AnoLetivoService {

	@Autowired
	private AnoLetivoRepository anoLetivoRepository;
}
