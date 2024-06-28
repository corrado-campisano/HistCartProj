package eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class LeggendaCorrelata {
	
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
	
	// @ManyToMany: this is the target side (the Course class), 
	// see: https://www.baeldung.com/jpa-many-to-many#2-implementation-in-jpa
	@ManyToMany(mappedBy = "leggendeCorrelate")
	@JsonIgnore
	private List<EventoStorico> eventiStorici;
	
}
