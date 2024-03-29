package br.com.sysadm.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SequenceGenerator(name = "seq_responsaveis", sequenceName = "seq_responsaveis", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Responsaveis implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_responsaveis")
	private Long id;
	private String tipo;
	private String financeiro;
	private String nome;
	private LocalDate dt_nasc;
	private String email;
	private String cep;
	private String logradouro;
	private String complemento;
	private String bairro;
	private String localidade;
	private String uf;
	private String telefone;
	private String celular;
	private String cpf;
	private String rg;
	
	@ManyToMany(mappedBy = "responsaveis", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Alunos> alunos = new ArrayList<Alunos>();
	
	@OneToMany(mappedBy = "responsavel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Mensalidades> mensalidades = new ArrayList<Mensalidades>();
	

}
