package br.com.sysadm.controller;

import java.util.List;

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

import br.com.sysadm.model.Escolas;
import br.com.sysadm.service.EscolasService;

@RestController
@RequestMapping(value = "/escolas")
public class EscolasController {

	@Autowired
	private EscolasService escolasService;
	
	@PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Escolas> salvar(@RequestBody Escolas escolas ){
		 return escolasService.salvar(escolas);
	 }
	
	@GetMapping(value = "listatodos")
   @ResponseBody
   public Page<Escolas> escolas(Pageable pageable){
		 return escolasService.listatodos(pageable);
   }
	
	@GetMapping(value = "listaEscola")
    @ResponseBody
    public ResponseEntity<List<Escolas>> listaEscola(){
		 return escolasService.listaEscola();
    }
	
	@GetMapping(value = "buscarescolaid")
   @ResponseBody
   public ResponseEntity<Escolas> buscarescolaid (@RequestParam(name = "idescola") Long idescola){
		 return escolasService.pegaEscolaId(idescola);
   }
	 
	 
	 @GetMapping(value = "pesqEscola")
   @ResponseBody
   public Page<Escolas> pesqEscolas(@RequestParam(name = "name") String name, Pageable pageable){
		 return escolasService.pesqEscola(name, pageable);
   }
}
