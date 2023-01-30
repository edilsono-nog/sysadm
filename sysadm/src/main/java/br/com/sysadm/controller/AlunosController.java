package br.com.sysadm.controller;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.pdf.PdfStructTreeController.returnType;

import br.com.sysadm.Dto.AlunosDto;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.service.AlunosService;

@RestController
@RequestMapping(value = "/aluno")
public class AlunosController {
	
	@Autowired
	private AlunosService alunosService;
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private ReportUtil reportUtil;
	
	 @PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Alunos> salvar(@RequestBody Alunos aluno ){
		 return alunosService.salvar(aluno);
	 }
	 
	 @GetMapping(value = "listatodos")
     @ResponseBody
     public Page<AlunosDto> alunos(@RequestParam(name = "status") String status, Pageable pageable){
		 if (status.equals("Todos")) {
			 return alunosService.listatodos(pageable);
		} else if (!status.equals("Todos")) {
			 return alunosService.listatodosStatus(status, pageable);
		}
		 return alunosService.listatodos(pageable);
     }
	 
	 @GetMapping(value = "buscaralunoid")
     @ResponseBody
     public ResponseEntity<Alunos> buscaruserid (@RequestParam(name = "iduser") Long iduser){
		 return alunosService.pegaAlunoId(iduser);
     }
	 
	 @GetMapping(value = "listaAluno")
     @ResponseBody
     public Page<AlunosDto> listaAlunos(@RequestParam(name = "name") String name,Pageable pageable){
		 return alunosService.listaAlunos(name, pageable);
     }
	 
	 @GetMapping(value = "pesqAluno")
     @ResponseBody
     public Page<AlunosDto> pesqAlunos(@RequestParam(name = "status") String status,
    		 							@RequestParam(name = "name") String name, Pageable pageable){
		 if (status.equals("Todos")) {
			 return alunosService.pesqAluno( name, pageable);
		 }else if (!status.equals("Todos")) {
			 return alunosService.pesqAlunos(status, name, pageable);
		}
		 return alunosService.pesqAluno(name, pageable);
     }

	 @GetMapping(value = "geraPdfListaAlunos")
	 public void imprimePdf(HttpServletRequest request, HttpServletResponse response) throws Exception {
		 
		 List<Alunos> alunos = new ArrayList<>();
		 
		 Iterable<Alunos> iterable = alunosRepository.findAll();
		 for(Alunos aluno : iterable) {
			 alunos.add(aluno);
		 }
		 /*Chama o serviço que faz a geração do relatorio*/
		 byte[] pdf = reportUtil.gerarRelatorio(alunos, "listadealunos", request.getServletContext());
		 
		 /*Tamanho da resposta*/
		 response.setContentLength(pdf.length);
		 
		 /*Denife na resposta o tipo de arquivo*/
		 response.setContentType("application/octet-stream");
		 
		 /*Define o cabeçalho da resposta*/
		 String headerKey = "Content-Disposition";
		 String headerValue = String.format("attachment: filename=\"%s\"", "relatorio.pdf");
		 response.setHeader(headerKey, headerValue);
		 
		 /*Finaliza a resposta pro navegador*/
		 response.getOutputStream().write(pdf);
		 
	 }
	 
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

}
