package eu.campesinux.hcProj.hcBE.core.helpers;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.CustomFieldError;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;

public class NegativeDateDeserializer extends JsonDeserializer<LocalDate> {

	@Override
	public LocalDate deserialize(JsonParser parser, DeserializationContext context) 
			throws IOException, JacksonException, ModelsValidationException {
		
		String value = parser.getValueAsString();
		
		if (value!=null) {
			
			if (value.startsWith(("-"))) {
				// -000673-02-28T23:10:04.000Z
				// che pero' era il 1 marzo -673...
				
				value = value.replaceFirst("\\-", "");
				while (value.startsWith("0")) {
					value = value.replaceFirst("0", "");
				}
				
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				try {
					Date dte = sdf.parse(value);
					GregorianCalendar cal = new GregorianCalendar();
					cal.setTime(dte);
					cal.set(GregorianCalendar.YEAR, -1 * cal.get(GregorianCalendar.YEAR));

					return LocalDate.of(
							cal.get(GregorianCalendar.YEAR), 
							cal.get(GregorianCalendar.MONTH), 
							cal.get(GregorianCalendar.DAY_OF_MONTH));
					
				} catch (ParseException ex) {
					
					FieldErrorResponse fer = new FieldErrorResponse();
					List<CustomFieldError> fieldErrors = new ArrayList<>();
					CustomFieldError err = new CustomFieldError();
					err.setField("date");
					err.setMessage("Inserire una data valida, err: " + ex.getLocalizedMessage());
					fieldErrors.add(err);
					fer.setFieldErrors(fieldErrors);
					
					throw new ModelsValidationException(fer);
				}
			}
		}		
		
		FieldErrorResponse fer = new FieldErrorResponse();
		List<CustomFieldError> fieldErrors = new ArrayList<>();
		CustomFieldError err = new CustomFieldError();
		err.setField("date");
		err.setMessage("Inserire una data");
		fieldErrors.add(err);
		fer.setFieldErrors(fieldErrors);
		
		throw new ModelsValidationException(fer);
	}
	
}
