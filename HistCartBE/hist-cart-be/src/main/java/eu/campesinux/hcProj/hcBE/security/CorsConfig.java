package eu.campesinux.hcProj.hcBE.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@ConfigurationProperties(prefix = "configurazione.cors")
@ConfigurationPropertiesScan
@Configuration
public class CorsConfig {
	
	private String origin;
	
	@Bean
    WebMvcConfigurer corsConfigurer() {
		
        return new WebMvcConfigurer() {
        	
            @Override
            public void addCorsMappings(CorsRegistry registry) {
            	
            	String[] origins = {"*"};
            	
            	if (origin != null) {
            		origins = origin.split(",");
            	}
            	
                registry
                	.addMapping("/**")
                	.allowedMethods("*")
                	.allowedOrigins(origins);
            }
        };
    }
}
