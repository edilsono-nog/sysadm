package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.ConfigEmail;

@Repository
public interface ConfigEmailRepository extends JpaRepository<ConfigEmail, Long> {

}
