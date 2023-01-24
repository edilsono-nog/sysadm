package br.com.sysadm.repository;

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

}
