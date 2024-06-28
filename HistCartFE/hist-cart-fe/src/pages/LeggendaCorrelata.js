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

import { vaiLeggendaCorrelata } from "../utils/NavigationFunctions.js";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

import SaveIcon from '@mui/icons-material/Save';

import { COLORS } from "../ui/colors.js";

export default function LeggendaCorrelata() {
		
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
	}
	
	const locMarToEveSto = (newPos) => {
		setPosition(newPos);
	}
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [pageTitle, setPageTitle] = useState('');
	const [buttonTitle, setButtonTitle] = useState('');
	
	const [eventiStorici, setEventiStorici] = useState([]);
	const handleChangeEventiStorici = (event) => {
		//setEventiStorici.target.value);
		const {
			target: { value },
		} = event;
		setEventiStorici(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};
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
	
	const [data, setData] = useState('');
	const [dataError, setDataError] = useState('');
	
	const [position, setPosition] = useState(null);
	
	const [latlngError, setLatlngError] = useState("");
		
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
	
	const caricaLeggendaCorrelata = async () => {
		console.log("Caricamento LeggendaCorrelata");
		
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/leggendeCorrelate/' + id, 
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
					
					if (response.data.eventiStorici) {
						setEventiStorici(response.data.eventiStorici);
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
	
	const creaNuova = async () => {
		console.log("Creazione nuova LeggendaCorrelata");
		
		cleanErrorMessages();
		
		if (!position) {
			setLatlngError(Messages.ERR_NO_POSITION_SELECTED);
			return;
		}
		
		const nuovaLeggendaCorrelata = {
			id: id,
			descrizione: descrizione,
			wikiLink: wikiLink,
			date: data,
			latitude: position.lat,
			longitude: position.lng,
			eventiStorici: eventiStorici,
		};
		//console.log("nuovaLeggendaCorrelata: " + JSON.stringify(nuovaLeggendaCorrelata));
		
		const functionArray = []; const accordionFunctionArray = [];
		functionArray["descrizione"] = setDescrizioneError;
		functionArray["wikiLink"] = setWikiLinkError;
		functionArray["date"] = setDataError;
		functionArray["latlng"] = setLatlngError;
		
		trackPromise(
			axios.post(Constants.REACT_APP_BACK_END_URL + '/api/leggendeCorrelate/', nuovaLeggendaCorrelata, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {
				
				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));	
					
					setAlertMessage(response.data.message, "success");
					
					if (id==="0" && response.data.entityId) {
						vaiLeggendaCorrelata(navigate, token, response.data.entityId);
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
			setPageTitle(Messages.MSG_MOD_LEGGENDA_CORRELATA);
			setButtonTitle(Messages.BTN_SALVA);
			
			caricaLeggendaCorrelata();
			
		} else {
			setPageTitle(Messages.MSG_NEW_LEGGENDA_CORRELATA);
			setButtonTitle(Messages.BTN_NUOVA);
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
								<InputLabel required id="eventiCorrelati-label">Eventi Correlati:</InputLabel>
								<Select
									labelId="eventiCorrelati-label"
									id="eventiCorrelati" name="eventiCorrelati" 
									value={eventiStorici || []} fullWidth
									label="Eventi Correlati"
									size="small" multiple
									onChange={handleChangeEventiStorici}
								>
									{listEventiStorici}
								</Select>
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
							<LocationMarker locMarToEveSto={locMarToEveSto} position={position} />
						</MapContainer>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}