package eu.campesinux.hcProj.hcBE.core.entities.eventoStorico;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EventoStoricoModel {
	
	private Long id;
	
	private String descrizione;
	
	private String wikiLink;
	
	private BigDecimal latitude;
	private BigDecimal longitude;
	
	private String date;
	
	private List<Long> leggendeCorrelate;
	
	private Long tipoEvento;
	private String tipoEventoDecoded;
	
	private Long geoEntityPartenza;
	private Long geoEntityArrivo;
}
