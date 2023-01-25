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
import br.com.sysadm.model.Mensalidades;
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
	public Object painel(){
		PainelDto painelDto = new PainelDto();
		
		Date now = new Date();
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		int mes = calendar.get(Calendar.MONTH)+1;
		
		String sqlMatriculados = "SELECT count(id) as qtdeAtivos FROM Alunos WHERE status = 'Ativo'";
		String sqlMensalidades = "SELECT sum(b.valor) as mensalidades FROM Alunos a, Mensalidades b WHERE "
								 + "b.aluno_id=a.id and EXTRACT(month FROM b.vencimento) = "+mes
								 +" and a.status = 'Ativo' ";
		String sqlRecebidas = "SELECT sum(b.valor) as recebidas FROM Alunos a, Mensalidades b WHERE "
							  + "b.aluno_id=a.id and EXTRACT(month FROM b.liquidacao) = "+mes+" "
							  		+ "and a.status = 'Ativo' ";
		String sqlSaldo = "SELECT sum(saldo) as saldo FROM Caixa";
		
		String qtdeAtivos = jdbcTemplate.queryForObject(sqlMatriculados, String.class);
		Float mensalidade = jdbcTemplate.queryForObject(sqlMensalidades, Float.class);
		Float recebida = jdbcTemplate.queryForObject(sqlRecebidas, Float.class);
		Float saldos = jdbcTemplate.queryForObject(sqlSaldo, Float.class);
		
		painelDto.setMatriculados(qtdeAtivos);
		
		
		if(mensalidade == null) {
			painelDto.setTtl_mensalidades(0);
		}else {
			painelDto.setTtl_mensalidades(mensalidade);
		}
		
		if (recebida == null) {
			painelDto.setTtl_recebido(0);
		}else {
			painelDto.setTtl_recebido(recebida);
		}
		
		if (saldos == null) {
			painelDto.setSaldo(0);
		}else {
			painelDto.setSaldo(saldos);
		}
		
		return painelDto;
	}

}
