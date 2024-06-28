package eu.campesinux.hcProj.hcBE.core.entities.leggendaCorrelata;

import java.util.ArrayList;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.entities.eventoStorico.EventoStorico;

@Service
public class LeggendaCorrelataFactory {
		
	public LeggendaCorrelata modelToEntity(LeggendaCorrelataModel model) {
		LeggendaCorrelata entity = new LeggendaCorrelata();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(model, entity);
		
		// the association to EventiStorici is handled in the service 
		
		return entity;
	}
	
	public LeggendaCorrelataModel entityToModel(LeggendaCorrelata entity) {
		LeggendaCorrelataModel model = new LeggendaCorrelataModel();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(entity, model);
		
		// create the association to EventiStorici
		if (entity.getEventiStorici()!=null) {
			
			for (EventoStorico evento : entity.getEventiStorici()) {
				
				if (model.getEventiStorici()==null) {
					model.setEventiStorici(new ArrayList<>());
				}				
				model.getEventiStorici().add(evento.getId());
			}
		}
		
		return model;
	}
	
}
