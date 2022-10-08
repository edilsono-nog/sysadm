package br.com.sysadm.model;

import java.io.Serializable;
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
@SequenceGenerator(name = "seq_configemail", sequenceName = "seq_configemail", allocationSize = 1, initialValue = 1)
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ConfigEmail implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_configemail")
	private Long id;
	private String servidor;
	private String email;
	private String senha;
	private String trust;
	private String auth;
	private String starttls;
	private String host;
	private String port;
	private String socketFactory_port;
	private String socketFactory_class;

}
