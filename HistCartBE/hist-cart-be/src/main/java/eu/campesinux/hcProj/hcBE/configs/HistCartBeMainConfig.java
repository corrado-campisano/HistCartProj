package eu.campesinux.hcProj.hcBE.configs;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "main-config")
@Getter @Setter
public class HistCartBeMainConfig {
	
	// TODO : try take message from the POM, using project.description and project.version 
	// TODO : try using https://www.baeldung.com/configuration-properties-in-spring-boot#3-custom-converter
	private String welcomeMessage;
}
