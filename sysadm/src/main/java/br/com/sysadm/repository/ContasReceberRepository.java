package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.ContasReceber;

@Repository
public interface ContasReceberRepository extends JpaRepository<ContasReceber, Long> {

	@Query(value = "select c from ContasReceber c where upper(trim(c.descricao)) like %?1%")
	Page<ContasReceber> findContasName(String name, Pageable pageable);

}
