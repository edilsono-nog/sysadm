package br.com.sysadm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Baixas;

@Repository
public interface BaixasRepository extends JpaRepository<Baixas, Long> {

	@Query(value = "SELECT b FROM Baixas b WHERE EXTRACT(month FROM b.dt_baixa) = ?1 order by b.dt_baixa")
	Page<Baixas> pegaBaixas(int mes, Pageable pageable);

}
