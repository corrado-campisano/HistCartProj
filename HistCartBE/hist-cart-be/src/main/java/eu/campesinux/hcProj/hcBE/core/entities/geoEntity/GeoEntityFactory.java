package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import java.util.ArrayList;
import java.util.List;

import org.geolatte.geom.G2D;
import org.geolatte.geom.Position;
import org.geolatte.geom.PositionSequence;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import eu.campesinux.hcProj.hcBE.core.helpers.PointModel;

@Service
public class GeoEntityFactory {
	
	public GeoEntity modelToEntity(GeoEntityModel model) {
		GeoEntity entity = new GeoEntity();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(model, entity);
		
		// the association to EventiStorici and polygon is handled in the service
		
		return entity;
	}
	
	public GeoEntityModel entityToModel(GeoEntity entity) {
		GeoEntityModel model = new GeoEntityModel();
		
		// copies (only) all same-name properties from source (first param) to target (second one)
		BeanUtils.copyProperties(entity, model);
		
		// associations to EventoStorico
		model.setEventoStoricoPassatoFk(entity.getEventoStoricoPassato()!=null ? entity.getEventoStoricoPassato().getId() : null);
		model.setEventoStoricoFuturoFk(entity.getEventoStoricoFuturo()!=null ? entity.getEventoStoricoFuturo().getId() : null);
		
		// decoding polygon
		if (entity.getPolygon()!=null) {
			
			PositionSequence<G2D> positions = entity.getPolygon().getPositions();
			
			if (positions!=null && positions.size()>3) {
				List<PointModel> polygon = new ArrayList<>();
				
				for (Position position : positions) {
					PointModel pointModel = new PointModel();
					pointModel.setLat(position.getCoordinate(0));
					pointModel.setLng(position.getCoordinate(1));
					polygon.add(pointModel);
				}
				model.setPolygon(polygon);
			}
			
		} else {
			model.setPolygon(new ArrayList<>());
		}
		
		return model;
	}
}
