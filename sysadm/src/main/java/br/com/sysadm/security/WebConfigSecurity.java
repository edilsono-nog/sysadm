package br.com.sysadm.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import br.com.sysadm.service.ImplementacaoUserDetailsService;

/*Mapeia URL, endereços, autoriza oubloqueia acessos a URL*/
@Configuration
@EnableWebSecurity
public class WebConfigSecurity extends WebSecurityConfigurerAdapter {

	@Autowired
	private ImplementacaoUserDetailsService implementacaoUserDetailsService;
	
	/*Configura as solicitações de acesso por Http*/
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		/*Ativando a proteção contra usuário que não estão validados por token*/
		http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
		
		/*Ativando a permissão para acesso a página inicial do sistema EX: sistema.com.br/index.html*/
		.disable().authorizeRequests().antMatchers("/").permitAll()
		.antMatchers("/index", "/login","/templates/**","/dashboard").permitAll()
		.antMatchers("/alunos/**", "/alunos_listagem", "/alunos_ficha", "/alunos_cadastro", "/mensalidade/**", "/listamensalidades").permitAll()
		.antMatchers("/responsaveis/**", "/responsavel_listagem", "/responsavel_cadastro", "/responsavel_ficha").permitAll()
		.antMatchers("/config/**", "/anoletivo", "/anoletivocad", "/escolaslist", "/escolascad", "/configuracoes").permitAll()
		.antMatchers("/configemail").permitAll()
		.antMatchers("/css/**","/js/**", "/imagem/**").permitAll()
		.antMatchers("/assets/css/**","/assets/js/**", "/assets/imagem/**").permitAll()
		
		.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
		
		/*URL de lougout - Redireciona após user deslogar do sistema*/
		.anyRequest().authenticated().and().logout().logoutSuccessUrl("/index")
		
		/*Mapeia URL de logout e invalida o usuário*/
		.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
		
		/*Filtra requisição de login para autenticação*/
		.and().addFilterBefore(new JWTLoginFilter("/login1", authenticationManager()), 
								 UsernamePasswordAuthenticationFilter.class)
		
		/*Filtra demais requisições para verificar a presença do TOKEN JWT no HEADER HTTP*/
		.addFilterBefore(new JWTApiAutenticacaoFilter(), UsernamePasswordAuthenticationFilter.class);
	
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		
		/*Service que irá consultar o usuário no banco de dados*/
		auth.userDetailsService(implementacaoUserDetailsService)
		
		/*Padrão de codificação de senha*/
		.passwordEncoder(new BCryptPasswordEncoder());
	}
	
}
