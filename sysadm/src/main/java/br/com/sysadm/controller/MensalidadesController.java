package br.com.sysadm.controller;

import java.text.ParseException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.Dto.MensalidadesDTO;
import br.com.sysadm.model.Mensalidades;
import br.com.sysadm.service.MensalidadesService;

@RestController
@RequestMapping(value = "/mensalidade")
public class MensalidadesController {
	
	@Autowired
	private MensalidadesService mensalidadesService;
	
	@GetMapping(value = "listamensalidades")
    @ResponseBody
    private ResponseEntity<List<?>> listamensalidades(@RequestParam(name = "idAluno") String idAluno,
    														@RequestParam(name = "anoletivo") String anoletivo){
		
		List<?> mensalidades = mensalidadesService.listMensalidade(idAluno, anoletivo);
		
		return new ResponseEntity<List<?>>(mensalidades, HttpStatus.OK);
	}
	
	@PostMapping(value = "incMensalidade")
	@ResponseBody
	private ResponseEntity<Mensalidades> incMensalidades(@RequestBody MensalidadesDTO dto) throws ParseException{
		
			return mensalidadesService.incMensalidade(dto);
	}
	
	@DeleteMapping(value = "removeparcelas")
	@ResponseBody
	private ResponseEntity<String> removeParcelas(@RequestParam(name = "idAluno") String idAluno,
															@RequestParam(name = "anoletivo") String anoletivo){
		mensalidadesService.removeparcelas(idAluno, anoletivo);
		
		return new ResponseEntity<String>("Parcelas removidas com sucesso", HttpStatus.OK);
	}

}
