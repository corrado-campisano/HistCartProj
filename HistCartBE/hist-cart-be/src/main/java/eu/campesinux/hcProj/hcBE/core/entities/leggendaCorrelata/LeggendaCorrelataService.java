package eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@Service
@RequiredArgsConstructor
public class LeggendaCorrelataService {
	
	private final LeggendaCorrelataRepo repo;
	private final LeggendaCorrelataFactory factory;
	private final LeggendaCorrelataValidation validation;
		
	public LeggendaCorrelata saveFromModel(LeggendaCorrelataModel model, EventoStoricoService eventoStoricoService) {
		
		FieldErrorResponse fer = validation.validate(model);
		
		if (fer != null && fer.getFieldErrors()!=null  && !fer.getFieldErrors().isEmpty()) {
			throw new ModelsValidationException(fer);
		}
		
		// nuovo inserimento o nuova versione, dal model
		LeggendaCorrelata entity = factory.modelToEntity(model);
		
		// eventuale record preesistente
		LeggendaCorrelata older = (model.getId()!=null && model.getId()>0) ? this.getById(entity.getId()) : null;
		
		// vecchie associazioni
		List<EventoStorico> vecchiEventi = null;
		if (older!=null && older.getEventiStorici()!=null) {
			vecchiEventi = older.getEventiStorici()
					.stream()
					.map(item -> item).collect(Collectors.toList());
		}
		
		// nuove associazioni
		List<EventoStorico> nuoviEventi = null;
		if (model.getEventiStorici()!=null) {
			nuoviEventi = eventoStoricoService
					.findAllById(model.getEventiStorici());			
		}
		
		// salvataggio del nuovo inserimento o nuova versione
		LeggendaCorrelata persistedEntity = repo.save(entity);
		
		// prima di tutto distinguo tra inserimento ed aggiornamento
		if (model.getId()!=null && model.getId()>0) {
			// aggiornamento di record esistente
			
			// devo gestire manualmente le associazioni agli EventiStorici
			
			if (vecchiEventi!=null) {
				// confermo o rimuovo in base ai nuovi eventi
				for (EventoStorico vecchioEvento : vecchiEventi) {
					
					if (nuoviEventi==null) {
						// rimuovere il vecchio evento
						vecchioEvento.getLeggendeCorrelate().remove(older);
						eventoStoricoService.save(vecchioEvento);
						
					} else {
							
						if (nuoviEventi.contains(vecchioEvento)) {
							// mantenere il vecchio evento
							
						} else {
							// rimuovere il vecchio evento
							vecchioEvento.getLeggendeCorrelate().remove(older);
							eventoStoricoService.save(vecchioEvento);
						}
					}
				}
			}
			
			if (nuoviEventi!=null) {
				// confermo o aggiungo in base ai vecchi eventi
				for (EventoStorico nuovoEvento : nuoviEventi) {
					
					if (vecchiEventi==null) {
						// aggiungere il nuovo evento
						nuovoEvento.getLeggendeCorrelate().add(older);
						eventoStoricoService.save(nuovoEvento);
						
					} else {
						
						if(vecchiEventi.contains(nuovoEvento)) {
							// mantenere il vecchio evento
							
						} else {
							// aggiungere il nuovo evento
							nuovoEvento.getLeggendeCorrelate().add(older);
							eventoStoricoService.save(nuovoEvento);
						}
					}
				}
				
			} else {
				
				// nono devo gestire le associazioni precedenti
				addAssociationsToEventiStoriciCorrelati(model, persistedEntity, eventoStoricoService);
			}
			
		} else {
			// inserimento nuovo record
			addAssociationsToEventiStoriciCorrelati(model, persistedEntity, eventoStoricoService);
		}
		
		return persistedEntity;
	}

	private void addAssociationsToEventiStoriciCorrelati(LeggendaCorrelataModel model, 
			LeggendaCorrelata persistedEntity, EventoStoricoService eventoStoricoService) {
		
		// inserisco direttamente le associazioni agli EventiStoriciCorrelati
		if (model.getEventiStorici()!=null) {
			
			for(Long id : model.getEventiStorici()) {
				
				EventoStorico evento = eventoStoricoService.getById(id);
				if (evento.getLeggendeCorrelate()==null) {
					evento.setLeggendeCorrelate(new ArrayList<>());
				}
				
				evento.getLeggendeCorrelate().add(persistedEntity);
				
				EventoStorico updatedEntity = eventoStoricoService.save(evento);
				log.info("LeggendaCorrelata di ID:" + persistedEntity.getId() 
					+ " ora associata all'EventoStorico di ID: " + updatedEntity.getId());
			}
		}
	}

	public LeggendaCorrelata getById(Long id) {
		Optional<LeggendaCorrelata> opt = repo.findById(id);
		
		if (opt.isPresent()) return opt.get();
		
		throw new EntityNotFoundException();
	}

	public long count() {
		return repo.count();
	}

	public List<LeggendaCorrelata> getAll() {
		return repo.findAll();
	}

	public LeggendaCorrelataModel getModelById(Long id) {
		Optional<LeggendaCorrelata> opt = repo.findById(id);
		
		if (opt.isPresent()) {
			return factory.entityToModel(opt.get());
		} else {
			return null;
		}
	}

	public void delete(Long id, EventoStoricoService eventoStoricoService) {
		// devo prima eliminare tutte le associazioni
		Optional<LeggendaCorrelata> optional = repo.findById(id);
		
		if (!optional.isPresent()) {
			throw new IllegalStateException("Impossibile torvare la LeggendaCorrelata di ID: " + id); 
		}
		
		LeggendaCorrelata entity = optional.get();
		for (EventoStorico evento : entity.getEventiStorici()) {
			evento.getLeggendeCorrelate().remove(entity);
			eventoStoricoService.save(evento);
		}
				
		repo.deleteById(id);
	}

	public List<LeggendaCorrelata> findAllById(List<Long> ids) {
		return repo.findAllById(ids);
	}
	
}
