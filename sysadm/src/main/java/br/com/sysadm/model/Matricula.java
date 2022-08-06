package br.com.sysadm.model;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

import org.hibernate.annotations.ForeignKey;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@SuppressWarnings("deprecation")
@Entity
@SequenceGenerator(name = "seq_matricula", sequenceName = "seq_matricula", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Matricula implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_matricula")
	private Long id;
	@ManyToOne
	@JoinColumn(name = "aluno", nullable = false)
	@ForeignKey(name = "aluno_fk")
	private Alunos aluno;
	@OneToOne(cascade = CascadeType.ALL)
	@ForeignKey(name = "anoLetivo_fk")
	private AnoLetivo anoLetivo;
	@OneToOne(cascade = CascadeType.ALL)
	@ForeignKey(name = "escolas_fk")
	private Escolas escolas;
}
