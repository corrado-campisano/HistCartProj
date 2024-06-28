package eu.campesinux.hcProj.hcBE.core;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

import eu.campesinux.hcProj.hcBE.core.eventoStorico.EventoStoricoServiceTest;
import eu.campesinux.hcProj.hcBE.core.leggendaCorrelata.LeggendaCorrelataServiceTest;

@Suite()
@SuiteDisplayName("Core Test Suite - Tests services, repos and entities")
@SelectClasses({ LeggendaCorrelataServiceTest.class, EventoStoricoServiceTest.class })
public class CoreTestSuite {
	
}
