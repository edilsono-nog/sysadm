package br.com.sysadm.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Baixas;

@Repository
public interface BaixasRepository extends JpaRepository<Baixas, Long> {

	@Query(value = "SELECT b FROM Baixas b WHERE EXTRACT(month FROM b.dt_baixa) = ?1 order by b.dt_baixa, b.descricao")
	Page<Baixas> pegaBaixas(int mes, Pageable pageable);

	@Query(nativeQuery = true, value = "select a.descricao, a.dt_baixa, a.tipopgto, a.valor, a.tipo, "
									+ "b.descricao as categorias,  b.tipo as tipocategoria from baixas a, "
									+ "categorias b where a.categoria = b.id and EXTRACT(month FROM a.dt_baixa) = ?1 "
									+ "GROUP BY a.descricao, a.dt_baixa, "
									+ "a.tipopgto, a.valor, a.tipo, b.descricao, b.tipo "
									+ "Order by b.tipo, b.descricao, a.dt_baixa, a.descricao ")
	List<Map> findByResumoBaixas(int mesAtual);

	@Query(nativeQuery = true, value = "select a.valor, a.vencimento, a.liquidacao, b.nome from mensalidades a, "
									 + "alunos b where a.aluno_id = b.id and EXTRACT(month FROM a.vencimento) = ?1 "
									 + "order by a.liquidacao, a.vencimento, b.nome")
	List<Map> findByResumoMensalidades(int mesAtual);

}
