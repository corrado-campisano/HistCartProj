package eu.campesinux.hcProj.hcBE.core.entities.geoEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GeoEntityRepo extends JpaRepository<GeoEntity, Long> {

	List<GeoEntity> findAllByPartenzaAutArrivo(Boolean partenzaAutArrivo);

	long countByPartenzaAutArrivo(boolean partenzaAutArrivo);

}
