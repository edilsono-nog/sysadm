package br.com.sysadm.Dto;

import java.util.Date;

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
	/* Relatorios de Carteirinha e Lista de Alunos */
	private String aluno;
	private String turno;
	private String escolas;
	private String responsavel;
	private String telresp;
	private String turma;
	private Double venc;
	private Float valor;

	/* Resumo de Baixas */
	private String descricao;
	private Date dt_baixa;
	private String tipopgto;
	private String tipo;
	private String categorias;
	private String tipocategoria;
	
	/*Mensalidades*/
	private String nome;
	private Date vencimento;
	private Date liquidacao;

}
