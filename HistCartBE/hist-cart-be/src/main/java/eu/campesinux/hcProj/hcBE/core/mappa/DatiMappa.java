package eu.campesinux.hcProj.hcBE.core.mappa;

import java.util.List;

import org.springframework.data.geo.Point;

import lombok.Data;

@Data
public class DatiMappa {
	
	private Point center;
	
	private Integer zoom;
	
	private List<Marker> markers;
}
