package br.com.sysadm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.Dto.PainelDto;
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
	public Page<Baixas> buscaBaixas(@RequestParam(name = "mes") String mes, 
									@RequestParam(name = "anoletivo") String anoletivo, Pageable pageable){
		
		int mesAtual = Integer.parseInt(mes);
		int anoAtual = Integer.parseInt(anoletivo);
		
		Page<Baixas> baixas = baixasRepository.pegaBaixas(anoAtual, mesAtual, pageable);
		
		return baixas;
	}
	
	@GetMapping(value = "/painel")
	@ResponseBody
	public Object painel(@RequestParam(name = "mes") String mes, 
						 @RequestParam(name = "anoletivo") String anoletivo){
		
		PainelDto painelDto = new PainelDto();
		
		int mesAtual = Integer.parseInt(mes);
		
		String sqlMatriculados = "SELECT count(a.id) as qtdeAtivos FROM Alunos a, matricula b "
								 + "WHERE b.aluno_id = a.id and b.anoletivo = '"+anoletivo+"' and a.status = 'Ativo'";
		
		String sqlMensalidades = "SELECT sum(b.valor) as mensalidades FROM Alunos a, Mensalidades b, Matricula c WHERE "
								 + "b.aluno_id=a.id and c.aluno_id = a.id and b.anoletivo = '"+anoletivo+"' "
								 + "and EXTRACT(month FROM b.vencimento) = "+mesAtual+" and a.status = 'Ativo'";
		
		String sqlRecebidas = "SELECT sum(b.valor) as recebidas FROM Alunos a, Mensalidades b, Matricula c "
							+ "WHERE b.aluno_id=a.id and c.aluno_id = a.id and b.anoletivo = '"+anoletivo+"' "
							+ "and EXTRACT(month FROM b.liquidacao) = "+mesAtual+" and a.status = 'Ativo' ";
		
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
