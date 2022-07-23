package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Alunos;

@Repository
public interface AlunosRepository extends JpaRepository<Alunos, Long> {

}
