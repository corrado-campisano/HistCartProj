package eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.helpers.CommonRegexes;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.CustomFieldError;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;

@Service
public class LeggendaCorrelataValidation {
	
	public FieldErrorResponse validate(LeggendaCorrelataModel model) {
		
		List<CustomFieldError> fieldErrors = new ArrayList<>();
		FieldErrorResponse fer = new FieldErrorResponse();
		
		// --------------------------------------------------------------------
		// Descrizione: OK
		// --------------------------------------------------------------------
		String descrizione = model.getDescrizione();
		// obbligatorio, da 5 a 255 caratteri alfanum
		if (descrizione == null || descrizione.isEmpty() || descrizione.isBlank()) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("descrizione");
			cfe.setMessage("Compilare il campo Descrizione");

			fieldErrors.add(cfe);
			
		} else if (!Pattern.compile(CommonRegexes.DESCR_REGEX).matcher(descrizione).matches()) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("descrizione");
			cfe.setMessage("Il campo Descrizione ammette da 5 a 255 caratteri alfanumerici");

			fieldErrors.add(cfe);
		}
		
		// --------------------------------------------------------------------
		// WikiLink: OK
		// --------------------------------------------------------------------
		String wikiLink = model.getWikiLink();
		// obbligatorio, deve essere un URL di wikipedia
		if (wikiLink == null || wikiLink.isEmpty() || wikiLink.isBlank()) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("wikiLink");
			cfe.setMessage("Compilare il campo WikiLink");

			fieldErrors.add(cfe);
			
		} else if (!Pattern.compile(CommonRegexes.WIKI_REGEX).matcher(wikiLink).matches()) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("wikiLink");
			cfe.setMessage("Il campo WikiLink ammette l'indirizzo di una pagina Wikipedia");

			fieldErrors.add(cfe);
		}
		
		// --------------------------------------------------------------------
		// Date: OK
		// --------------------------------------------------------------------
		String date = model.getDate();
		// obbligatorio, non null
		if (date == null || date.isEmpty() || date.isBlank()) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("date");
			cfe.setMessage("Compilare il campo Data");

			fieldErrors.add(cfe);
		}
		
		// --------------------------------------------------------------------
		// LatLng: OK
		// --------------------------------------------------------------------
		BigDecimal lat = model.getLatitude();
		BigDecimal lng = model.getLongitude();
		// obbligatorio, non null
		if (lat == null || lng == null) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("latlng");
			cfe.setMessage("Selezionare un punto sulla mappa, per recuperare Latitude e Longitude");

			fieldErrors.add(cfe);
		}
		
		fer.setFieldErrors(fieldErrors);
		return fer;
	}
}
