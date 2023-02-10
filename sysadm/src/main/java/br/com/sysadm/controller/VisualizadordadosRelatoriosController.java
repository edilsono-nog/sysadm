package br.com.sysadm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.repository.BaixasRepository;

@RestController
@RequestMapping(value = "/visualizador")
public class VisualizadordadosRelatoriosController {
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private BaixasRepository baixasRepository;
	
	@GetMapping(value = "listadealunos")
	 public List<Map> listadealunos(@RequestParam(name = "name") String name)  {
		 
		 List<Map> iterable = null;
		 
		 if(name.equals("Todos")) {
			 iterable =  alunosRepository.findByAluno();
		 }else if (name.equals("Manhã") || name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoTurno(name);
		 }else if (!name.equals("Escolas") && !name.equals("Manhã") || !name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoEscola(name);
		 } 
		 
		 return iterable;
	 }
	
	@GetMapping(value = "geracarteirinhas")
	 public List<Map> geraCarteirinhas(@RequestParam(name = "name") String name)  {
		 
		 List<Map> iterable = null;
		 
		 if(name.equals("Todos")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunos();
		 }else if (name.equals("Manhã") || name.equals("Tarde")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunoTurno(name);
		 }else if (!name.equals("Escolas") && !name.equals("Manhã") || !name.equals("Tarde")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunoEscola(name);
		 } 
		 
		 return iterable;
	 }
	
	@GetMapping(value = "resumodebaixas")
	 public List<Map> resumoDeBaixas(@RequestParam(name = "mes") String mes, 
	 						 			@RequestParam(name = "mesNum") String mesNum) {
		
		int mesAtual = Integer.parseInt(mesNum);
		
		List<Map> maps = baixasRepository.findByResumoBaixas(mesAtual);
		
		return maps;
	}
	
	@GetMapping(value = "resumodemensalidades")
	 public List<Map> resumodemensalidades(@RequestParam(name = "mes") String mes, 
	 						 			@RequestParam(name = "mesNum") String mesNum) {
		
		int mesAtual = Integer.parseInt(mesNum);
		
		List<Map> maps = baixasRepository.findByResumoMensalidades(mesAtual);
		
		return maps;
	}

}
