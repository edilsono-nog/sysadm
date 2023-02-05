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

import br.com.sysadm.model.Categorias;
import br.com.sysadm.repository.CategoriasRepository;

@RestController
@RequestMapping(value = "/categorias")
public class CategoriasController {
	
	@Autowired
	private CategoriasRepository categoriasRepository;
	
	@GetMapping(value = "listacategorias")
	@ResponseBody
	public Page<Categorias> listacontasapagar(@RequestParam(name = "name") String name, Pageable pageable) {
		
		if(name == "") {
			Page<Categorias> contasaPagars = categoriasRepository.findAll(pageable);
			return contasaPagars;
		}else {
			Page<Categorias> page = categoriasRepository.listaTodosaPagar(name.trim().toUpperCase(), pageable);
			return page;
		}
	}
	
	@PostMapping(value = "salvar")
	@ResponseBody 
	public ResponseEntity<Categorias> salvar(@RequestBody Categorias categorias){
		
		Categorias categoria = categoriasRepository.save(categorias);
		
		return new ResponseEntity<Categorias>(categoria, HttpStatus.OK);
	}
	
	@GetMapping(value = "buscarcategoriaid")
	@ResponseBody
	public ResponseEntity<Categorias> buscarcategoriaid(@RequestParam(name = "idCategoria") Long idCategoria){
		
		Categorias categorias = categoriasRepository.findByIdCategoria(idCategoria);
		
		return new ResponseEntity<Categorias>(categorias, HttpStatus.OK);
	}
	
	@GetMapping(value = "listacategoria")
	@ResponseBody
	public ResponseEntity<List<?>> listaCategoria(@RequestParam(name = "tipo") String tipo, 
													@RequestParam(name = "mes") String mes){
		
		List<?> categorias;
		
		if(tipo == "") {
			int mesAtual = Integer.parseInt(mes);
			categorias = categoriasRepository.findByCategoria(mesAtual);
		}else {
			categorias = categoriasRepository.findByCategorias(tipo.trim().toUpperCase());
		}
		
		
		return new ResponseEntity<List<?>>(categorias, HttpStatus.OK);
	}
	
	@GetMapping(value = "listacategoriaMedia")
	@ResponseBody
	public ResponseEntity<List<?>> listacategoriaMedia(){
		
		List<?> categorias = categoriasRepository.findByCategoriaMedia();
		
		
		return new ResponseEntity<List<?>>(categorias, HttpStatus.OK);
	}

}
