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

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoModel;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.ValidationResponseModel;

import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/eventiStorici")
public class EventoStoricoController {
	
	private final EventoStoricoService service;
		
	@GetMapping("/")
	public ResponseEntity<List<EventoStorico>> getEventiStorici() {
		
		List<EventoStorico> eventiStorici = new ArrayList<>();
		eventiStorici = service.getAll();
		
		return ResponseEntity.ok(eventiStorici);
	}
	
	@PostMapping("/")
	public ResponseEntity<?> salvaEventoStorico(@RequestBody EventoStoricoModel model) {
		
		try {
			EventoStorico persistedEntity = service.saveFromModel(model);
			
			String msg = "Evento Storico creato correttamente";
			if (model.getId()!=null) {
				msg = "Evento Storico salvato correttamente";
			}
			
			return ResponseEntity.ok(new ValidationResponseModel(msg, persistedEntity.getId()));
			
		} catch (ModelsValidationException ex) {
			
			FieldErrorResponse fer = ex.getFieldErrorResponse();
			
			return new ResponseEntity<>(fer, HttpStatus.BAD_REQUEST);
						
		} catch (IllegalArgumentException ex) {
			
			String msg = "Errore creazione Evento Storico: " + ex.getLocalizedMessage();
			log.error(msg);
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(msg);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<EventoStoricoModel> getEventoStorico(@PathVariable Long id) {
		
		EventoStoricoModel model = service.getModelById(id);
		
		if (model != null) {
			return ResponseEntity.ok(model);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}		
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteEventoStorico(@PathVariable Long id) {
		
		try {
			service.delete(id);
			return ResponseEntity.ok(new ValidationResponseModel("Evento Storico eliminato correttamente"));
			
		} catch (IllegalStateException ex) {
			String msg = "Errore nell'eliminazione Evento Storico di ID: " + id + ": " + ex.getLocalizedMessage();
			log.error(msg);
			
			return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body(msg);
		}
	}
	
}
