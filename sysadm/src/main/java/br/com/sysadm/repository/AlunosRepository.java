package br.com.sysadm.repository;

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

}