package br.com.sysadm.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

import javax.swing.JOptionPane;

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

import br.com.sysadm.Dto.ContasaPagarDto;
import br.com.sysadm.model.Baixas;
import br.com.sysadm.model.Caixa;
import br.com.sysadm.model.ContasReceber;
import br.com.sysadm.model.ContasaPagar;
import br.com.sysadm.model.Mensalidades;
import br.com.sysadm.repository.BaixasRepository;
import br.com.sysadm.repository.CaixaRepository;
import br.com.sysadm.repository.ContasaPagarRepository;

@RestController
@RequestMapping(value = "/contasapagar")
public class ContasaPagarController {

	@Autowired
	public ContasaPagarRepository contasaPagarRepository;
	
	@Autowired
	private BaixasRepository baixasRepository;
	
	@Autowired
	private CaixaRepository caixaRepository;
	
	@GetMapping(value = "listacontasapagar")
	@ResponseBody
	public Page<ContasaPagar> listacontasapagar(@RequestParam(name = "name") String name, Pageable pageable) {
		
		if(name == "") {
			Page<ContasaPagar> contasaPagars = contasaPagarRepository.findAllContas(pageable);
			return contasaPagars;
		}else {
			Page<ContasaPagar> page = contasaPagarRepository.listaTodosaPagar(name.trim().toUpperCase(), pageable);
			return page;
		}
	}
	
	@GetMapping(value = "pegaContas")
	@ResponseBody
	public ResponseEntity<ContasaPagar> pegarContas(@RequestParam(name = "idRec") Long idRec){
		
		ContasaPagar contasaPagar = contasaPagarRepository.findByConta(idRec);
		
		return new ResponseEntity<ContasaPagar>(contasaPagar, HttpStatus.OK);
	}
	
	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<ContasaPagar> salvar(@RequestBody ContasaPagar contasaPagar) throws ParseException{

		if(contasaPagar.getParcelas() == 0) {
			ContasaPagar pagar = contasaPagarRepository.save(contasaPagar);
			return new ResponseEntity<ContasaPagar>(pagar, HttpStatus.OK);
		}else{
			ContasaPagarDto dto = new ContasaPagarDto();
			dto.setDescricao(contasaPagar.getDescricao());
			dto.setEmissao(contasaPagar.getEmissao());
			dto.setObs(contasaPagar.getObs());
			dto.setParcelas(contasaPagar.getParcelas());
			dto.setValor(contasaPagar.getValor());
			dto.setVencimento(contasaPagar.getVencimento());
			
			geraParcelas(dto);
		}
			return null;		
	}

	private void geraParcelas(ContasaPagarDto dto) throws ParseException {
		ContasaPagar contas = new ContasaPagar();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");	
		Date now = new Date();
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDateTime = dto.getVencimento().format(dateTimeFormatter);
		Date venc = sdf.parse(formattedDateTime);
		int mes = 0;
		Calendar calendar =  sdf.getCalendar();
		calendar.setTime(venc);
	
		for (int i = 0; i < dto.getParcelas(); i++) {
			calendar.add(Calendar.MONTH, mes);
			LocalDate localDate = calendar.getTime().toInstant().atZone( ZoneId.systemDefault() ).toLocalDate();
			contas.setVencimento(localDate);
			contas.setDescricao(dto.getDescricao());
			contas.setObs(dto.getObs());
			contas.setValor(dto.getValor());
			LocalDate localDatenow = now.toInstant().atZone( ZoneId.systemDefault() ).toLocalDate();
			contas.setEmissao(localDatenow);
			contas.setParcelas(i+1);
			
			contasaPagarRepository.save(contas);
			mes = 1;
			contas = new ContasaPagar();
		}
	}
	
	@GetMapping(value = "pegaRegistro")
	@ResponseBody
	public ResponseEntity<ContasaPagar> pegaRegistro(@RequestParam(name = "idRec") Long idRec){
		
		ContasaPagar contasaPagar = contasaPagarRepository.findByConta(idRec);
		
		return new ResponseEntity<ContasaPagar>(contasaPagar, HttpStatus.OK);
	}
	
	@PostMapping(value = "salvarBaixa")
	@ResponseBody
	 public ResponseEntity<Baixas> salvarBaixa(@RequestBody Baixas baixas,
			 									@RequestParam(name = "regParcela") Long regParcela){
		
		Caixa caixa = caixaRepository.pegaCaixa(Long.parseLong(baixas.getCaixa()));
		Float saldo = caixa.getSaldo();
		saldo = saldo-baixas.getValor();
		
		caixa.setSaldo(saldo);
		caixaRepository.save(caixa);
		
		ContasaPagar contasaPagar = contasaPagarRepository.findByConta(regParcela);
		contasaPagar.setLiquidacao(baixas.getDt_baixa());
		contasaPagarRepository.save(contasaPagar);
		
		Baixas baixa = baixasRepository.save(baixas);

		return new ResponseEntity<Baixas>(baixa, HttpStatus.OK);
	}
}
