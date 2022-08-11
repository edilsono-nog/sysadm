package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.AnoLetivo;

@Repository
public interface AnoLetivoRepository extends JpaRepository<AnoLetivo, Long> {

	@Query(value = "select a from AnoLetivo a where upper(trim(a.ano)) like %?1%")
	Page<AnoLetivo> pesqAno(String name, Pageable pageable);

}
