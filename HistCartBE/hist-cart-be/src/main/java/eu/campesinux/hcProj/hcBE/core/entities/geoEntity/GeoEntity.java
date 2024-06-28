package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.geolatte.geom.G2D;
import org.geolatte.geom.Polygon;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class GeoEntity {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	private String descrizione;
		
	@NotEmpty
	private String wikiLink;
	
	@NotNull
	private Boolean partenzaAutArrivo;
	
	// @OneToOne: this is the target side
	@OneToOne(mappedBy = "geoEntityPartenza")
	@JsonIgnore
	private EventoStorico eventoStoricoFuturo;
	
	// @OneToOne: this is the target side
	@OneToOne(mappedBy = "geoEntityArrivo")
	@JsonIgnore
	private EventoStorico eventoStoricoPassato;
	
    @Column(columnDefinition = "longblob")
	@JsonIgnore
    private Polygon<G2D> polygon;
}
