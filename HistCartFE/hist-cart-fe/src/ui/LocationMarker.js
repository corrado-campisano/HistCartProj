import React from "react";

import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

export function LocationMarker({locMarToEveSto, position}) {
	
	const icon = new L.Icon.Default();
	
	const map = useMapEvents({
		click(event) {
			console.log("Click su LocationMarker: " + event.latlng);
			map.flyTo(event.latlng);
			locMarToEveSto(event.latlng);
		},
	});
	//console.log("Param position inside LocationMarker is: " + JSON.stringify(position));
	
	return position ? (
		<Marker icon={icon} position={[position.lat, position.lng]}>
			<Popup>
				Lat: {position.lat}
				<br />
				Lng: {position.lng}
			</Popup>
		</Marker>
	) : null;
};
