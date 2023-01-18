package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Caixa;

@Repository
public interface CaixaRepository extends JpaRepository<Caixa, Long> {

	@Query(value = "select c from Caixa c where upper(trim(c.descricao)) like %?1%")
	Page<Caixa> pesqAno(String upperCase, Pageable pageable);

	@Query(value = "Select c from Caixa c where id = ?1")
	Caixa pegaCaixa(long parseLong);


}
