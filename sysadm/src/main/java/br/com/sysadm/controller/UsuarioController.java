package br.com.sysadm.controller;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.sysadm.model.ConfigEmail;
import br.com.sysadm.model.Usuario;
import br.com.sysadm.repository.ConfigEmailRepository;
import br.com.sysadm.repository.UsuarioRepository;

@RestController
@RequestMapping(value = "/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private ConfigEmailRepository configEmailRepository;

	String codigo = null;

	@GetMapping(value = "listatodos")
	@ResponseBody
	public ResponseEntity<List<Usuario>> listatodos() {

		List<Usuario> usuarios = usuarioRepository.findAll();

		return new ResponseEntity<List<Usuario>>(usuarios, HttpStatus.OK);
	}

	@GetMapping(value = "buscarPorNome")
	@ResponseBody
	public ResponseEntity<List<Usuario>> buscarPorNome(@RequestParam(name = "name") String name) {

		List<Usuario> usuario = usuarioRepository.buscarPorNome(name.trim().toUpperCase());

		return new ResponseEntity<List<Usuario>>(usuario, HttpStatus.OK);

	}

	public String randomString(int length, String characterSet) {
		return IntStream.range(0, length).map(i -> new SecureRandom().nextInt(characterSet.length()))
				.mapToObj(randomInt -> characterSet.substring(randomInt, randomInt + 1)).collect(Collectors.joining());
	}

	@GetMapping(value = "enviacode")
	@ResponseBody
	public ResponseEntity<String> enviacode(@RequestParam(name = "user") String user) throws Exception {

		Usuario usuario = usuarioRepository.buscarUser(user);

		if (usuario == null) {
			return new ResponseEntity<String>("Usuário não encontrado", HttpStatus.OK);
		}

		for (int q = 0; q < 1; q++) {
			codigo = (randomString(6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")); // The character set can basically be
																				// anything
		}

		usuario.setCode(codigo);
		usuarioRepository.save(usuario);

		String nome = usuario.getNome();
		String email = usuario.getEmail();

		enviaEmail(codigo, email, nome);

		return new ResponseEntity<String>("Codigo enviado com sucesso...", HttpStatus.OK);
	}

	public void enviaEmail(String codigo, String email, String nome) throws Exception {

		StringBuilder stringBuilderTextoEmail = new StringBuilder();

		stringBuilderTextoEmail.append("Olá, <br/><br/>");
		stringBuilderTextoEmail.append("Você está recebendo codigo de verificação <br/><br/>");
		stringBuilderTextoEmail.append("Para Autorização de Alteração de 'Senha'. <br/><br/>");

		stringBuilderTextoEmail.append("<b>Codigo de Confirmação: </b> <br/><br/>");

		stringBuilderTextoEmail
				.append("<span style=\"font-size: 30px;  color: red;\"> <b>" + codigo + "</b> </span> <br/><br/>");

		stringBuilderTextoEmail.append("<span style=\"font-size: 10px;\">Ass.: SysAdm - Gestor Administrativo</span>");

		ObjetoEnviaEmail enviaEmail = new ObjetoEnviaEmail(email, "Administrador do Sistema", "Codigo de Verificação",
				stringBuilderTextoEmail.toString());

		ConfigEmail configemail = configEmailRepository.pegaconfig("email");

		enviaEmail.enviarEmail(true, configemail);

	}

	@GetMapping(value = "verifcode")
	@ResponseBody
	public ResponseEntity<String> verifcode(@RequestParam(name = "user") String user,
			@RequestParam(name = "codigo") String codigo) {
		
		Usuario usuario = usuarioRepository.verifcodigo(user, codigo);
		
		if (usuario == null) {
			return new ResponseEntity<String>("Codigo não confere, favor verificar", HttpStatus.OK);
		}

		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	@PutMapping(value = "autsenha")
	@ResponseBody
	public ResponseEntity<String> autsenha(@RequestParam(name = "user") String user,
			@RequestParam(name = "codigo") String codigo, @RequestParam(name = "password") String password) {
	
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String result = encoder.encode(password);
		
		Usuario usuario = usuarioRepository.verifcodigo(user, codigo);
		
		usuario.setCode("");
		usuario.setSenha(result);
		
		
		usuarioRepository.save(usuario);
		
		
		return new ResponseEntity<String>("Senha atualizada com sucesso...", HttpStatus.OK);
	}
	
	@PutMapping(value = "autsenhatela")
	@ResponseBody
	public ResponseEntity<String> autsenhatela(@RequestParam(name = "user") String user,
			 @RequestParam(name = "password") String password) {
	
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String result = encoder.encode(password);
		
		Usuario usuario = usuarioRepository.pegauser(user);
		
		usuario.setCode("");
		usuario.setSenha(result);
		
		
		usuarioRepository.save(usuario);
		
		
		return new ResponseEntity<String>("Senha atualizada com sucesso...", HttpStatus.OK);
	}
}
