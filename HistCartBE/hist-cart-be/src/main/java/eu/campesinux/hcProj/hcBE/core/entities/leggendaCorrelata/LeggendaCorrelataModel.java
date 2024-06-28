package eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LeggendaCorrelataModel {
	
	private Long id;
	
	private String descrizione;
	
	private String wikiLink;
	
	private BigDecimal latitude;
	private BigDecimal longitude;
	
	private String date;
	
	private List<Long> eventiStorici;
}
