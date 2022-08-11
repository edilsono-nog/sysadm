package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.AnoLetivo;
import br.com.sysadm.service.AnoLetivoService;

@RestController
@RequestMapping(value = "/anoletivo")
public class AnoLetivoController {

	@Autowired
	private AnoLetivoService anoLetivoService;
	
	@PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<AnoLetivo> salvar(@RequestBody AnoLetivo anoLetivo ){
		 return anoLetivoService.salvar(anoLetivo);
	 }
	
	@GetMapping(value = "listatodos")
    @ResponseBody
    public Page<AnoLetivo> anoLetivo(Pageable pageable){
		 return anoLetivoService.listatodos(pageable);
    }
	
	@GetMapping(value = "buscaranoid")
    @ResponseBody
    public ResponseEntity<AnoLetivo> buscaranoid (@RequestParam(name = "idano") Long idano){
		 return anoLetivoService.pegaAnoId(idano);
    }
	 
	 
	@GetMapping(value = "pesqAnoLetivo")
    @ResponseBody
    public Page<AnoLetivo> pesqAnoLetivo(@RequestParam(name = "name") String name, Pageable pageable){
		 return anoLetivoService.pesqAno(name, pageable);
    }
}
