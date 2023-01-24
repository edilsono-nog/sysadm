package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.ContasaPagar;

@Repository
public interface ContasaPagarRepository extends JpaRepository<ContasaPagar, Long> {

	@Query(value = "SELECT c FROM ContasaPagar c WHERE upper(trim(descricao)) like %?1% and c.liquidacao is null")
	Page<ContasaPagar> listaTodosaPagar(String name, Pageable pageable);

	@Query(value = "SELECT c FROM ContasaPagar c WHERE id = ?1")
	ContasaPagar findByConta(Long idRec);

	@Query(value = "SELECT c FROM ContasaPagar c WHERE c.liquidacao is null")
	Page<ContasaPagar> findAllContas(Pageable pageable);

}
