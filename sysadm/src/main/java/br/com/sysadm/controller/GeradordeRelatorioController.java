package br.com.sysadm.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.sysadm.Dto.GeraRelatoriosDto;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.repository.BaixasRepository;

@Controller
@RequestMapping(value = "/geradorderelatorios")
public class GeradordeRelatorioController {
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private BaixasRepository baixasRepository;
	
	@Autowired
	private ReportUtil reportUtil;
	
	@GetMapping(value = "listadealunos")
	 public void imprimePdf(HttpServletRequest request, HttpServletResponse response,
			 				 @RequestParam(name = "name") String name) throws Exception {
		
		GeraRelatoriosDto alunosDto = new GeraRelatoriosDto();
		
		List<GeraRelatoriosDto> alunosDtos = new ArrayList<>();
		
		List<Map> iterable = null;
		 
		 if(name.equals("Todos")) {
			 iterable =  alunosRepository.findByAluno();
		 }else if (name.equals("Manhã") || name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoTurno(name);
		 }else if (!name.equals("Escolas") && !name.equals("Manhã") || !name.equals("Tarde")) {
			 iterable =  alunosRepository.findByAlunoEscola(name);
		 } 
		
		 for (Map map : iterable) {
			 
			 String nome = (String) map.get("aluno");
			 String escolas = (String) map.get("escolas");
			 String turno = (String) map.get("turno");
			 String responsavel = (String) map.get("responsavel");
			 String telresp = (String) map.get("telresp");
			 
			 alunosDto.setAluno(nome);
			 alunosDto.setEscolas(escolas);
			 alunosDto.setTurno(turno);
			 alunosDto.setResponsavel(responsavel);
			 alunosDto.setTelresp(telresp);
			 
			 alunosDtos.add(alunosDto);
			 alunosDto = new GeraRelatoriosDto();
		 }
		
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
	
	@GetMapping(value = "geracarteirinhas")
	 public void geraCarteirinhas(HttpServletRequest request, HttpServletResponse response,
			 				 @RequestParam(name = "name") String name) throws Exception {
		
		GeraRelatoriosDto alunosDto = new GeraRelatoriosDto();
		
		List<GeraRelatoriosDto> alunosDtos = new ArrayList<>();
		
		List<Map> iterable = null;
		 
		 if(name.equals("Todos")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunos();
		 }else if (name.equals("Manhã") || name.equals("Tarde")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunoTurno(name);
		 }else if (!name.equals("Escolas") && !name.equals("Manhã") || !name.equals("Tarde")) {
			 iterable =  alunosRepository.findByCarteirinhaAlunoEscola(name);
		 } 
		
		
		 for (Map map : iterable) {
			 
			 String nome = (String) map.get("aluno");
			 String escolas = (String) map.get("escolas");
			 String turno = (String) map.get("turno");
			 String turma = (String) map.get("turma");
			 Double venc = (Double) map.get("venc");
			 Float valor = (Float) map.get("valor");
			 
			 alunosDto.setAluno(nome);
			 alunosDto.setEscolas(escolas);
			 alunosDto.setTurma(turma);
			 alunosDto.setTurno(turno);
			 alunosDto.setVenc(venc);
			 alunosDto.setValor(valor);
			 
			 alunosDtos.add(alunosDto);
			 alunosDto = new GeraRelatoriosDto();
		 }
		
		 /*Carrega o caminho do arquivo imagem*/
		String caminhoImagem = request.getServletContext().getRealPath("img") + File.separator + "topo.png";
		
		Map<String, Object> parametros = new HashMap<>();
		parametros.put("REPORT_IMG", caminhoImagem);
		
		 /*Chama o serviço que faz a geração do relatorio*/
		 byte[] pdf = reportUtil.gerarRelatorios(alunosDtos, "carteirinha", parametros, request.getServletContext());
		 
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
	
	@GetMapping(value = "resumodebaixas")
	 public void resumoDeBaixas(HttpServletRequest request, HttpServletResponse response,
			 				 @RequestParam(name = "mes") String mes, 
	 						 @RequestParam(name = "mesNum") String mesNum) throws Exception {
		
		int mesAtual = Integer.parseInt(mesNum);
		
		GeraRelatoriosDto relatoriosDto = new GeraRelatoriosDto();
		
		List<GeraRelatoriosDto> relatoriosDtos = new ArrayList<>();
		
		List<Map> maps = baixasRepository.findByResumoBaixas(mesAtual);
		
		for (Map map : maps) {
			 
			 String descricao = (String) map.get("descricao");
			 Date dt_baixa = (Date) map.get("dt_baixa");
			 String tipopgto = (String) map.get("tipopgto");
			 String tipo = (String) map.get("tipo");
			 String categoria = (String) map.get("categorias");
			 String tipocategoria = (String) map.get("tipocategoria");
			 Float valor = (Float) map.get("valor");
			 
			 relatoriosDto.setDescricao(descricao);
			 relatoriosDto.setDt_baixa(dt_baixa);
			 relatoriosDto.setTipopgto(tipopgto);
			 relatoriosDto.setTipo(tipo);
			 relatoriosDto.setCategorias(categoria);
			 relatoriosDto.setTipocategoria(tipocategoria);
			 relatoriosDto.setValor(valor);
			 
			 relatoriosDtos.add(relatoriosDto);
			 relatoriosDto = new GeraRelatoriosDto();
			 
		}
		
		Map<String, Object> parametros = new HashMap<>();
		parametros.put("REPORT_REF", mes);
		
		 /*Chama o serviço que faz a geração do relatorio*/
		 byte[] pdf = reportUtil.gerarRelatorios(relatoriosDtos, "resumodebaixas", parametros, request.getServletContext());
		 
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
	
	@GetMapping(value = "resumodemensalidades")
	 public void resumodemensalidades(HttpServletRequest request, HttpServletResponse response,
			 				 @RequestParam(name = "mes") String mes, 
	 						 @RequestParam(name = "mesNum") String mesNum) throws Exception {
		
		int mesAtual = Integer.parseInt(mesNum);
		
		GeraRelatoriosDto relatoriosDto = new GeraRelatoriosDto();
		
		List<GeraRelatoriosDto> relatoriosDtos = new ArrayList<>();
		
		List<Map> maps = baixasRepository.findByResumoMensalidades(mesAtual);
		
		for (Map map : maps) {
			 
			 String nome = (String) map.get("nome");
			 Date vencimento = (Date) map.get("vencimento");
			 Date liquidacao = (Date) map.get("liquidacao");
			 Float valor = (Float) map.get("valor");
			 
			 relatoriosDto.setNome(nome);
			 relatoriosDto.setVencimento(vencimento);
			 relatoriosDto.setLiquidacao(liquidacao);
			 relatoriosDto.setValor(valor);
			 
			 relatoriosDtos.add(relatoriosDto);
			 relatoriosDto = new GeraRelatoriosDto();
			 
		}
		
		Map<String, Object> parametros = new HashMap<>();
		parametros.put("REPORT_MES", mes);
		
		 /*Chama o serviço que faz a geração do relatorio*/
		 byte[] pdf = reportUtil.gerarRelatorios(relatoriosDtos, "resumodemensalidades", parametros, request.getServletContext());
		 
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
