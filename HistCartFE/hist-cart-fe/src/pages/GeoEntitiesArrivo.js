import { Button, Container, Typography, Box, Divider, Grid } from "@mui/material";
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { setAlertMessage } from "../ui/MultiSnackbars.js";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid, itIT } from '@mui/x-data-grid';

import { trackPromise } from 'react-promise-tracker';
import axios from "axios";
import { gestisciErroreSuCaricamentoEntita, gestisciErroreSuEliminazioneEntita } from "../utils/AxiosErrorsHandlers";

import {vaiAllaHome, vaiAllaMappa, vaiGeoEntityPartenza, vaiLeggendeCorrelate, 
	vaiGeoEntitiesArrivo, vaiEventiStorici, vaiGeoEntityArrivo, vaiGeoEntitiesPartenza} from "../utils/NavigationFunctions.js";

import Messages from "../utils/constants/Messages";
import Constants from "../utils/constants/Constants";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export default function GeoEntitiesArrivo() {
		
 	// variabili non di tipo useState (che e' async), per Axios
 	
 	let token = sessionStorage.getItem("jwt");
 	
 	// funzioni per le colonne della tabella DataGrid e i pulsanti dentro a queste

	const renderActionButton = (params) => {
		//console.log("params.row: " + JSON.stringify(params.row));
		
		return (
			<>
				<Button
					variant="contained"
					color="primary"
					startIcon={<EditIcon />}
					size="small"
					style={{ marginLeft: 16 }}
					onClick={() => {
						modifica(params.row.id);
					}}>{Messages.BTN_MODIFICA}</Button>
					
				<Button
					variant="contained"
					color="primary"
					size="small"
					startIcon={<DeleteIcon />}
					style={{ marginLeft: 16 }}
					onClick={() => {
						elimina(params.row.id);
					}}>{Messages.BTN_ELIMINA}</Button>
			</>
		);
	};

	const columns = [
		{
			field: 'descrizione', width: 400, hideable: false,
			renderHeader: () => (<Typography variant="h6">{Messages.FLD_LBL_DESCRIZIONE}</Typography>)
		},
		{
			field: 'date', width: 200, hideable: false,
			renderHeader: () => (<Typography variant="h6">{Messages.FLD_LBL_DATA}</Typography>)
		},
		{
			field: 'action-fake', width: 300, hideable: false,
			sortable: false, filterable: false, renderCell: renderActionButton,
			renderHeader: () => (
				<Box display="flex" justifyContent="space-between">
					<Typography variant="h6">{Messages.FLD_LBL_AZIONI}</Typography>
					<Divider variant="middle" />
					<Button variant="contained" size="small" startIcon={<AddIcon />} 
						onClick={() => vaiGeoEntityArrivo(navigate, token, 0)}>
						{Messages.BTN_NUOVO}</Button>
				</Box>
			),
		},
	];
 	
 	// altre funzioni
	
	const navigate = useNavigate();
	
	const cleanErrorMessages = () => {
		// pulizia snackbar errore
		closeSnackbar();

		// pulizia messaggi errore
	}
	
 	// variabili pagina, di tipo useState (che e' async), per UI
 	// --> oltre a loro eventuali event-handler
	
	const [listaElementi, setListaElementi] = useState([]);
	
	// funzione di caricamento variabili pagina dal sessionStorage
	
	// funzioni di (pre)caricamento dati dal backend
	
	const modifica = async (id) => {
		console.log("Modifica GeoEntitiesArrivo di ID: " + id);
		vaiGeoEntityArrivo(navigate, token, id);
	};
	
	const elimina = async (id) => {
		console.log("Eliminazione GeoEntitiesArrivo di ID: " + id);
		
		cleanErrorMessages();
		
		let label = "";
		listaElementi.forEach((element) => { if (element.id===id) label = element.descrizione});
		if (!label) {
			setAlertMessage("Impossibile recuperare la GeoEntitiesArrivo di ID" + id);
			return;			
		}		
		if (!window.confirm(Messages.MSG_DEL_CONF_LEGGENDA_CORRELATA + " '" + label + "' ?")) {
			return;
		}
		
		trackPromise(
			axios.delete(Constants.REACT_APP_BACK_END_URL + '/api/geoEntities/' + id, 
				{ headers: { "Authorization": `Bearer ${token}` } })
			
			.then(response => {

				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));

					setAlertMessage(response.data.message, "success");
					
					caricaGeoEntitiesArrivo();

				} else {
					// questo non dovrebbe mai succedere
					console.error("response: " + JSON.stringify(response));
					
					setAlertMessage(Messages.ERR_NO_DATA_IN_RESPONSE, "error");
				}
			})

			.catch(function(error) {
				gestisciErroreSuEliminazioneEntita(error, setAlertMessage);
			})
		);		
	};
	
	const caricaGeoEntitiesArrivo = async () => {
		console.log("Caricamento GeoEntitiesArrivo");
				
		trackPromise(
			axios.get(Constants.REACT_APP_BACK_END_URL + '/api/geoEntities/list/false', 
				{ headers: { "Authorization": `Bearer ${token}` } })

			.then(response => {

				if (response.data) {
					//console.log("response.data: " + JSON.stringify(response.data));
					
					// qui non e' necessario un AlertMessage: 
					// la lista viene popolata e questo basta
					setListaElementi(response.data);
					
				} else {
					// qui non e' necessario un AlertMessage: 
					// la lista potrebbe legittimamente essere vuota
					setListaElementi([]);
				}
			})
			
			.catch(function(error) {
				gestisciErroreSuCaricamentoEntita(error, setAlertMessage);
			})
		);
	};
	
	// funzioni di azione (click), oltre a quelle importate da NavigationFunctions.js
		
	// eseguito (1 o 2 volte) al primo rendering
	
	useEffect(() => {
		
		// funzione che carica le statistiche
		caricaGeoEntitiesArrivo();
		
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Container maxWidth="xl">
				
				<SnackbarProvider maxSnack={10} />
				
				<hr />
				<Typography variant='h5'>{Messages.LBL_LISTA_GEOENTITIES_ARRIVO}</Typography>
				<hr /><br />
				
				<div style={{ height: 400, width: '100%' }}>
					<DataGrid
						localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
						rows={listaElementi}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[5, 10]}
						getRowId={(row) => row.id}
					/>
				</div>
				
				<Grid container spacing={2} alignItems="flex-end" >
					<Grid item xs={12}>
						<hr /><br />
						
						<Box display="flex" justifyContent="space-between">
							<Button variant="contained" startIcon={<TravelExploreIcon />} onClick={() => vaiAllaMappa(navigate, token)}>
								{Messages.BTN_VAI_ALLA_MAPPA}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiAllaHome(navigate, token)}>
								{Messages.BTN_VAI_ALLA_HOME}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiEventiStorici(navigate, token)}>
								{Messages.BTN_EVENTI_STORICI}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiLeggendeCorrelate(navigate, token)}>
								{Messages.BTN_LEGGENDE_CORRELATE}</Button>
							<Button variant="contained" startIcon={<FormatListNumberedIcon />} onClick={() => vaiGeoEntitiesPartenza(navigate, token)}>
								{Messages.BTN_GEOENTITIES_PARTENZA}</Button>
						</Box>
					</Grid>
				</Grid>
					
			</Container>
		</>
	);
}