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
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelata;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelataModel;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelataService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.ValidationResponseModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/leggendeCorrelate")
public class LeggendaCorrelataController {
	
	private final LeggendaCorrelataService service;
	
	private final EventoStoricoService eventoStoricoService;
	
	@GetMapping("/")
	public ResponseEntity<List<LeggendaCorrelata>> getLeggendeCorrelate() {
		
		List<LeggendaCorrelata> lista = new ArrayList<>();
		lista = service.getAll();
		
		return ResponseEntity.ok(lista);
	}
	
	@PostMapping("/")
	public ResponseEntity<?> salvaLeggendaCorrelata(@RequestBody LeggendaCorrelataModel model) {
		
		try {
			LeggendaCorrelata persistedEntity = service.saveFromModel(model, eventoStoricoService);
			
			String msg = "Leggenda Correlata creata correttamente";
			if (model.getId()!=null) {
				msg = "Leggenda Correlata salvata correttamente";
			}
			
			return ResponseEntity.ok(new ValidationResponseModel(msg, persistedEntity.getId()));
			
		} catch (ModelsValidationException ex) {
			
			FieldErrorResponse fer = ex.getFieldErrorResponse();
			
			return new ResponseEntity<>(fer, HttpStatus.BAD_REQUEST);
						
		} catch (IllegalArgumentException ex) {
			
			String msg = "Errore creazione Leggenda Correlata: " + ex.getLocalizedMessage();
			log.error(msg);
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(msg);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<LeggendaCorrelataModel> getLeggendaCorrelata(@PathVariable Long id) {
		
		LeggendaCorrelataModel model = service.getModelById(id);
		
		if (model != null) {
			return ResponseEntity.ok(model);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}		
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteLeggendaCorrelata(@PathVariable Long id) {
		
		try {
			service.delete(id, eventoStoricoService);
			return ResponseEntity.ok(new ValidationResponseModel("Leggenda Correlata eliminata correttamente"));
			
		} catch (IllegalStateException ex) {
			String msg = "Errore nell'eliminazione della Leggenda Correlata di ID: " + id + ": " + ex.getLocalizedMessage();
			log.error(msg);
			
			return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body(msg);
		}
	}
}
