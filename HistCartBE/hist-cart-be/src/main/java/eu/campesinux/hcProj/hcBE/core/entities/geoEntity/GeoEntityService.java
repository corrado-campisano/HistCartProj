package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;
import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStoricoService;
import eu.campesinux.hcProj.hcBE.core.helpers.PointModel;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions.ModelsValidationException;
import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import lombok.RequiredArgsConstructor;

import org.geolatte.geom.*;
import static org.geolatte.geom.crs.CoordinateReferenceSystems.WGS84;

@Service
@RequiredArgsConstructor
public class GeoEntityService {
	
	private final GeoEntityRepo repo;
	private final GeoEntityFactory factory;
	private final GeoEntityValidation validation;
	
	public List<GeoEntity> getAll(Boolean partenzaAutArrivo) {
		return repo.findAllByPartenzaAutArrivo(partenzaAutArrivo);
	}

	public GeoEntity saveFromModel(GeoEntityModel model, EventoStoricoService eventoStoricoService) {
		
		FieldErrorResponse fer = validation.validate(model);
		
		if (fer != null && fer.getFieldErrors()!=null  && !fer.getFieldErrors().isEmpty()) {
			throw new ModelsValidationException(fer);
		}
		
		// nuovo inserimento o nuova versione, dal model
		GeoEntity entity = factory.modelToEntity(model);
		
		// gestione poligono
		PositionSequenceBuilder<G2D> posSeqBuilder = PositionSequenceBuilders.variableSized(G2D.class);
		
		for (PointModel point : model.getPolygon()) {
			posSeqBuilder.add(point.getLat(), point.getLng());
		}
		
		// per chiudere il poligono
		PointModel inizio = model.getPolygon().get(0);
		posSeqBuilder.add(inizio.getLat(), inizio.getLng());
		
		Polygon<G2D> polygon = new Polygon<>(posSeqBuilder.toPositionSequence(), WGS84);
		entity.setPolygon(polygon);
				
		// salvataggio del nuovo inserimento o nuova versione
		GeoEntity persistedEntity = repo.save(entity);
		
		// salvataggio associazioni
		
		if (model.getPartenzaAutArrivo()) {
			
			EventoStorico eventoFuturo = eventoStoricoService.getById(model.getEventoStoricoFuturoFk());
			if (eventoFuturo != null) {
				eventoFuturo.setGeoEntityPartenza(persistedEntity);
				eventoStoricoService.save(eventoFuturo);
			}
			
		} else {
			
			EventoStorico eventoPassato = eventoStoricoService.getById(model.getEventoStoricoPassatoFk());
			if (eventoPassato != null) {
				eventoPassato.setGeoEntityArrivo(persistedEntity);
				eventoStoricoService.save(eventoPassato);
			}			
		}
		
		return persistedEntity;
	}

	public void delete(Long id, EventoStoricoService eventoStoricoService) {
		// devo prima eliminare tutte le associazioni
		Optional<GeoEntity> optional = repo.findById(id);
		
		if (!optional.isPresent()) {
			throw new IllegalStateException("Impossibile torvare la GeoEntity di ID: " + id); 
		}
		
		GeoEntity entity = optional.get();
		EventoStorico eventoStorico = null;
		if (entity.getPartenzaAutArrivo()) {
			eventoStorico = entity.getEventoStoricoFuturo();
		} else {
			eventoStorico = entity.getEventoStoricoPassato();
		}
		
		if (eventoStorico!=null) {
			if (entity.getPartenzaAutArrivo()) {
				eventoStorico.setGeoEntityPartenza(null);
			} else {
				eventoStorico.setGeoEntityArrivo(null);
			}			
			eventoStoricoService.save(eventoStorico);
		}
		
		repo.deleteById(id);
	}

	public GeoEntityModel getModelById(Long id) {
		Optional<GeoEntity> opt = repo.findById(id);
		
		if (opt.isPresent()) {
			return factory.entityToModel(opt.get());
		} else {
			return null;
		}
	}

	public long countPartenza() {
		return repo.countByPartenzaAutArrivo(true);
	}

	public long countArrivo() {
		return repo.countByPartenzaAutArrivo(false);
	}
	
}
