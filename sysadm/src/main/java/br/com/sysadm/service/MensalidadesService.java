package br.com.sysadm.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.sysadm.Dto.MensalidadesDTO;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.Mensalidades;
import br.com.sysadm.model.Responsaveis;
import br.com.sysadm.repository.AlunosRepository;
import br.com.sysadm.repository.MensalidadesRepository;
import br.com.sysadm.repository.ResponsaveisRepository;

@Service
public class MensalidadesService {
	
	@Autowired
	private MensalidadesRepository mensalidadesRepository;
	
	@Autowired
	private AlunosRepository alunosRepository;
	
	@Autowired
	private ResponsaveisRepository responsaveisRepository;

	public List<?> listMensalidade(String idAluno, String anoletivo) {
		List<?> mensalidades = mensalidadesRepository.pegaMensalidades(Long.parseLong(idAluno), anoletivo);
		return mensalidades;
	}

	public ResponseEntity<Mensalidades> incMensalidade(MensalidadesDTO dto) throws ParseException {

		Mensalidades mensalidade = new Mensalidades();
		Responsaveis responsaveis = new Responsaveis();
		
		Alunos aluno = alunosRepository.findById(Long.parseLong(dto.getIdAluno())).get();
		
		if( dto.getResponsavel() == "" || dto.getResponsavel() == null) {
			responsaveis = responsaveisRepository.pegaResp(Long.parseLong(dto.getIdAluno()) );
		}else {
			responsaveis = responsaveisRepository.findById(Long.parseLong(dto.getResponsavel())).get();
		}
		
				
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");		
		
		Date now = new Date();
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDateTime = dto.getVencimento().format(dateTimeFormatter);
        Date venc = sdf.parse(formattedDateTime);
	//	Date venc = sdf.parse(dto.getVencimento());
		
		int mes = 0;
		Calendar calendar =  sdf.getCalendar();
		calendar.setTime(venc);
		
		for (int i = 0; i < dto.getParcelas(); i++) {
			calendar.add(Calendar.MONTH, mes);
			LocalDate localDate = calendar.getTime().toInstant().atZone( ZoneId.systemDefault() ).toLocalDate();
			mensalidade.setVencimento(localDate);
			mensalidade.setValor(dto.getValor());
			LocalDate localDatenow = now.toInstant().atZone( ZoneId.systemDefault() ).toLocalDate();
			mensalidade.setEmisao(localDatenow);
			mensalidade.setAluno(aluno);
			mensalidade.setResponsavel(responsaveis);
			mensalidade.setParcela(i+1);
			mensalidade.setAnoletivo(dto.getAnoletivo());
			
			mensalidadesRepository.save(mensalidade);
			mes = 1;
			mensalidade = new Mensalidades();
		}
		
		return null;
	}

	public ResponseEntity<String> removeparcelas(String idAluno, String anoletivo) {
		
		mensalidadesRepository.removeparcelas(Long.parseLong(idAluno), anoletivo);
		
		return null;
	}

	

}
