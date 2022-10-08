package br.com.sysadm.security;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import br.com.sysadm.ApplicationContextLoad;
import br.com.sysadm.model.Usuario;
import br.com.sysadm.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
@Component
public class JWTTokenAutenticacaoService {
	
	/*Tempo de validade do Token 1 dias*/
	private static final long EXPIRATION_TIME = 86400000;
	
	/*Uma senha unica oara compor a autenticação e ajudar na segurança*/
	private static final String SECRET = "SenhaExtremamenteSecreta";
	
	/*Prefixo padrão de Token*/
	private static final String TOKEN_PREFIX = "Bearer";
	
	private static final String HEADER_STRING = "Authorization";
	
	/*Gerando token de autenticação e adicionando ao cabeçalho e resposta Http*/
	public void addAuthentication(HttpServletResponse response, String username) throws IOException {
		
		/*Montagem do Token*/
		String JWT = Jwts.builder()/*Chama o gerador de Token*/
						.setSubject(username)/*Adiciona o usuário*/
						.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))/*Tempo de expiração*/
						.signWith(SignatureAlgorithm.HS512, SECRET).compact();/*Compactação e algoritimo de geração de senha*/
		
		/*Junta token com o prefixo*/
		String token = TOKEN_PREFIX + " "+JWT;
		
		/*Adiciona no cabeçalho http*/
		response.addHeader(HEADER_STRING, token);
		
		ApplicationContextLoad.getApplicationContext()
		.getBean(UsuarioRepository.class).atualizaTokenUser(JWT, username);
		
		/*Liberando resposta para portas diferentes que usam a API ou caso clientes web*/
		LiberacaoCors(response);
		
		/*Escreve token como responsta no corpo http*/
		response.getWriter().write("{\"Authorization\": \""+token+"\"}");
		
	}
	
	/*Retorna o usuario validado com token ou caso não sejá valido retorna null*/
	public Authentication getAuthentication(HttpServletRequest request, HttpServletResponse response) {
		
		/*Pega o token enviado no cabeçalh http*/
		String token = request.getHeader(HEADER_STRING);
		
		try {
		if (token != null) {
			
			String tokenLimpo = token.replace(TOKEN_PREFIX, "").trim();
			
			/*Faz a validação do token do usuario na requisição*/
			String user = Jwts.parser().setSigningKey(SECRET)
							.parseClaimsJws(tokenLimpo)
							.getBody().getSubject();
			if(user != null) {
				
				Usuario usuario = ApplicationContextLoad.getApplicationContext()
								.getBean(UsuarioRepository.class).findUserByLogin(user);
				
				if (usuario != null) {
					
					if(tokenLimpo.equals(usuario.getToken())) {
						return new UsernamePasswordAuthenticationToken(
								usuario.getLogin(),
								usuario.getSenha(),
								usuario.getAuthorities());
					}
				}
			}
		}
		}catch (io.jsonwebtoken.ExpiredJwtException e) {
			try {
				response.getOutputStream().println("Seu TOKEN está expirado, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO");
			} catch (IOException e1) {}
		}
		
		LiberacaoCors(response);
		return null;/*Não Autorizado*/
	}

	private void LiberacaoCors(HttpServletResponse response) {
		
		if (response.getHeader("Access-Control-Allow-Origin") == null) {
			response.addHeader("Access-Control-Allow-Origin", "*");
		}
		
		if (response.getHeader("Access-Control-Allow-Headers") == null) {
			response.addHeader("Access-Control-Allow-Headers", "*");
		}
		
		if (response.getHeader("Access-Control-Request-Headers") == null) {
			response.addHeader("Access-Control-Request-Headers", "*");
		}
		
		if (response.getHeader("Access-Control-Allow-Methods") == null) {
			response.addHeader("Access-Control-Allow-Methods", "*");
		}
	}
}
