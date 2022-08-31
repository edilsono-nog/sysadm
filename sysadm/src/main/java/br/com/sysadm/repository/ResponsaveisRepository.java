package br.com.sysadm.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Responsaveis;

@Repository
public interface ResponsaveisRepository extends JpaRepository<Responsaveis, Long> {

	@Query(value = "select r from Responsaveis r where upper(trim(r.nome)) like %?1%")
	Page<Responsaveis> pesqResponsavel(String upperCase, Pageable pageable);


}
