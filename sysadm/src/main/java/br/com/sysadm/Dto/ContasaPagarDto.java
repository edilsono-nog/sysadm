package br.com.sysadm.Dto;

import java.time.LocalDate;

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
public class ContasaPagarDto {

	private LocalDate emissao;
	private String descricao;
	private Float parcelas;
	private float valor;
	private LocalDate vencimento;
	private LocalDate liquidacao;
	private String obs;

}
