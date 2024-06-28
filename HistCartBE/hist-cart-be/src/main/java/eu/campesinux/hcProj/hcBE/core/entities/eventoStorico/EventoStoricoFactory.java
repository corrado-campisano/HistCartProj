package eu.campesinux.hcProj.hcBE.core.entities.eventoStorico;

import java.util.ArrayList;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata.LeggendaCorrelata;

@Service
public class EventoStoricoFactory {

	public EventoStorico modelToEntity(EventoStoricoModel model) {
		EventoStorico entity = new EventoStorico();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(model, entity);
		
		// the association to LeggendeCorrelate, etc. is handled in the service
		
		return entity;
	}
	
	public EventoStoricoModel entityToModel(EventoStorico entity) {
		EventoStoricoModel model = new EventoStoricoModel();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(entity, model);
		
		// tipoEvento
		if (entity.getTipoEvento()!=null) {
			model.setTipoEvento(entity.getTipoEvento().getId());
			model.setTipoEventoDecoded(entity.getTipoEvento().getTipo());
		}
		
		// create the association to LeggendeCorrelate
		if (entity.getLeggendeCorrelate()!=null) {
			
			for (LeggendaCorrelata leggenda : entity.getLeggendeCorrelate()) {
				
				if (model.getLeggendeCorrelate()==null) {
					model.setLeggendeCorrelate(new ArrayList<>());
				}				
				model.getLeggendeCorrelate().add(leggenda.getId());
			}
		}
		
		// associazione con le geoEntities
		if (entity.getGeoEntityPartenza()!=null) {
			model.setGeoEntityPartenza(entity.getGeoEntityPartenza().getId());
		}
		if (entity.getGeoEntityArrivo()!=null) {
			model.setGeoEntityArrivo(entity.getGeoEntityArrivo().getId());
		}
		
		return model;
	}
	
}
