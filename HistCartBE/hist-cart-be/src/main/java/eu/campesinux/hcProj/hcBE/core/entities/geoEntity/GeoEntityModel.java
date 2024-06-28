package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import java.util.List;

import eu.campesinux.hcProj.hcBE.core.helpers.PointModel;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class GeoEntityModel {
	
	private Long id;
	
	private String descrizione;
	
	private String wikiLink;
	
	private Boolean partenzaAutArrivo;
	
	private Long eventoStoricoFuturoFk;
	private Long eventoStoricoPassatoFk;
	
	private List<PointModel> polygon;
}
