package br.com.sysadm.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Alunos;

@Repository
public interface AlunosRepository extends JpaRepository<Alunos, Long> {
	
	
	@Query(value = "select a from Alunos a where upper(trim(a.nome)) like %?1%")
	Page<Alunos> listAluno(String name, Pageable pageable);

	@Query(value = "select a from Alunos a where trim(a.status) = ?1")
	Page<Alunos> listAlunosStatus(String upperCase, Pageable pageable);

	@Query(value = "select a from Alunos a where trim(a.status) = ?1 and upper(trim(a.nome)) like %?2%")
	Page<Alunos> pesqAlunos(String status, String name, Pageable pageable);

	@Query(value = "select a from Alunos a where upper(trim(a.nome)) like %?1%")
	Page<Alunos> pesqAluno(String name, Pageable pageable);

	@Query(nativeQuery = true, value = "select a.nome as aluno, b.turno, b.escolas, c.nome as responsavel, "
										+ "c.celular as TelResp from alunos as a, matricula as b, aluno_responsavel as d, "
										+ "responsaveis as c where b.aluno_id = a.id and d.aluno_id = a.id "
										+ "and d.responsavel_id = c.id and d.responsavel_id = c.id "
										+ "order by b.turno, a.nome")
	List<Map> findByAluno();
	
	@Query(nativeQuery = true, value = "select a.nome as aluno, b.turno, b.escolas, c.nome as responsavel, "
										+ "c.celular as TelResp from alunos as a, matricula as b, aluno_responsavel as d, "
										+ "responsaveis as c where b.aluno_id = a.id and d.aluno_id = a.id "
										+ "and d.responsavel_id = c.id and d.responsavel_id = c.id "
										+ "and b.escolas = ?1 order by b.turno, a.nome")
	List<Map> findByAlunoEscola(String name);

	@Query(nativeQuery = true, value = "select a.nome as aluno, b.turno, b.escolas, c.nome as responsavel, "
										+ "c.celular as TelResp from alunos as a, matricula as b, aluno_responsavel as d, "
										+ "responsaveis as c where b.aluno_id = a.id and d.aluno_id = a.id "
										+ "and d.responsavel_id = c.id and d.responsavel_id = c.id "
										+ "and b.turno = ?1 order by b.turno, a.nome")
	List<Map> findByAlunoTurno(String name);

	

}
