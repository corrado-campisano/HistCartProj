import { Button, Typography } from "@mui/material";

import React from "react";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import Messages from "../utils/constants/Messages";

import { vaiEventoStorico, vaiLeggendaCorrelata } from "../utils/NavigationFunctions.js";

import EditIcon from '@mui/icons-material/Edit';

export function CustomIconMarker({type, label, position, id, navigate, token}) {
	
	const BaseIcon = L.Icon.extend({
		options: {
			shadowUrl: '/images/marker-shadow.png',
		
		    iconSize:     [21, 45], // size of the icon
		    shadowSize:   [25, 34], // size of the shadow
		    iconAnchor:   [22, 64], // point of the icon which will correspond to marker's location
		    shadowAnchor: [4, 42],  // the same for the shadow
		    popupAnchor:  [-3, -66] // point from which the popup should open relative to the iconAnchor			
		}
	});
	
	let imgToUse = "/images/marker-icon.png";
	let buttonFunction = null;
	let message = "";
	switch(type) {
		case "LeggendaCorrelata" : 
			imgToUse = "/images/leggendaCorrelata-icon.png";
			buttonFunction = vaiLeggendaCorrelata;
			message = Messages.BTN_LEGGENDA_CORRELATA_MOD;
			break;
			
		case "Trattato" : 
			imgToUse = "/images/eventoStorico-treaty-icon.png";
			buttonFunction = vaiEventoStorico;
			message = Messages.BTN_EVENTO_STORICO_MOD;
			break;
			
		case "Battaglia" : 
			imgToUse = "/images/eventoStorico-battle-icon.png";
			buttonFunction = vaiEventoStorico;
			message = Messages.BTN_EVENTO_STORICO_MOD;
			break;
			
		default:
			imgToUse = "/images/marker-icon.png";
			break;
	}
	
	const icon = new BaseIcon({iconUrl: imgToUse}); 
		
	return position ? (
		<Marker icon={icon} position={[position.lat, position.lng]}>
			<Popup>
				<Typography variant='body1'>{label}</Typography>
				<Typography variant='body2'>{type}</Typography>
				Lat: {position.lat}<br />Lng: {position.lng}
				<br /><br />
				{
					buttonFunction && 
					<Button variant="contained" startIcon={<EditIcon />} 
						onClick={() => buttonFunction(navigate, token, id)}>
						{message}
					</Button>					
				}
			</Popup>
		</Marker>
	) : null;	
};