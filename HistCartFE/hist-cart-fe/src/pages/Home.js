import { Button, Container, Grid, Typography, Box } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import { setAlertMessage } from "../ui/MultiSnackbars.js";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { trackPromise } from 'react-promise-tracker';
import axios from "axios";
import {gestisciErroreSuOperazioniVarie} from "../utils/AxiosErrorsHandlers";

import {vaiAllaMappa, vaiLeggendeCorrelate, vaiEventiStorici, 
	vaiGeoEntitiesPartenza, vaiGeoEntitiesArrivo} from "../utils/NavigationFunctions.js";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export default function Home() {
		
 	// variabili non di tipo useState (che e' async), per Axios
 	
 	let token = sessionStorage.getItem("jwt");
 	
 	// altre funzioni
	
	const navigate = useNavigate();
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [stats, setStats] = useState({
		eventiStorici: "?", leggendeCorrelate: "?",
		geoEntityPartenza: "?", geoEntityArrivo: "?",
	});
	
	// funzione di caricamento variabili pagina dal sessionStorage
	
	// funzioni di (pre)caricamento dati dal backend
	
	const caricaStatistiche = async () => {
		console.log("Caricamento Statistiche");
				
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/stats/', 
				{ headers: { "Authorization": `Bearer ${token}` } })

			.then(response => {

				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));

					setStats({
						eventiStorici: response.data.eventiStorici,
						leggendeCorrelate: response.data.leggendeCorrelate,
						geoEntityPartenza: response.data.geoEntityPartenza,
						geoEntityArrivo: response.data.geoEntityArrivo,
					});

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
		
		// funzione che carica le statistiche
		caricaStatistiche();
		
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Container maxWidth="xl">
				
				<SnackbarProvider maxSnack={10} />
				
				<br /><br />
				
				<Grid container spacing={2} alignItems="flex-end" >
					
					<Grid item xs={12}>
						<Typography variant='h5' align="center">Di seguito le <b>statistiche</b> per le <b>entita' registrate</b>:</Typography>
						<hr /><br />
					</Grid>
					
					<Grid item xs={3}>
						<Typography variant="h5" align="center"><b>Eventi Storici</b><hr /></Typography>
						<Typography variant="h6" align="justify">
							Registrati: {stats ? (stats.eventiStorici!==null ? stats.eventiStorici : "N.A.") : "ERR."}	<br />
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography variant="h5" align="center"><b>Leggende Correlate</b><hr /></Typography>
						<Typography variant="h6" align="justify">
							Registrate: {stats ? (stats.leggendeCorrelate!==null ? stats.leggendeCorrelate : "N.A.") : "ERR."} <br />
						</Typography>
					</Grid>					
					<Grid item xs={3}>
						<Typography variant="h5" align="center"><b>GeoEntity di partenza</b><hr /></Typography>
						<Typography variant="h6" align="justify">
							Registrati: {stats ? (stats.geoEntityPartenza!==null ? stats.geoEntityPartenza : "N.A.") : "ERR."}	<br />
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography variant="h5" align="center"><b>GeoEntity di arrivo</b><hr /></Typography>
						<Typography variant="h6" align="justify">
							Registrate: {stats ? (stats.geoEntityArrivo!==null ? stats.geoEntityArrivo : "N.A.") : "ERR."} <br />
						</Typography>
					</Grid>
					
					<Grid item xs={12}>
						<hr /><br />
						
						<Box display="flex" justifyContent="space-between">
							<Button variant="contained" startIcon={<TravelExploreIcon />} onClick={() => vaiAllaMappa(navigate, token)}>
								{Messages.BTN_VAI_ALLA_MAPPA}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiEventiStorici(navigate, token)}>
								{Messages.BTN_EVENTI_STORICI}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiLeggendeCorrelate(navigate, token)}>
								{Messages.BTN_LEGGENDE_CORRELATE}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiGeoEntitiesPartenza(navigate, token)}>
								{Messages.BTN_GEOENTITIES_PARTENZA}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiGeoEntitiesArrivo(navigate, token)}>
								{Messages.BTN_GEOENTITIES_ARRIVO}</Button>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}