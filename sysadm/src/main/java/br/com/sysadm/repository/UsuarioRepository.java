package br.com.sysadm.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.com.sysadm.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	@Query("select u from Usuario u where u.login = ?1")
	Usuario findUserByLogin(String login);
	
	@Transactional
	@Modifying
	@Query(nativeQuery = true, value = "update Usuario set token = ?1 where login = ?2")
	void atualizaTokenUser(String token, String login);
	
	@Query(value = "select u from Usuario u where upper(trim(u.login)) like %?1%")
	List<Usuario> buscarPorNome (String name);

	@Query(value = "select u from Usuario u where u.login = ?1")
	Usuario buscarUser(String user);

	@Query(value = "Select u from Usuario u where u.login = ?1 and u.code = ?2")
	Usuario verifcodigo(String user, String codigo);

	@Query(value = "Select u from Usuario u where u.login = ?1")
	Usuario pegauser(String user);

	@Query(value = "select u from Usuario u where upper(trim(u.nome)) like %?1%")
	Page<Usuario> pesqUser(String upperCase, Pageable pageable);

	@Query(value = "select u from Usuario u where u.id = ?1")
	Usuario pegaUser(Long iduser);

	@Query(value="SELECT constraint_name from information_schema.constraint_column_usage  "
			+ "where table_name = 'usuarios_role' and column_name = 'role_id' and constraint_name <> 'unique_role_user';", 
			nativeQuery = true)
	String consultaConstraintRole();
	
	@Transactional
	@Modifying
	@Query(nativeQuery = true, value = "insert into usuarios_role (usuario_id, role_id) "
			+ "values(?1, ?2); ")
	void insereAcessoRolePadrao(Long id, Long role);

}
