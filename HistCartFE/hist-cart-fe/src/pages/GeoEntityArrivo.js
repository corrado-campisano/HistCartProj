import { Button, Container, Grid, Typography, Box, TextField, 
	FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { setAlertMessage } from "../ui/MultiSnackbars.js";

import { MapContainer, TileLayer } from "react-leaflet";
import { PolygonMarker} from "../ui/PolygonMarker.js";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackPromise } from 'react-promise-tracker';
import axios from "axios";
import { gestisciErroreSuCaricamentoDecodificheInterne, 
	gestisciErroreSuCaricamentoEntita, gestisciErroreSuSalvataggioEntita} from "../utils/AxiosErrorsHandlers";

import { vaiGeoEntityArrivo } from "../utils/NavigationFunctions.js";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

import SaveIcon from '@mui/icons-material/Save';

import { COLORS } from "../ui/colors.js";

export default function GeoEntityPartenza() {
		
 	// variabili non di tipo useState (che e' async), per Axios
 	
 	let token = sessionStorage.getItem("jwt");
 		
 	const { id } = useParams();
 	
 	// altre funzioni
	
	const navigate = useNavigate();
	
	const cleanErrorMessages = () => {
		// pulizia snackbar errore
		closeSnackbar();

		// pulizia messaggi errore
		
		setDescrizioneError("");
		setWikiLinkError("");
		setPolygonError("");
	}
	
	const polyMarToGeoEntity = (routeStep) => {
		console.log("route step: " + JSON.stringify(routeStep));
		
		if (!polygon) {
			setPolygon(new Array);
		}
		
		setPolygon([...polygon, routeStep]);
		console.log("polygon: " + JSON.stringify(polygon));
	}
	
	const cleanPolygon = () => {
		setPolygon(new Array);
		setIsClosed(false);
	}
	
	const closePolygon = () => {
		setIsClosed(true);
	}
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [pageTitle, setPageTitle] = useState('');
	const [buttonTitle, setButtonTitle] = useState('');
	
	const [eventoStoricoPassatoFk, setEventoStoricoPassatoFk] = useState('');
	const handleChangeEventoStoricoPassatoFk = (event) => {
		setEventoStoricoPassatoFk(event.target.value);
	};
	const [eventoStoricoPassatoFkError, setEventoStoricoPassatoFkError] = useState('');
	const [listEventiStorici, setListEventiStorici] = useState([]);
	
	const [center, setCenter] = useState([40, 10]);
	
	const [zoom, setZoom] = useState(5);
	
	const [descrizione, setDescrizione] = useState('');
	const handleChangeDescrizione = (event) => {
		setDescrizione(event.target.value);
	};
	const [descrizioneError, setDescrizioneError] = useState('');
	
	const [wikiLink, setWikiLink] = useState('');
	const handleChangeWikiLink = (event) => {
		setWikiLink(event.target.value);
	};
	const [wikiLinkError, setWikiLinkError] = useState('');
	
	const [polygon, setPolygon] = useState([]);
	const [polygonError, setPolygonError] = useState('');
	const [isClosed, setIsClosed] = useState(false);
	
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
	
	const caricaGeoEntityArrivo = async () => {
		console.log("Caricamento GeoEntityArrivo");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/geoEntities/' + id, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					setDescrizione(response.data.descrizione);
					setWikiLink(response.data.wikiLink);
					setPolygon(response.data.polygon);
					closePolygon();
					setEventoStoricoPassatoFk(response.data.eventoStoricoPassatoFk);
															
				} else {
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));

					setAlertMessage(Messages.WARN_NO_STATS, "warning");
				}
			})
			
			.catch(function(error) {
				gestisciErroreSuCaricamentoEntita(error, setAlertMessage);
			})
		);
	};
	
	// funzioni di azione (click), oltre a quelle importate da NavigationFunctions.js
	
	const creaNuova = async () => {
		console.log("Creazione nuova GeoEntityArrivo");
		
		cleanErrorMessages();
		
		if (!polygon) {
			setPolygonError(Messages.ERR_NO_POLYGON_DEFINED);
			return;
		}
		
		const nuovaGeoEntityArrivo = {
			id: id,
			partenzaAutArrivo: false, 
			descrizione: descrizione,
			wikiLink: wikiLink,
			polygon: polygon,
			eventoStoricoPassatoFk: eventoStoricoPassatoFk,
		};
		//console.log("nuovaGeoEntityArrivo: " + JSON.stringify(nuovaGeoEntityArrivo));
		
		const functionArray = []; const accordionFunctionArray = [];
		functionArray["descrizione"] = setDescrizioneError;
		functionArray["wikiLink"] = setWikiLinkError;
		functionArray["polygon"] = setPolygonError;
		functionArray["eventoStoricoPassatoFk"] = setEventoStoricoPassatoFkError;
		
		trackPromise(
			axios.post(Constants.REACT_APP_BACK_END_URL + '/api/geoEntities/', nuovaGeoEntityArrivo, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));	
					
					setAlertMessage(response.data.message, "success");
					
					if (id==="0" && response.data.entityId) {
						vaiGeoEntityArrivo(navigate, token, response.data.entityId);
					}
					
				} else {
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));

					setAlertMessage(Messages.ERR_NO_DATA_IN_RESPONSE, "error");
				}
			})

			.catch(function(error) {
				gestisciErroreSuSalvataggioEntita(error, setAlertMessage, functionArray, accordionFunctionArray);
			})
		);
	};
	
	// eseguito (1 o 2 volte) al primo rendering
	
	useEffect(() => {
		
		setCenter([40, 10]);
		setZoom(5);
		
		// funzione che carica le statistiche
		caricaEventiStorici();
		
		if (id!=="0") {
			setPageTitle(Messages.MSG_MOD_GEOENTITY_ARRIVO);
			setButtonTitle(Messages.BTN_SALVA);
			
			caricaGeoEntityArrivo();
			
		} else {
			setPageTitle(Messages.MSG_NEW_GEOENTITY_ARRIVO);
			setButtonTitle(Messages.BTN_NUOVA);
		}
		
		// eslint-disable-next-line
	}, [id]);
	
	useEffect(() => {
		
	}, [polygon]); 

	return (
		<>
			<Container maxWidth="xl">
				
				<SnackbarProvider maxSnack={10} />
				
				<hr />
				<Typography variant='h5'>{pageTitle}</Typography>
				<hr />
				
				<Grid container spacing={2} alignItems="flex-end" >
					
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="flex-end" >
							
							<Grid item xs={12}>
								<TextField  id="descrizione" name="descrizione" value={descrizione || ""} onChange={handleChangeDescrizione}
									label="Descrizione:" variant="outlined" error={descrizioneError !== ""} helperText={descrizioneError}
									required fullWidth size="small" />
							</Grid>
							
							<Grid item xs={12}>
								<TextField  id="wikiLink" name="wikiLink" value={wikiLink || ""} onChange={handleChangeWikiLink}
									label="WikiLink:" variant="outlined" error={wikiLinkError !== ""} helperText={wikiLinkError}
									required fullWidth size="small" />
							</Grid>
							
							<Grid item xs={6}>
								<TextField  id="polygon" name="polygon" value={(polygon && ("Elementi: " + polygon.length)) || ""} disabled 
									label="Polygon:" variant="outlined" fullWidth size="small" 
									error={polygonError !== ""} helperText={polygonError} />								
							</Grid>
							<Grid item xs={6}>
								<Box display="flex" justifyContent="space-evenly">
									<Button variant="contained" startIcon={<SaveIcon/>} onClick={cleanPolygon} >{Messages.BTN_RESET}</Button>
									<Button variant="contained" startIcon={<SaveIcon/>} onClick={closePolygon} >{Messages.BTN_CLOSE}</Button>
								</Box>
							</Grid>
							
							<Grid item xs={12}>
								<InputLabel required id="eventoStoricoPassatoFk-label">Evento Passato:</InputLabel>
								<Select
									labelId="eventoStoricoPassatoFk-label"
									id="eventoStoricoPassatoFk" name="eventoStoricoPassatoFk" 
									value={eventoStoricoPassatoFk || []} fullWidth
									label="Evento Storico Passato" size="small" 
									onChange={handleChangeEventoStoricoPassatoFk}
								>
									{listEventiStorici}
								</Select>
								{eventoStoricoPassatoFkError !== "" && <FormHelperText style={{ color: COLORS.red_error }}>{eventoStoricoPassatoFkError}</FormHelperText>}
							</Grid>
							
							<Grid item xs={6}>
								<Box display="flex" justifyContent="space-evenly">
									<Button variant="contained" startIcon={<SaveIcon/>} onClick={creaNuova} >{buttonTitle}</Button>
								</Box>
							</Grid>
							
						</Grid>
					</Grid>
					
					<Grid item xs={6}>
						<MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ width: "100wh", height: "50vh"}}>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<PolygonMarker polyMarToGeoEntity={polyMarToGeoEntity} polygon={polygon} colorOptions={{color: 'red'}} isClosed={isClosed} />
						</MapContainer>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}