package eu.campesinux.hcProj.hcBE.rest.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento.TipoEvento;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento.TipoEventoRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/codecs")
public class CodecsController {
	
	private final TipoEventoRepo tipoEventoRepo;
	
	@GetMapping("/tipiEvento")
	public ResponseEntity<List<TipoEvento>> getTipiEvento() {
		
		List<TipoEvento> entities = tipoEventoRepo.findAll();
		
		if (entities!=null && !entities.isEmpty()) {
			return ResponseEntity.ok(entities);	
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);			
		}
	}
	
}
