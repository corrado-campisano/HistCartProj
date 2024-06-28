package eu.campesinux.hcProj.hcBE.rest.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelata;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelataService;
import eu.campesinux.hcProj.hcBE.core.mappa.DatiMappa;
import eu.campesinux.hcProj.hcBE.core.mappa.Marker;
import eu.campesinux.hcProj.hcBE.core.stats.Stats;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/datiMappa")
public class MapController {
	
	private final EventoStoricoService eventoStoricoService;
	private final LeggendaCorrelataService leggendaCorrelataService;
	
	@GetMapping("/")
	public ResponseEntity<DatiMappa> getDatiMappa() {
		DatiMappa datiMappa = new DatiMappa();
		
		List<Marker> markers = new ArrayList<>();
		
		List<EventoStorico> eventi = eventoStoricoService.getAll();
		for (EventoStorico evento : eventi) {
			String tipo = evento.getTipoEvento()!=null ? evento.getTipoEvento().getTipo(): "Sconosciuto";
			markers.add(new Marker(evento.getId(), evento.getDescrizione(), 
					evento.getLatitude(), evento.getLongitude(), tipo));
		}
		
		List<LeggendaCorrelata> leggende = leggendaCorrelataService.getAll();
		for (LeggendaCorrelata leggenda : leggende) {
			markers.add(new Marker(leggenda.getId(), leggenda.getDescrizione(), 
					leggenda.getLatitude(), leggenda.getLongitude(), "LeggendaCorrelata"));
		}
		
		datiMappa.setMarkers(markers);
		
		datiMappa.setZoom(5);
		
		Point center = new Point(40, 25);
		datiMappa.setCenter(center);
		
		return ResponseEntity.ok(datiMappa);
	}
}
