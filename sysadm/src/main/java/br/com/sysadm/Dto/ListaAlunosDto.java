package br.com.sysadm.Dto;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class ListaAlunosDto {
	
	private String nome;
	private String turno;
	private String escolas;
	
}
