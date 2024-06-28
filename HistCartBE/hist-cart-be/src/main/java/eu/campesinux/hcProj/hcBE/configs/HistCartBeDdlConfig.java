package eu.campesinux.hcProj.hcBE.configs;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "spring.jpa.hibernate")
@Getter @Setter
public class HistCartBeDdlConfig {
	
	private String ddlAuto;
}
