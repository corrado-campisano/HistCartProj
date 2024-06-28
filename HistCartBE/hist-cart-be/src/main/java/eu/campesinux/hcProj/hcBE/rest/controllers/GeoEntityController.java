package eu.campesinux.hcProj.hcBE.rest.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntity;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntityModel;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntityService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.ValidationResponseModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/geoEntities")
public class GeoEntityController {
	
	private final GeoEntityService service;
	
	private final EventoStoricoService eventoStoricoService;
	
	@GetMapping("/list/{partenzaAutArrivo}")
	public ResponseEntity<List<GeoEntity>> getGeoEntities(@PathVariable boolean partenzaAutArrivo) {
		
		List<GeoEntity> geoEntities = new ArrayList<>();
		geoEntities = service.getAll(partenzaAutArrivo);
		
		return ResponseEntity.ok(geoEntities);
	}
	
	@PostMapping("/")
	public ResponseEntity<?> salvaGeoEntity(@RequestBody GeoEntityModel model) {
		
		try {
			GeoEntity persistedEntity = service.saveFromModel(model, eventoStoricoService);
			
			String msg = "GeoEntity creata correttamente";
			if (model.getId()!=null) {
				msg = "GeoEntity salvata correttamente";
			}
			
			return ResponseEntity.ok(new ValidationResponseModel(msg, persistedEntity.getId()));
			
		} catch (ModelsValidationException ex) {
			
			FieldErrorResponse fer = ex.getFieldErrorResponse();
			
			return new ResponseEntity<>(fer, HttpStatus.BAD_REQUEST);
						
		} catch (IllegalArgumentException ex) {
			
			String msg = "Errore creazione GeoEntity: " + ex.getLocalizedMessage();
			log.error(msg);
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(msg);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<GeoEntityModel> getGeoEntity(@PathVariable Long id) {
		
		GeoEntityModel model = service.getModelById(id);
		
		if (model != null) {
			return ResponseEntity.ok(model);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}		
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteGeoEntity(@PathVariable Long id) {
		
		try {
			service.delete(id, eventoStoricoService);
			return ResponseEntity.ok(new ValidationResponseModel("GeoEntity eliminata correttamente"));
			
		} catch (IllegalStateException ex) {
			String msg = "Errore nell'eliminazione GeoEntity di ID: " + id + ": " + ex.getLocalizedMessage();
			log.error(msg);
			
			return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body(msg);
		}
	}
}
