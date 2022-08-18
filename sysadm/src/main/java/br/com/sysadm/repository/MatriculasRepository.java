package br.com.sysadm.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Alunos;
import br.com.sysadm.model.AnoLetivo;
import br.com.sysadm.model.Escolas;
import br.com.sysadm.model.Matricula;

@Repository
public interface MatriculasRepository extends JpaRepository<Matricula, Long> {

	//@Query(value = "insert into Matricula (id, aluno, anoLetivo, escolas, turma, turno) values (:?1, :?2, :?3, :?4, :?5, :?6)", nativeQuery = true)
	//Matricula incMatricula(String idMatricula, String aluno, String anoLetivo, String escola, String turma, String turno);

	@Query(value = "SELECT MAX(m.id)+1 as newid FROM Matricula m")
	Long pegaId();

	@Transactional
	@Query(value = "insert into Matricula (id, turma, turno, aluno, ano_letivo_id, escolas_id) values (?1, ?2, ?3, ?4, ?5, ?6)", nativeQuery = true)
	Matricula incMatricula(Long id, String turma, String turno, Alunos aluno, AnoLetivo anoLetivo, Escolas escolas);

	

	
	

}
