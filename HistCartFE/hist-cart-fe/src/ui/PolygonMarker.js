import React from "react";

import { Polyline, Polygon, useMapEvents } from "react-leaflet";

export function PolygonMarker({polyMarToGeoEntity, polygon, colorOptions, isClosed}) {
	
	const map = useMapEvents({
		click(event) {
			console.log("Click su PolygonMarker: " + event.latlng);
			map.flyTo(event.latlng);
			if (!isClosed) polyMarToGeoEntity(event.latlng);
		},
	});
	//console.log("Param position inside PolygonMarker is: " + JSON.stringify(polygon));
		
	return polygon ? (
		isClosed ? ( <Polygon pathOptions={colorOptions} positions={polygon} /> )
		: ( <Polyline pathOptions={colorOptions} positions={polygon} /> )
	) : null;
};
