package br.com.sysadm.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	 @PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Alunos> salvar(@RequestBody Alunos aluno ){
		 return alunosService.salvar(aluno);
	 }
	 
	 @PutMapping(value = "atualizar")
	 @ResponseBody
	 public int atualizar(@RequestBody Alunos aluno, 
			 				@RequestParam(name = "idAluno") Long idAluno){
		 return jdbcTemplate.update("UPDATE Alunos SET nome = ?, status = ?, dt_nasc = ?, "
							 		+ "email = ?, cep = ?, logradouro = ?, complemento = ?, bairro = ?, "
							 		+ "localidade = ?, uf = ?, telefone = ?, celular = ?, cpf = ?, rg = ? "
							 		+ "WHERE id = ?", 
							 		new Object[] {aluno.getNome(), aluno.getStatus(), aluno.getDt_nasc(),
							 				aluno.getEmail(), aluno.getCep(), aluno.getLogradouro(), aluno.getComplemento(),
							 				aluno.getBairro(), aluno.getLocalidade(), aluno.getUf(), aluno.getTelefone(),
							 				aluno.getCelular(), aluno.getCpf(), aluno.getRg(),
							 		idAluno});
	 }
	 
	 @GetMapping(value = "listaCadastros")
     @ResponseBody
     public Page<Alunos> listaCadastros(@RequestParam(name = "status") String status,
											@RequestParam(name = "name") String name, 
											Pageable pageable){
		 
		 if (status.equals("Todos")) {
			 if (name == "") {
				 return alunosRepository.listCadastros(pageable);
			 }else {
				 return alunosRepository.listCadastrosNome(name.trim().toUpperCase(), pageable);
			 }			 
		 }else if (!status.equals("Todos")) {
			 if (name == "") {
				 return alunosRepository.listCadastrosStatus(status, pageable);
			 }else {
				 return alunosRepository.listCadastrosStatusNome(status, name.trim().toUpperCase(), pageable);
			 }
		 }
		return null;
	 }
	 
	 @GetMapping(value = "buscaralunoid")
     @ResponseBody
     public ResponseEntity<Alunos> buscaruserid (@RequestParam(name = "iduser") Long iduser){
		 return alunosService.pegaAlunoId(iduser);
     }
	 
     @ResponseBody
     public Page<AlunosDto> listaAlunos(@RequestParam(name = "name") String name,Pageable pageable){
		 return alunosService.listaAlunos(name, pageable);
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
}
