package br.com.sysadm.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SequenceGenerator(name = "seq_mensalidades", sequenceName = "seq_mensalidades", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Mensalidades implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_mensalidades")
	private Long id;
	@JoinColumn(name = "aluno_id")
	@ManyToOne(fetch = FetchType.EAGER)
	@JsonIgnore
	private Alunos aluno;
	private Date emisao;
	@JoinColumn(name = "responsavel_id")
	@ManyToOne(fetch = FetchType.EAGER)
	@JsonIgnore
	private Responsaveis responsavel;
	private float valor;
	private float parcela;
	private String anoletivo;
	private Date vencimento;
	private Date liquidacao;
	

}
