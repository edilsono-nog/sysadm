package br.com.sysadm.model;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SequenceGenerator(name = "seq_capagar", sequenceName = "seq_capagar", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ContasaPagar implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_capagar")
	private Long id;
	private LocalDate emissao;
	private String descricao;
	private float parcelas;
	private float valor;
	private LocalDate vencimento;
	private LocalDate liquidacao;
	private String obs;

}
