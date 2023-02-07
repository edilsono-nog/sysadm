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
public class GeraRelatoriosDto {
	
	private String aluno;
	private String turno;
	private String escolas;
	private String responsavel;
	private String telresp;
	private String turma;
	private Double venc;
	private Float valor;
	
}
