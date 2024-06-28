package eu.campesinux.hcProj.hcBE.core.entities.eventoStorico;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento.TipoEvento;
import eu.campesinux.hcProj.hcBE.core.entities.geoEntity.GeoEntity;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelata;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class EventoStorico {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	private String descrizione;
		
	@NotEmpty
	private String wikiLink;
	
	@NotNull
	@Column(precision = 20)
	private BigDecimal latitude;
	
	@NotNull
	@Column(precision = 20)
	private BigDecimal longitude;
	
	@NotEmpty
	private String date;
	
	// @ManyToOne: this is the owner side
	@ManyToOne
    @JoinColumn(name = "tipo_evento", referencedColumnName = "id")
    @JsonIgnore
    private TipoEvento tipoEvento;
	
	// @ManyToMany: this is the owner side (the Student class), 
	// see: https://www.baeldung.com/jpa-many-to-many#2-implementation-in-jpa
	@ManyToMany
	@JoinTable( //@// @formatter:off
			name = "EventoStorico_LeggendaCorrelata", 
			joinColumns = @JoinColumn(name = "eventoStorico_id"), 
			inverseJoinColumns = @JoinColumn(name = "leggendaCorrelata_id"))// @formatter:on
	@JsonIgnore
	private List<LeggendaCorrelata> leggendeCorrelate;
	
	// @OneToOne: this is the owner side
	@OneToOne
	@JoinColumn(name = "geo_entity_partenza", referencedColumnName = "id")
	@JsonIgnore
	private GeoEntity geoEntityPartenza;
	
	// @OneToOne: this is the owner side
	@OneToOne
	@JoinColumn(name = "geo_entity_arrivo", referencedColumnName = "id")
	@JsonIgnore
	private GeoEntity geoEntityArrivo;
	
}
