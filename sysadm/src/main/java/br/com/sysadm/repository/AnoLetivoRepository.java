package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.AnoLetivo;

@Repository
public interface AnoLetivoRepository extends JpaRepository<AnoLetivo, Long> {

}
