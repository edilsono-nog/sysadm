package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Baixas;

@Repository
public interface baixasRepository extends JpaRepository<Baixas, Long> {

}
