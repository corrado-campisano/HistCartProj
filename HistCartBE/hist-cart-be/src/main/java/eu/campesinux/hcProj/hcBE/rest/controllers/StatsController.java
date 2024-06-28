package eu.campesinux.hcProj.hcBE.rest.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntity;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntityService;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelataService;
import eu.campesinux.hcProj.hcBE.core.stats.Stats;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stats")
public class StatsController {
	
	private final EventoStoricoService eventoStoricoService;
	private final LeggendaCorrelataService leggendaCorrelataService;
	private final GeoEntityService geoEntityService;
	
	@GetMapping("/")
	public ResponseEntity<Stats> getStats() {
		Stats stats = new Stats();
		
		long eventi = eventoStoricoService.count();
		stats.setEventiStorici(Long.valueOf(eventi));

		long leggende = leggendaCorrelataService.count();
		stats.setLeggendeCorrelate(Long.valueOf(leggende));
		
		long geoEntityPartenza = geoEntityService.countPartenza();
		stats.setGeoEntityPartenza(Long.valueOf(geoEntityPartenza));

		long geoEntityArrivo = geoEntityService.countArrivo();
		stats.setGeoEntityArrivo(Long.valueOf(geoEntityArrivo));
		
		return ResponseEntity.ok(stats);
	}
}
