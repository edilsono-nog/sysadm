package br.com.sysadm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EntityScan(basePackages = {"br.com.sysadm.model"})
@ComponentScan(basePackages = {"br.*"})
@EnableJpaRepositories(basePackages = {"br.com.sysadm.repository"})
@EnableTransactionManagement
@RestController
@EnableAutoConfiguration
@EnableCaching
public class SysadmApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(SysadmApplication.class, args);
	}
	
	public void addCorsMappings(CorsRegistry registry) {
		
		registry.addMapping("/**").allowedMethods("*").allowedOrigins("*");

	}
	
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	     registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
	     registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
	     registry.addResourceHandler("/imagem/**").addResourceLocations("classpath:/static/imagem/");
	     registry.addResourceHandler("/assets/js/**").addResourceLocations("classpath:/static/assets/js/");
	     registry.addResourceHandler("/assets/css/**").addResourceLocations("classpath:/static/assets/css/");
	     registry.addResourceHandler("/assets/imagem/**").addResourceLocations("classpath:/static/assets/imagem/");
	     
	 }


}
