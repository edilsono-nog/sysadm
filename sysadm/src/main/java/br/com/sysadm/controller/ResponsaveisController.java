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

import br.com.sysadm.Dto.ResponsaveisDto;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.Responsaveis;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.repository.ResponsaveisRepository;
import br.com.sysadm.service.AlunosService;
import br.com.sysadm.service.ResponsaveisService;

@RestController
@RequestMapping(value = "/responsavel")
public class ResponsaveisController {
	
	@Autowired
	private ResponsaveisService responsaveisService;
	
	@Autowired
	private ResponsaveisRepository responsaveisRepository;
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private AlunosService alunosService;
	
	@GetMapping(value = "")
    @ResponseBody
    public Page<ResponsaveisDto> listaTodos(Pageable pageable){
		 
		return responsaveisService.listatodos(pageable);
		
    }
	
	@PostMapping(value = "salvar")
	 @ResponseBody
	 public ResponseEntity<Alunos> salvar(@RequestParam(name = "idAluno") String idAluno, 
			 								@RequestBody Responsaveis responsaveis ){
		
		responsaveisService.salvar(responsaveis);
		Long idresp = responsaveis.getId();
		
		if (String.valueOf(idresp) == "" || String.valueOf(idresp) == null) {
			Alunos aluno = alunosRepository.findById(Long.parseLong( idAluno )).get();
		
			aluno.getResponsaveis().add(responsaveis);
			aluno.setResponsaveis(aluno.getResponsaveis());
			
			 return alunosService.salvar(aluno);
		}
		return null;
	 }
	
	@GetMapping(value = "buscaresponsavelid")
    @ResponseBody
    public ResponseEntity<Responsaveis> buscaruserid (@RequestParam(name = "idResponsavel") Long idResponsavel){
		 return responsaveisService.pegaResponsavelId(idResponsavel);
    }
	
	@PostMapping(value = "associar")
	@ResponseBody
	public ResponseEntity<String> associar(@RequestParam(name = "idAluno") String idAluno, 
													@RequestParam(name = "idResponsavel") String idResponsavel){
	
			Alunos aluno = alunosRepository.findById(Long.parseLong( idAluno )).get();
			Long idresp = Long.parseLong( idResponsavel );
			
			List<Responsaveis> alunoresp = aluno.getResponsaveis();
			
			for(int i = 0; i < alunoresp.size(); i++) {
				
				if(alunoresp.get(i).getId() == idresp)  {
					return new ResponseEntity<String> ("Responsável já associado ...", HttpStatus.BAD_REQUEST);
				}
			}
		
			Responsaveis responsaveis = responsaveisRepository.findById(Long.parseLong( idResponsavel )).get();
			
			aluno.getResponsaveis().add(responsaveis);
			aluno.setResponsaveis(aluno.getResponsaveis());
			
			alunosService.salvar(aluno);	
			
			return new ResponseEntity<String> ("Associando Responsável / Aluno .... ", HttpStatus.OK);
	}
	
	@GetMapping(value = "pesqResponsaveis")
    @ResponseBody
    public Page<ResponsaveisDto> pesqResponsavel(@RequestParam(name = "name") String name, Pageable pageable){
		 
		return responsaveisService.pesqResponsavel(name, pageable); 
    }
	
	@GetMapping(value = "pegaalunos")
	@ResponseBody
	public List<?> pegaAlunos(@RequestParam(name = "idResponsavel") String idResponsavel){
		
		return responsaveisRepository.listAlunos(Long.parseLong( idResponsavel ));

	}

}
