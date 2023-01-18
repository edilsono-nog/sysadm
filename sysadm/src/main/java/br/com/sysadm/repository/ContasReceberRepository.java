package br.com.sysadm.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.ContasReceber;

@Repository
public interface ContasReceberRepository extends JpaRepository<ContasReceber, Long> {

	@Query(value = "select c from ContasReceber c where upper(trim(c.descricao)) like %?1% and c.liquidacao is null")
	Page<ContasReceber> findContasName(String name, Pageable pageable);

	@Query(value = "SELECT c FROM ContasReceber c WHERE id = ?1")
	ContasReceber findByIdcontas(Long idRec);
	
	@Query(value = "SELECT c FROM ContasReceber c WHERE id = ?1")
	List<?> pegaConta(Long idRec);

	@Query(value = "SELECT c FROM ContasReceber c WHERE id = ?1")
	ContasReceber pegaRegConta(Long regParcela);

	@Query(value = "SELECT c FROM ContasReceber c WHERE c.liquidacao is null")
	Page<ContasReceber> findAllContas(Pageable pageable);

	


}
