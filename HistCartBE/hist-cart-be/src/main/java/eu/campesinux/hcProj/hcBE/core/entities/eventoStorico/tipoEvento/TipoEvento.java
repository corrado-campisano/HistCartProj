package eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class TipoEvento {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	private String tipo;
	
	@NotEmpty
	private String descrizione;
	
	// @OneToMany: this is the target side	
	@OneToMany(mappedBy="tipoEvento")
	@JsonIgnore
	private Set<EventoStorico> eventiStorici;
	
}
