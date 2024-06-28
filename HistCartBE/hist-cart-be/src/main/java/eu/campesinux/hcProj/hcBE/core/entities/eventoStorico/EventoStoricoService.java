package eu.campesinux.hcProj.hcBE.core.entities.eventoStorico;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento.TipoEvento;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.tipoEvento.TipoEventoRepo;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelata;
import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelataService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventoStoricoService {
	
	private final EventoStoricoRepo repo;
	private final EventoStoricoFactory factory;
	private final EventoStoricoValidation validation;
	
	private final TipoEventoRepo tipoEventoRepo;
	
	private final LeggendaCorrelataService leggendaCorrelataService;
	
	public EventoStorico saveFromModel(EventoStoricoModel model) {
		
		FieldErrorResponse fer = validation.validate(model);
		
		if (fer != null && fer.getFieldErrors()!=null  && !fer.getFieldErrors().isEmpty()) {
			throw new ModelsValidationException(fer);
		}
		
		// nuovo inserimento o nuova versione, dal model
		EventoStorico entity = factory.modelToEntity(model);
		
		Optional<TipoEvento> optTipoEvento = tipoEventoRepo.findById(model.getTipoEvento());
		if (!optTipoEvento.isPresent()) {
			throw new IllegalArgumentException("Impossibile recuperare il TipoEvento di ID: " + model.getTipoEvento());
		}
		entity.setTipoEvento(optTipoEvento.get());
		
		List<LeggendaCorrelata> nuoveLeggende = null;
		if (model.getLeggendeCorrelate()!=null) {
			nuoveLeggende = leggendaCorrelataService.findAllById(model.getLeggendeCorrelate());
		}
		entity.setLeggendeCorrelate(nuoveLeggende);
		
		// recupero eventuali associazioni con le geoEntity, 
		// non gestite dal CRUD nella pagina degli eventi storici
		if (model.getId()!=null) {
			EventoStorico older = this.getById(model.getId());
			
			if (older!=null) {
				entity.setGeoEntityPartenza(older.getGeoEntityPartenza());
				entity.setGeoEntityArrivo(older.getGeoEntityArrivo());
			}
		}
				
		// salvataggio del nuovo inserimento o nuova versione
		EventoStorico persistedEntity = repo.save(entity);
		
		return persistedEntity;
	}

	public EventoStorico getById(Long id) {
		Optional<EventoStorico> opt = repo.findById(id);
		
		if (opt.isPresent()) return opt.get();
		
		throw new EntityNotFoundException();
	}
	
	public EventoStoricoModel getModelById(Long id) {
		Optional<EventoStorico> opt = repo.findById(id);
		
		if (opt.isPresent()) {
			return factory.entityToModel(opt.get());
		} else {
			return null;
		}
	}
	
	public long count() {
		return repo.count();
	}

	public List<EventoStorico> getAll() {
		return repo.findAll();
	}

	public void delete(Long id) {
		repo.deleteById(id);
	}

	public EventoStorico save(EventoStorico entity) {
		EventoStorico persistedEntity = repo.save(entity);
		
		return persistedEntity;
	}

	public List<EventoStorico> findAllById(List<Long> ids) {
		return repo.findAllById(ids);
	}	
}
