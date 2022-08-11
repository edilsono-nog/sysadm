package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Escolas;

@Repository
public interface EscolasRepository extends JpaRepository<Escolas, Long> {

	@Query(value = "select r from Escolas r where upper(trim(r.escola)) like %?1%")
	Page<Escolas> pesqAno(String name, Pageable pageable);

}
