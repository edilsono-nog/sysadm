package br.com.sysadm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

}
