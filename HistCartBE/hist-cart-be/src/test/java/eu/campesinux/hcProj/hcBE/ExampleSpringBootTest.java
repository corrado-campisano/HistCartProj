package eu.campesinux.hcProj.hcBE;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import eu.campesinux.hcProj.hcBE.configs.HistCartBeDbConfig;
import eu.campesinux.hcProj.hcBE.configs.HistCartBeDdlConfig;
import eu.campesinux.hcProj.hcBE.configs.HistCartBeMainConfig;
import lombok.extern.apachecommons.CommonsLog;

// a test annotated with @SpringBootTest will bootstrap the full application context, 
// which means we can @Autowire any bean that’s picked up by component scanning into our test
@SpringBootTest

// this overrides some test-DB-related properties in /src/main/resources/application.properties
@TestPropertySource(locations = "classpath:/application-SpringBootTest.properties")

// other annotations
@CommonsLog

// all tests use this test-methods naming convention: ClassName_MethodName_StateUnderTest_ExpectedBehavior 
// see: https://medium.com/@stefanovskyi/unit-test-naming-conventions-dd9208eadbea
class ExampleSpringBootTest {
	
	@Autowired
	HistCartBeMainConfig mainConfig;
	@Autowired
	HistCartBeDdlConfig ddlConfig;
	@Autowired
	HistCartBeDbConfig dbConfig;
	
	@Test
	void HistCartBeApplication_ContextLoads_CanAccessConfigs_True() {
		log.info("Example test of type (annotated as) @SpringBootTest being run, "
				+ "it will bootstrap the full application context...");
		
		log.info("...which means it also connects to the in-memory test-DB and acts on it, "
				+ "depending on 'spring.jpa.hibernate.ddl-auto' setting:");
		
		log.info("\t the database URL is: " + dbConfig.getUrl());
		log.info("\t the database DDL-AUTO policy is: " + ddlConfig.getDdlAuto());
		
		log.info("...example test of type (annotated as) @SpringBootTest ran OK, " + mainConfig.getWelcomeMessage());
	}
	
}
