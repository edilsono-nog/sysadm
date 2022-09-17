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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SequenceGenerator(name = "seq_alunos", sequenceName = "seq_alunos", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Alunos implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_alunos")
	private Long id;
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
	private String status;
	@OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Matricula> matricula = new ArrayList<Matricula>();	
	
	@OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Mensalidades> mensalidades = new ArrayList<Mensalidades>();	
	
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="aluno_responsavel",
				joinColumns = {@JoinColumn(name="aluno_id")},
				inverseJoinColumns = {@JoinColumn(name="responsavel_id")})
	private List<Responsaveis> responsaveis = new ArrayList<Responsaveis>();
}
