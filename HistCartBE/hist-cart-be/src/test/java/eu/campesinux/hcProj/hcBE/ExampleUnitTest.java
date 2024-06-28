package eu.campesinux.hcProj.hcBE;


import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import lombok.extern.apachecommons.CommonsLog;

// other annotations
@CommonsLog

// all tests use this test-methods naming convention: ClassName_MethodName_StateUnderTest_ExpectedBehavior 
// see: https://medium.com/@stefanovskyi/unit-test-naming-conventions-dd9208eadbea
public class ExampleUnitTest {
	
	@Test
	void JunitTests_TestingWorks_CanLog_True() {
		
		log.info("Example test of type 'Unit' (no annotations) being run, "
				+ "it has NO ACCESS to application context or database AT ALL...");
		
		log.info("..example test of type 'Unit' (no annotations) ran OK.");
		
		int test = 3;
		if (test>4) {
			fail("this should not happen");		
		} else {
			Assertions.assertTrue(test<4);
		}		
	}
	
}
