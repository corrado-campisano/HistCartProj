import { Container, Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { lightBlue } from '@mui/material/colors';

export default function ErrorPage() {
	
	const REACT_APP_CPF_URL = window.params.REACT_APP_CPF_URL;
	
	const primary = lightBlue[500];
	
	const tornaSuCpf = () => {
		window.location.replace(REACT_APP_CPF_URL + "/cpf");
	};
	
	const [errorParams] = useSearchParams();

	const [errorMessage, setErrorMessage] = useState(''); 
	
	useEffect(() => {
		console.log("Error page params: " + errorParams);
		
		switch (errorParams.get("error")) {
			
			// per tutti
			
			case 'jwtTokenNull':
				setErrorMessage("Nessun utente loggato (nessun token JWT)");
				break;
			
			case 'jwtTokenExpirationUnknown':
				setErrorMessage("Impossibile determinare la scadenza del token JWT)");
				break;
				
			case 'jwtTokenExpired':
				setErrorMessage("Il token JWT e' scaduto");
				break;
				
			case 'noClaimsInJwtToken':
				setErrorMessage("Nessun 'CLAIM' nel token JWT");
				break;
			
			case 'userIdNull':
				setErrorMessage("Impossibile recuperare lo 'username' dal token JWT");
				break;
						
			case 'appNameNull':
				setErrorMessage("Impossibile recuperare il nome applicazione dal token JWT");
				break;
						
			case 'appNameWrong':
				setErrorMessage("Il nome applicazione presente nel token JWT non e' quello atteso");
				break;
				
			case 'funzioniAbilitateNull':
				setErrorMessage("Impossibile recuperare le funzioni abilitate per l'utente");
				break;
			
			case 'funzioniAbilitateNoFatturazioneAttiva':
				setErrorMessage("Non ci sono funzioni abilitate per l'utente per la Fatturazione Attiva");
				break;
			
			// alcuni sono per tutti, alcuni per certi tipi di fatturazione
			// TODO : meglio separarli ed etichettarli con commento appropriato
			
			// TODO : questo ad esempio e' solo per la 3=specialistica 
			case 'tagOrdineNull':
				setErrorMessage("Impossibile recuperare il 'tagOrdine' dal SessionStorage");
				break;
						
			case 'fornitoreNull':
				setErrorMessage("Impossibile recuperare il 'fornitore' dal token JWT");
				break;
			
			case 'codiceFornitoreNull':
				setErrorMessage("Impossibile recuperare il 'codiceFornitore' dal token JWT");
				break;
			
			case 'codiceFornitoreEsternoNull':
				setErrorMessage("Impossibile recuperare il 'codiceFornitoreEsterno' dal token JWT");
				break;
			
			case 'flagGruppoIvaNull':
				setErrorMessage("Impossibile recuperare il 'flagGruppoIva' dal token JWT");
				break;
			
			case 'headerNull':
				setErrorMessage("Nessun 'HEADER' nel token JWT");
				break;
				
			case 'datiTrasmissioneNull':
				setErrorMessage("Impossibile recuperare i 'dati trasmissione' dal token JWT");
				break;
			
			case 'formatoTrasmissioneNull':
				setErrorMessage("Impossibile recuperare il 'formato trasmissione' dal token JWT");
				break;
			
			case 'idTrasmittenteNull':
				setErrorMessage("Impossibile recuperare lo 'id trasmittente' dal token JWT");
				break;
				
			case 'cedentePrestatoreNull':
				setErrorMessage("Impossibile recuperare il 'cedente prestatore' dal token JWT");
				break;
				
			case 'datiAnagraficiNull':
				setErrorMessage("Impossibile recuperare i 'dati anagrafici' dal token JWT");
				break;
				
			case 'sedeCedentePrestatoreNull':
				setErrorMessage("Impossibile recuperare la 'sede' del 'cedente prestatore' dal token JWT");
				break;
				
			case 'tipoFatturazioneNull':
				setErrorMessage("Impossibile recuperare la 'tipologia di fatturazione' dal token JWT");
				break;
				
			case 'codiceFarmaciaNull':
				setErrorMessage("Impossibile recuperare il 'codice farmacia' dal token JWT");
				break;
								
			case 'listaIbanNull':
				setErrorMessage("Impossibile recuperare alcun IBAN per il pagamento dal token JWT");
				break;
				
			default:
				setErrorMessage("Errore non specificato");
		};
	
		// eslint-disable-next-line
	}, []);
	
	const containerStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		minHeight: '80vh',
		backgroundColor: primary,
	};
	
	return (
		
		<Container maxWidth="xl" sx={containerStyle}>
			
			<Grid container spacing={2} alignItems="center">
				<Grid item xs={12} alignItems="center">
							
					<Typography variant="h5" style={{ color: 'white' }}>
						Errore: {errorMessage}
					</Typography>					
					<hr />
					
					<Button
						variant="contained"
						color="primary"
						size="small"
						startIcon={<ArrowBackIcon />}
						style={{ marginLeft: 16 }}
						onClick={() => { tornaSuCpf(); }}
						>
						Torna su Sistema Pagamenti per il login
					</Button>
					
				</Grid>
			</Grid>			
		</Container>
	);
}