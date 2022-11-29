package br.com.sysadm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.sysadm.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
