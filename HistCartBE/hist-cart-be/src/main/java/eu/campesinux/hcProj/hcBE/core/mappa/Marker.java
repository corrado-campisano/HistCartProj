package eu.campesinux.hcProj.hcBE.core.mappa;

import java.math.BigDecimal;

import org.springframework.data.geo.Point;

import lombok.Data;

@Data
public class Marker {
	
	public Marker(Long id, String descrizione, BigDecimal lat, BigDecimal lng, String tipo) {
		this.id = id;
		this.label = descrizione;
		this.position = new Point(lat.doubleValue(), lng.doubleValue());
		this.tipo = tipo;
	}
	
	private Long id;
	
	private Point position;
	
	private String label;
	
	private String tipo;
}
