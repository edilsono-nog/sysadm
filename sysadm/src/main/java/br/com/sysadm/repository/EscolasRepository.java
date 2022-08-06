package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Escolas;

@Repository
public interface EscolasRepository extends JpaRepository<Escolas, Long> {

}
