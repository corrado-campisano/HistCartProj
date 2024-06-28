import { Container, Grid, Typography, TextField, InputLabel, MenuItem, Select } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import { setAlertMessage } from "../ui/MultiSnackbars.js";
import { CustomIconMarker } from "../ui/CustomIconMarkers.js";

import { MapContainer, TileLayer, Polygon } from "react-leaflet";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { trackPromise } from 'react-promise-tracker';
import axios from "axios";
import { gestisciErroreSuOperazioniVarie, gestisciErroreSuCaricamentoDecodificheInterne } from "../utils/AxiosErrorsHandlers";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

export default function Mappa() {
		
 	// variabili non di tipo useState (che e' async), per Axios
 	
 	let token = sessionStorage.getItem("jwt");
 	
 	// altre funzioni
	
	const navigate = useNavigate();
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [markers, setMarkers] = useState([]);
	
	const [center, setCenter] = useState([40, 10]);
	
	const [zoom, setZoom] = useState(5);
	
	const [eventoStoricoFk, setEventoStoricoFk] = useState('');
	const handleChangeEventoStoricoFk = (event) => {
		setEventoStoricoFk(event.target.value);
		caricaDatiEvento(event.target.value);
	};
	const [listEventiStorici, setListEventiStorici] = useState([]);
	
	const [partenza, setPartenza] = useState("");
	const [puntiPartenza, setPuntiPartenza] = useState([]);
	const [arrivo, setArrivo] = useState("");
	const [puntiArrivo, setPuntiArrivo] = useState([]);
	
	const [polygonStart, setPolygonStart] = useState('');
	const [polygonStop, setPolygonStop] = useState('');
	
	// funzione di caricamento variabili pagina dal sessionStorage
	
	// funzioni di (pre)caricamento dati dal backend
	
	const caricaEventiStorici = async () => {
		console.log("Caricamento EventiStorici");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/eventiStorici/', 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					const eventiStoriciItems = response.data.map(
						(item) => <MenuItem value={item.id} key={item.id}>
							{item.descrizione}
						</MenuItem>
					);
					setListEventiStorici(eventiStoriciItems);
										
				} else {
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));

					setAlertMessage(Messages.WARN_NO_STATS, "warning");
				}
			})
			
			.catch(function(error) {
				gestisciErroreSuCaricamentoDecodificheInterne(error, setAlertMessage);
			})
		);
	};
	
	const caricaDatiEvento = async (eventoStoricoFk) => {
		console.log("Caricamento EventoStorico di ID: " + eventoStoricoFk);
				
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/eventiStorici/' + eventoStoricoFk, 
				{ headers: { "Authorization": `Bearer ${token}` } })

			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					setCenter([response.data.latitude, response.data.longitude]);
										
					const markersList = [
							<CustomIconMarker key={eventoStoricoFk} type={response.data.tipoEventoDecoded}
								position={{lat: response.data.latitude, lng: response.data.longitude}} label={response.data.descrizione} 
								id={eventoStoricoFk} navigate={navigate} token={token} />
					];
					setMarkers(markersList);
					
					if (response.data.geoEntityPartenza) {
						caricaGeoEntity(true, response.data.geoEntityPartenza);					
					} else {
						setPuntiPartenza([]);
						setPartenza("");
						setAlertMessage(Messages.WARN_NO_START, "warning");
					}
					
					if (response.data.geoEntityArrivo) {
						caricaGeoEntity(false, response.data.geoEntityArrivo);						
					} else {
						setPuntiArrivo([]);
						setArrivo("");
						setAlertMessage(Messages.WARN_NO_STOP, "warning");
					}
					
				} else {
					
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));

					setAlertMessage(Messages.WARN_NO_STATS, "warning");
				}
			})
			
			.catch(function(error) {
				gestisciErroreSuOperazioniVarie(error, setAlertMessage);
			})
		);
	}
	
	const caricaGeoEntity = async (partenzaAutArrivo, geoEntityId) => {
		console.log("Caricamento GeoEntity di ID: " + geoEntityId);
				
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/geoEntities/' + geoEntityId, 
				{ headers: { "Authorization": `Bearer ${token}` } })

			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					if (partenzaAutArrivo) {
						setPartenza(response.data.descrizione);
						setPuntiPartenza(response.data.polygon);
					} else {
						setArrivo(response.data.descrizione);
						setPuntiArrivo(response.data.polygon);
					}
					
				} else {
					
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));

					setAlertMessage(Messages.WARN_NO_STATS, "warning");
				}
			})
			
			.catch(function(error) {
				gestisciErroreSuOperazioniVarie(error, setAlertMessage);
			})
		);	
	}
	
	// funzioni di azione (click), oltre a quelle importate da NavigationFunctions.js
	
	// eseguito (1 o 2 volte) al primo rendering
	
	useEffect(() => {
		
		// carica i dati nella combo
		caricaEventiStorici();
		
		// eslint-disable-next-line
	}, []);
	
	useEffect(() => {
		console.log("Aggiornamento poligoni");
		
		// aggiorna i poligoni
		setPolygonStart(
			puntiPartenza ? <Polygon pathOptions={{color: 'green'}} positions={puntiPartenza} /> : null
		);
		setPolygonStop(
			puntiArrivo ? <Polygon pathOptions={{color: 'red'}} positions={puntiArrivo} /> : null
		);
		
		// eslint-disable-next-line
	}, [partenza, arrivo]);

	return (
		<>
			<Container maxWidth="xl">
				<SnackbarProvider maxSnack={10} />
	   			
	   			<Grid container spacing={2} alignItems="flex-start" >
	   			
	   				<Grid item xs={9}>
						<MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							{markers}
							{polygonStart}
							{polygonStop}
						</MapContainer>
					</Grid>
					
					<Grid item xs={3}>
						<Typography variant="h6" align="center">Esegui Eventi</Typography>
						
						<hr /><br />
						
						<InputLabel required id="eventoStoricoFk-label">Evento Storico:</InputLabel>
						<Select
							labelId="eventoStoricoFk-label"
							id="eventoStoricoFk" name="eventoStoricoFk" 
							value={eventoStoricoFk || []} fullWidth
							label="Evento Storico" size="small" 
							onChange={handleChangeEventoStoricoFk}>
							{listEventiStorici}
						</Select>
						
						<hr /><br />
						
						<InputLabel required id="eventoStoricoFk-label">GeoEntity di Partenza:</InputLabel>
						<TextField id="partenza" name="partenza" disabled variant="outlined" fullWidth size="small" 
							value={(partenza) || ""}   
							label={(puntiPartenza && ("Elementi: " + puntiPartenza.length)) || ""} />
						<hr style={{borderColor: 'green',}} />
						<br />
						
						<InputLabel required id="eventoStoricoFk-label">GeoEntity di Arrivo:</InputLabel>
						<TextField id="arrivo" name="arrivo" disabled variant="outlined" fullWidth size="small" 
							value={(arrivo) || ""} 
							label={(puntiArrivo && ("Elementi: " + puntiArrivo.length)) || ""} />
						<hr style={{borderColor: 'red',}} />
						
					</Grid>
				</Grid>
			</Container>
		</>
	);
}