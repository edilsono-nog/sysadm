package br.com.sysadm.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.com.sysadm.model.Mensalidades;

@Repository
public interface MensalidadesRepository extends JpaRepository<Mensalidades, Long> {

	@Query(value = "SELECT a.*, b.nome from Mensalidades a, Alunos b "
			+ "WHERE a.aluno_id=b.id and a.aluno_id = ?1 and a.anoletivo = ?2", nativeQuery = true)
	List<?> pegaMensalidades(long idAluno, String anoletivo);

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM Mensalidades WHERE aluno_id = ?1 and anoletivo = ?2")
	void removeparcelas(long idAluno, String anoletivo);

	@Query(nativeQuery = true, value = "select a.*, b.nome from mensalidades a, alunos b where a.aluno_id = b.id and a.liquidacao is null")
	Page<List<?>> findmensalidade(Pageable pageable);

	@Query(nativeQuery = true, value = "select a.*, b.nome from mensalidades a, alunos b where a.aluno_id = b.id "
			+ "and upper(trim(b.nome)) like %?1% and a.liquidacao is null")
	Page<List<?>> findmensalidadeName(String name, Pageable pageable);

	@Query(nativeQuery = true, value = "SELECT b.nome, a.*FROM mensalidades a, Alunos b "
										+ "WHERE a.aluno_id=b.id and a.id = ?1")
	List<?> pegaMensalidades(Long idRec);

	@Query(value = "SELECT m from Mensalidades m WHERE id = ?1")
	Mensalidades pegaMens(Long regParcela);

}
