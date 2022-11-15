package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.ConfigEmail;

@Repository
public interface ConfigEmailRepository extends JpaRepository<ConfigEmail, Long> {

	@Query("Select e from ConfigEmail e where servidor = ?1")
	ConfigEmail pegaconfig(String string);

}
