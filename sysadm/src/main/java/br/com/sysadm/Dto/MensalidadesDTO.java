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
public class MensalidadesDTO {
	
	private String anoletivo;
	private String idAluno;
	private Float valor;
	private Float parcelas;
	private String vencimento;
	private String responsavel;

}
