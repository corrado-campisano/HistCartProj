import { Button, Container, Grid, Typography, Box, TextField, 
	FormHelperText, MenuItem, Select, InputLabel } from "@mui/material";
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { setAlertMessage } from "../ui/MultiSnackbars.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

import { MapContainer, TileLayer } from "react-leaflet";
import { LocationMarker} from "../ui/LocationMarker.js";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackPromise } from 'react-promise-tracker';
import axios from "axios";
import { gestisciErroreSuCaricamentoDecodificheInterne, 
	gestisciErroreSuCaricamentoEntita, gestisciErroreSuSalvataggioEntita} from "../utils/AxiosErrorsHandlers";

import { vaiEventoStorico } from "../utils/NavigationFunctions.js";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

import SaveIcon from '@mui/icons-material/Save';

import { COLORS } from "../ui/colors.js";

export default function EventoStorico() {
		
 	// variabili non di tipo useState (che e' async), per Axios
 	
 	let token = sessionStorage.getItem("jwt");
 	
 	let minDate = dayjs('2000-01-01 00:00');
 	minDate = minDate.year(-753);
 	//console.log("minDate: " + minDate);
 	
 	const { id } = useParams();
 	
 	// altre funzioni
	
	const navigate = useNavigate();
	
	const cleanErrorMessages = () => {
		// pulizia snackbar errore
		closeSnackbar();

		// pulizia messaggi errore
		
		setDescrizioneError("");
		setWikiLinkError("");
		setLatlngError("");
		setDataError("");
		setTipoEventoError("");
	}
	
	const locMarToEveSto = (newPos) => {
		setPosition(newPos);
	}
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [pageTitle, setPageTitle] = useState('');
	const [buttonTitle, setButtonTitle] = useState('');
	
	const [leggendeCorrelate, setLeggendeCorrelate] = useState([]);
	const handleChangeLeggendeCorrelate = (event) => {
		//setLeggendeCorrelate(event.target.value);
		const {
			target: { value },
		} = event;
		setLeggendeCorrelate(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);		
	};
	const [listLeggendeCorrelate, setListLeggendeCorrelate] = useState([]);
		
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
	
	const [data, setData] = useState('');
	const [dataError, setDataError] = useState('');
	
	const [tipoEvento, setTipoEvento] = useState('');
	const handleChangeTipoEvento = (event) => {
		setTipoEvento(event.target.value);
	};
	const [listTipiEvento, setListTipiEvento] = useState([]);
	const [tipoEventoError, setTipoEventoError] = useState('');	
	
	const [position, setPosition] = useState(null);
	
	const [latlngError, setLatlngError] = useState("");
		
	// funzione di caricamento variabili pagina dal sessionStorage
	
	// funzioni di (pre)caricamento dati dal backend
	
	const caricaLeggendeCorrelate = async () => {
		console.log("Caricamento LeggendeCorrelate");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/leggendeCorrelate/', 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					const leggendeCorrelateItems = response.data.map(
						(item) => <MenuItem value={item.id} key={item.id}>
							{item.descrizione}
						</MenuItem>
					);
					setListLeggendeCorrelate(leggendeCorrelateItems);
										
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
	
	const caricaTipiEvento = async () => {
		console.log("Caricamento TipiEvento");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/codecs/tipiEvento', 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					const tipiEventoItems = response.data.map(
						(item) => <MenuItem value={item.id} key={item.id}>
							{item.tipo} - {item.descrizione}
						</MenuItem>
					);
					setListTipiEvento(tipiEventoItems);
										
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
	
	const caricaEventoStorico = async () => {
		console.log("Caricamento EventoStorico");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/eventiStorici/' + id, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					setDescrizione(response.data.descrizione);
					setWikiLink(response.data.wikiLink);
					
					const latlng = {
						lat: response.data.latitude,
						lng: response.data.longitude
					};
					console.log("Setting position to: " + JSON.stringify(latlng));
					setPosition(latlng);		
					
					if (response.data.date) {
						const dataJs = dayjs(response.data.date)
						setData(dataJs);
					} else {
						setData("");
					}
					
					if (response.data.tipoEvento) {
						setTipoEvento(response.data.tipoEvento);
					}
					
					if (response.data.leggendeCorrelate) {
						setLeggendeCorrelate(response.data.leggendeCorrelate);
					}
										
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
	
	const creaNuovo = async () => {
		console.log("Creazione nuovo EventoStorico");
		
		cleanErrorMessages();
		
		if (!position) {
			setLatlngError(Messages.ERR_NO_POSITION_SELECTED);
			return;
		}
		
		const nuovoEventoStorico = {
			id: id,
			descrizione: descrizione,
			wikiLink: wikiLink,
			date: data,
			latitude: position.lat,
			longitude: position.lng,
			leggendeCorrelate: leggendeCorrelate,
			tipoEvento: tipoEvento,
		};
		//console.log("nuovoEventoStorico: " + JSON.stringify(nuovoEventoStorico));
		
		const functionArray = []; const accordionFunctionArray = [];
		functionArray["descrizione"] = setDescrizioneError;
		functionArray["wikiLink"] = setWikiLinkError;
		functionArray["date"] = setDataError;
		functionArray["latlng"] = setLatlngError;
		functionArray["tipoEvento"] = setTipoEventoError;
		
		trackPromise(
			axios.post(Constants.REACT_APP_BACK_END_URL + '/api/eventiStorici/', nuovoEventoStorico, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));	
					
					setAlertMessage(response.data.message, "success");
					
					if (id==="0" && response.data.entityId) {
						vaiEventoStorico(navigate, token, response.data.entityId);
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
		
		// funzione che carica la combo con i tipi evento
		caricaTipiEvento();
				
		// funzione che carica la combo con le leggende correlate
		caricaLeggendeCorrelate();
		
		if (id!=="0") {
			setPageTitle(Messages.MSG_MOD_EVENTO_STORICO);
			setButtonTitle(Messages.BTN_SALVA);
			
			caricaEventoStorico();
			
		} else {
			setPageTitle(Messages.MSG_NEW_EVENTO_STORICO);
			setButtonTitle(Messages.BTN_NUOVO);
		}
		
		// eslint-disable-next-line
	}, [id]);

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
							
							<Grid item xs={12}>
								<Grid container spacing={2} alignItems="flex-end" >
									<Grid item xs={6}>
										<TextField  id="lat" name="lat" value={(position && position.lat) || ""} disabled 
											label="Latitude:" variant="outlined" fullWidth size="small" />
									</Grid>
									<Grid item xs={6}>
										<TextField  id="lng" name="lng" value={(position && position.lng) || ""} disabled 
											label="Longitude:" variant="outlined" fullWidth size="small" />
									</Grid>
								</Grid>								
								{latlngError !== "" && <FormHelperText style={{ color: COLORS.red_error }}>{latlngError}</FormHelperText>}
							</Grid>
							
							<Grid item xs={12}>
								<InputLabel required id="leggendeCorrelate-label">Leggende Correlate:</InputLabel>
								<Select
									labelId="leggendeCorrelate-label"
									id="leggendeCorrelate" name="leggendeCorrelate" 
									value={leggendeCorrelate || []} fullWidth
									label="Leggende Correlate"
									size="small" multiple
									onChange={handleChangeLeggendeCorrelate}
								>
									{listLeggendeCorrelate}
								</Select>
							</Grid>
							
							<Grid item xs={12}>
								<InputLabel required id="tipoEvento-label">Tipo Evento:</InputLabel>
								<Select
									labelId="tipoEvento-label"
									id="tipoEvento" name="tipoEvento" 
									value={tipoEvento || []} fullWidth
									label="Tipo Evento"	size="small" 
									onChange={handleChangeTipoEvento}
								>
									{listTipiEvento}
								</Select>
								{tipoEventoError !== "" && <FormHelperText style={{ color: COLORS.red_error }}>{tipoEventoError}</FormHelperText>}
							</Grid>					
							
							<Grid item xs={6}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker minDate={minDate} 
										slotProps={{ textField: { fullWidth: true } }}
										format="YYYY-MM-DD" label="Data:" value={data || ""}
										onChange={(newValue) => { console.log("Data selezionata: " + newValue); setData(newValue) }}
									/>
								</LocalizationProvider>
								{dataError !== "" && <FormHelperText style={{ color: COLORS.red_error }}>{dataError}</FormHelperText>}
							</Grid>
							<Grid item xs={6}>
								<Box display="flex" justifyContent="space-evenly">
									<Button variant="contained" startIcon={<SaveIcon/>} onClick={creaNuovo} >{buttonTitle}</Button>
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
							<LocationMarker locMarToEveSto={locMarToEveSto} position={position} />
						</MapContainer>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}