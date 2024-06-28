package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.helpers.CommonRegexes;
import eu.campesinux.hcProj.hcBE.core.helpers.PointModel;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.CustomFieldError;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;

@Service
public class GeoEntityValidation {
		
	public FieldErrorResponse validate(GeoEntityModel model) {
		
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
		// EventoStoricoPassato o EventoStoricoFuturo: OK
		// --------------------------------------------------------------------
		Long eventoFuturoFk = model.getEventoStoricoFuturoFk();
		Long eventoPassatoFk = model.getEventoStoricoPassatoFk();
		// obbligatorio, non deve essere null o <=0
		if (model.getPartenzaAutArrivo()) {
			
			if (eventoFuturoFk == null || eventoFuturoFk.longValue()<=0) {
				CustomFieldError cfe = new CustomFieldError();
				cfe.setField("eventoFuturoFk");
				cfe.setMessage("Selezionare un Evento Futuro");
				
				fieldErrors.add(cfe);
			}
			
		} else {
			
			if (eventoPassatoFk == null || eventoPassatoFk.longValue()<=0) {
				CustomFieldError cfe = new CustomFieldError();
				cfe.setField("eventoPassatoFk");
				cfe.setMessage("Selezionare un Evento Passato");
				
				fieldErrors.add(cfe);
			}
		}
		
		// --------------------------------------------------------------------
		// Polygon: OK
		// --------------------------------------------------------------------
		List<PointModel> polygon = model.getPolygon();
		if (polygon == null || polygon.isEmpty() || polygon.size()<4) {
			CustomFieldError cfe = new CustomFieldError();
			cfe.setField("polygon");
			cfe.setMessage("Descrivere un poligono che rappresenti l'area della GeoEntity");
			
			fieldErrors.add(cfe);
		}
			
		fer.setFieldErrors(fieldErrors);
		return fer;
	}
}
