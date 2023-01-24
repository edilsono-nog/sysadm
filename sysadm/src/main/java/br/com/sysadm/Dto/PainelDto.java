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
public class PainelDto {

	private String matriculados;
	private float ttl_mensalidades;
	private float ttl_recebido;
	private float saldo;
	
}
