package br.com.sysadm.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.Responsaveis;

@Repository
public interface ResponsaveisRepository extends JpaRepository<Responsaveis, Long> {

	@Query(value = "select r from Responsaveis r where upper(trim(r.nome)) like %?1%")
	Page<Responsaveis> pesqResponsavel(String upperCase, Pageable pageable);

	@Query(value= "select b.* from aluno_responsavel a, Alunos b "
			+ "where a.aluno_id = b.id and a.responsavel_id = ?1", nativeQuery = true)
	/*@Query(nativeQuery = true, value= "select * from alunos "
			+ "inner join aluno_responsavel on alunos.id = aluno_responsavel.aluno_id "
			+ "where aluno_responsavel.responsavel_id = ?1")*/
	List<?> listAlunos(long parseLong);

	@Query(value = "SELECT a.* FROM Responsaveis a, aluno_responsavel b "
			+ "where b.responsavel_id = a.id and b.aluno_id = ?1 and a.financeiro = 'Sim'", nativeQuery = true)
	Responsaveis pegaResp(long idAluno);

	


}
