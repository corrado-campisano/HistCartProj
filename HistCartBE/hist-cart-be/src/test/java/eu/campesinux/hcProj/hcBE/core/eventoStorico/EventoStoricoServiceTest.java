package eu.campesinux.hcProj.hcBE.core.eventoStorico;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import javax.persistence.EntityNotFoundException;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.function.Executable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoModel;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import lombok.extern.apachecommons.CommonsLog;

//a test annotated with @SpringBootTest will bootstrap the full application context, 
//which means we can @Autowire any bean that’s picked up by component scanning into our test
@SpringBootTest

//this overrides some test-DB-related properties in /src/main/resources/application.properties
@TestPropertySource(locations = "classpath:/application-SpringBootTest.properties")

//other annotations
@CommonsLog

//ordering methods inside the test class with @Order(n)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)

// using this test-methods naming convention: ClassName_MethodName_StateUnderTest_ExpectedBehavior, see: 
// https://medium.com/@stefanovskyi/unit-test-naming-conventions-dd9208eadbea
public class EventoStoricoServiceTest {
		
	@Autowired
	EventoStoricoService service;
	
	EventoStorico savedEntity;
	EventoStorico retrievedEntity;
	
	@Test
	@Order(1)
	void EventoStoricoService_SaveFromModel_EmptyModel_False() {
		
		log.info("Creating empty model");
		EventoStoricoModel model = new EventoStoricoModel();
		
		// with an empty model, it should return ConstraintViolationException
		//Class<? extends Exception > expectedException = ConstraintViolationException.class;
		
		// now there is validation involved...
		Class<? extends Exception > expectedException = ModelsValidationException.class;
		
		Executable executableCommand = new Executable() {
			@Override
			public void execute() throws Throwable {
				
				log.info("calling service.saveFromModel with empty model...");
				EventoStorico savedEntity = service.saveFromModel(model);
				
				log.error("...the test expected a '" + expectedException.getCanonicalName() 
					+ "' exception, " + "while the entity got saved with ID: " + savedEntity.getId());
			}
		};
		
		Exception ret = assertThrows(expectedException, executableCommand);
		
		log.info("...the test got the expected exception: " + ret.getLocalizedMessage()
			+ ", with message: " + ret.getLocalizedMessage());
	}
	
	@Test
	@Order(2)
	void EventoStoricoService_SaveFromModel_ValidModel_True() {
		
		log.info("Creating valid model");
		EventoStoricoModel model = new EventoStoricoModel();
		model.setDescrizione("valid description");
		model.setLatitude(BigDecimal.valueOf(30.4322));
		model.setLongitude(BigDecimal.valueOf(40.4322));
		model.setDate("2023-12-21");
		model.setWikiLink("https://it.wikipedia.org/wiki/Mezio_Fufezio");
		
		Executable executableCommand = new Executable() {
			@Override
			public void execute() throws Throwable {
				
				log.info("calling service.saveFromModel with valid model...");
				savedEntity = service.saveFromModel(model);
				
				log.info("...the test expected no exceptions, and that happened, "
					+ "as the persisted entity has ID: " + savedEntity.getId());
			}
		};
		
		// with a valid model, it should return no exception
		assertDoesNotThrow(executableCommand);		
	}
	
	@Test
	@Order(3)
	void EventoStoricoService_GetById_NonExistentId_False() {
		
		log.info("Retrieving non existent ID 0");
		Long id = Long.valueOf(0);
		
		// with an empty model, it should return EntityNotFoundException
		Class<? extends Exception > expectedException = EntityNotFoundException.class;
		
		Executable executableCommand = new Executable() {
			@Override
			public void execute() throws Throwable {
				
				log.info("calling service.saveFromModel with empty model...");
				retrievedEntity = service.getById(id);
				
				log.error("...the test expected a '" + expectedException.getCanonicalName() 
					+ "' exception, " + "while the entity got rerieved with ID: " + retrievedEntity.getId());
			}
		};
		
		Exception ret = assertThrows(expectedException, executableCommand);
		
		log.info("...the test got the expected exception: " + ret.getLocalizedMessage()
			+ ", with message: " + ret.getLocalizedMessage());
	}
	
}
