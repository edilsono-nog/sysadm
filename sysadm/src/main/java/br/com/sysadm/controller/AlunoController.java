package br.com.sysadm.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.sysadm.Dto.ListaAlunosDto;
import br.com.sysadm.repository.AlunosRepository;

@Controller
@RequestMapping(value = "/alunos")
public class AlunoController {
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private ReportUtil reportUtil;
	
	@GetMapping(value = "listadealunos")
	 public void imprimePdf(HttpServletRequest request, HttpServletResponse response,
			 				 @RequestParam(name = "name") String name) throws Exception {
		
		ListaAlunosDto alunosDto = new ListaAlunosDto();
		
		List<ListaAlunosDto> alunosDtos = new ArrayList<>();
		
		List<Map> iterable = null;
		 
		 if(name.equals("Todos")) {
			 iterable =  alunosRepository.findByAluno();
		 }else if (name.equals("Manhã") || name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoTurno(name);
		 }else if (!name.equals("Escolas") && !name.equals("Manhã") || !name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoEscola(name);
		 } 
		
	//	List<Map> iterable =  alunosRepository.findByAluno();
		
		 for (Map map : iterable) {
			 
			 String nome = (String) map.get("nome");
			 String escolas = (String) map.get("escolas");
			 String turno = (String) map.get("turno");
			 
			 alunosDto.setNome(nome);
			 alunosDto.setEscolas(escolas);
			 alunosDto.setTurno(turno);
			 
			 alunosDtos.add(alunosDto);
			 alunosDto = new ListaAlunosDto();
		 }
		
	/*	for (int i = 0; i < iterable.size(); i++) {
			alunosDto.setNome(iterable[i][0].toString()));
		}
		
		List<Alunos> alunos = new ArrayList<>();
		 
		 Iterable<Alunos> iterables = alunosRepository.findAll();
		 for(Alunos aluno : iterables) {
			 alunos.add(aluno);
		 }*/
		
		 /*Chama o serviço que faz a geração do relatorio*/
		 byte[] pdf = reportUtil.gerarRelatorio(alunosDtos, "listadealunos", request.getServletContext());
		 
		 /*Tamanho da resposta*/
		 response.setContentLength(pdf.length);
		 
		 /*Denife na resposta o tipo de arquivo*/
		 response.setContentType("application/octet-stream");
		 
		 /*Define o cabeçalho da resposta*/
		 String headerKey = "Content-Disposition";
		 String headerValue = String.format("inline; filename=\"%s\"", "relatorio.pdf");
		// String headerValue = String.format("attachment: filename=\"%s\"", "relatorio.pdf");
		 response.setContentType("application/pdf");
		// response.setHeader("Content-Disposition", "inline; filename=listadealunos.pdf");
		 response.setHeader(headerKey, headerValue);
		 
		 /*Finaliza a resposta pro navegador*/
		 response.getOutputStream().write(pdf);
		 
	 }
}
