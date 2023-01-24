package br.com.sysadm.controller;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.Dto.PainelDto;
import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.Baixas;
import br.com.sysadm.repository.BaixasRepository;

@RestController
@RequestMapping(value = "/dashboard")
public class DashboardController {
	
	@Autowired
	private BaixasRepository baixasRepository;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@GetMapping(value = "/buscaBaixas")
	@ResponseBody
	public Page<Baixas> buscaBaixas(Pageable pageable){
		
		Date now = new Date();
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		int mes = calendar.get(Calendar.MONTH)+1;
		
		Page<Baixas> baixas = baixasRepository.pegaBaixas(mes, pageable);
		
		return baixas;
	}
	
	@GetMapping(value = "/painel")
	@ResponseBody
	public Object painel( ){
		PainelDto painelDto = new PainelDto();
		
		Date now = new Date();
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		int mes = calendar.get(Calendar.MONTH)+1;
		
		String sqlMatriculados = "SELECT count(id) as qtdeAtivos FROM Alunos WHERE status = 'Ativo'";
		String sqlMensalidades = "SELECT sum(b.valor) as mensalidades FROM Alunos a, Mensalidades b WHERE "
								 + "b.aluno_id=a.id and EXTRACT(month FROM b.vencimento) = "+mes
								 +" and a.status = 'Ativo' ";
		String sqlRecebidas = "SELECT sum(b.valor) as mensalidades FROM Alunos a, Mensalidades b WHERE "
							  + "b.aluno_id=a.id and EXTRACT(month FROM b.vencimento) = "+mes+" "
							  + "and EXTRACT(month FROM b.liquidacao) = "+mes+" and a.status = 'Ativo' ";
		String sqlSaldo = "SELECT sum(saldo) as saldo FROM Caixa";
		
		Map<String, Object> matriculados = jdbcTemplate.queryForMap(sqlMatriculados);
		Map<String, Object> mensalidades = jdbcTemplate.queryForMap(sqlMensalidades);
		Map<String, Object> recebidas = jdbcTemplate.queryForMap(sqlRecebidas);
		Map<String, Object> saldos = jdbcTemplate.queryForMap(sqlSaldo);
		
		painelDto.setMatriculados((String)matriculados.get("qtdeAtivos").toString());
		painelDto.setTtl_mensalidades((Float)mensalidades.get("mensalidades"));
		painelDto.setTtl_recebido((Float)recebidas.get("mensalidades"));
		painelDto.setSaldo((Float)saldos.get("saldo"));
		
		return painelDto;
	}

}
