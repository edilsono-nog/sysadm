package br.com.sysadm.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Categorias;

@Repository
public interface CategoriasRepository extends JpaRepository<Categorias, Long>{

	@Query(value = "SELECT c FROM Categorias c WHERE upper(trim(descricao)) like %?1%")
	Page<Categorias> listaTodosaPagar(String upperCase, Pageable pageable);

	@Query(value = "SELECT c FROM Categorias c WHERE id = ?1")
	Categorias findByIdCategoria(Long idCategoria);

	@Query(value = "SELECT c FROM Categorias c WHERE upper(trim(tipo)) = ?1")
	List<Categorias> findByCategorias(String upperCase);

	@Query(nativeQuery = true, value = "select b.descricao, sum(a.valor) as valores from baixas a, categorias b "
									 + "where a.categoria=b.id and EXTRACT(month FROM a.dt_baixa) = ?1 "
									 + "group by b.descricao, b.tipo order by b.tipo, b.descricao")
	List<?> findByCategoria(int mes);

	@Query(nativeQuery = true, value = "SELECT b.descricao, sum(a.valor)/3 as valores from baixas a, categorias b "
									 + "WHERE EXTRACT(MONTH FROM a.dt_baixa) "
									 + "between DATE_PART('MONTH', CURRENT_DATE - interval '3 months') "
									 + "and DATE_PART('MONTH', CURRENT_DATE - interval '1 months') "
									 + "and a.categoria=b.id group by b.descricao, b.tipo order by b.tipo, b.descricao")
	List<?> findByCategoriaMedia();

	

}
