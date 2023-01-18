package br.com.sysadm.controller;

import java.util.List;
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

import br.com.sysadm.model.Baixas;
import br.com.sysadm.model.Caixa;
import br.com.sysadm.model.ContasReceber;
import br.com.sysadm.model.Mensalidades;
import br.com.sysadm.repository.BaixasRepository;
import br.com.sysadm.repository.CaixaRepository;
import br.com.sysadm.repository.ContasReceberRepository;
import br.com.sysadm.repository.MensalidadesRepository;

@RestController
@RequestMapping(value = "/contasbaixasrec")
public class ContasBaixasRecController {
	
	@Autowired
	private MensalidadesRepository mensalidadesRepository;
	
	@Autowired
	private ContasReceberRepository contasReceberRepository;
	
	@Autowired
	private BaixasRepository baixasRepository;
	
	@Autowired
	private CaixaRepository caixaRepository;

	
	@GetMapping(value = "listamensalidades")
	@ResponseBody
	public Page<List<?>> listamensalidades(@RequestParam(name = "name") String name, Pageable pageable) {
		
		Page<List<?>> mensalidades = null;
		
		if(name == "") {
			mensalidades = mensalidadesRepository.findmensalidade(pageable);
		}else {
			mensalidades = mensalidadesRepository.findmensalidadeName(name.trim().toUpperCase(), pageable);
		}

		return mensalidades;
	}
	
	@GetMapping(value = "listacontas")
	@ResponseBody
	public Page<ContasReceber> listacontas(@RequestParam(name = "name") String name, Pageable pageable) {

		Page<ContasReceber> contasreceber = null;
		
		if(name == "") {
			contasreceber = contasReceberRepository.findAllContas(pageable);
		}else {
			contasreceber = contasReceberRepository.findContasName(name.trim().toUpperCase(), pageable);
		}
		
		return contasreceber;
	}
	
	@PostMapping(value = "salvar")
	@ResponseBody
	public ResponseEntity<ContasReceber> salvar(@RequestBody ContasReceber contasReceber){
		
		ContasReceber receber = contasReceberRepository.save(contasReceber);
		
		return new ResponseEntity<ContasReceber>(receber, HttpStatus.OK);
	}
	
	@PostMapping(value = "salvarBaixa")
	@ResponseBody
	 public ResponseEntity<Baixas> salvarBaixa(@RequestBody Baixas baixas,
			 									@RequestParam(name = "regParcela") Long regParcela,
			 									@RequestParam(name = "tipoService") String tipoService){
		
		Caixa caixa = caixaRepository.pegaCaixa(Long.parseLong(baixas.getCaixa()));
		Float saldo = caixa.getSaldo();
		saldo = saldo+baixas.getValor();
		
		caixa.setSaldo(saldo);
		caixaRepository.save(caixa);
		
		if(tipoService.equals("mensalidade")) {
			Mensalidades mensalidades = mensalidadesRepository.pegaMens(regParcela);
			mensalidades.setLiquidacao(baixas.getDt_baixa());
			mensalidadesRepository.save(mensalidades);
		}else {
			ContasReceber contasReceber = contasReceberRepository.pegaRegConta(regParcela);
			contasReceber.setLiquidacao(baixas.getDt_baixa());
			contasReceberRepository.save(contasReceber);
		}
		
		Baixas baixa = baixasRepository.save(baixas);

		return new ResponseEntity<Baixas>(baixa, HttpStatus.OK);
	}
	
	@GetMapping(value = "pegaRegistro")
	@ResponseBody
	public List<?> pegaRegistro(@RequestParam(name = "idRec") Long idRec, @RequestParam(name = "tipo") String tipo){
		
		if (tipo.equals("mensalidade")) {
			List<?> mensalidade = mensalidadesRepository.pegaMensalidades(idRec);
			return mensalidade;
		}else {
			List<?> contasReceber = contasReceberRepository.pegaConta(idRec);
			return contasReceber;
		}
	}
	
	@GetMapping(value = "pegaContas")
	@ResponseBody
	public ResponseEntity<ContasReceber> pegaContas(@RequestParam (name = "idRec") Long idRec){
		
		ContasReceber contasReceber = contasReceberRepository.findByIdcontas(idRec);
		
		return new ResponseEntity<ContasReceber>(contasReceber, HttpStatus.OK);
	}
	
	@GetMapping(value = "pegaCaixa")
	@ResponseBody
	public ResponseEntity<List<Caixa>> pegaCaixa(){
		
		List<Caixa> caixas = caixaRepository.findAll();
		
		return new ResponseEntity<List<Caixa>>(caixas, HttpStatus.OK);
	}

}
