import Messages from "./constants/Messages";

export const gestisciErroreSuSalvataggioEntita = (error, setAlertMessage, functionArray, accordionFunctionArray) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400, 401 e 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else if (error.response.status === 400) {
				// 400 - BAD_REQUEST	--> gestione errori con o senza fieldErrors (solo su salvataggio)
				
				if (error.response.data && !error.response.data.fieldErrors) {
					// gestione errori semplici, senza fieldErrors
					// (vale per blocchi opzionali tipo RappresentanteFiscale, TerzoIntermediario, DatiTrasporto, ecc)
					// mostro il messaggio di errore restituito dal server
					// lo includo cmq in tutte le pagine, visto che puo' accadere che non ci siano fieldErrors
					
					setAlertMessage(error.response.data, "error");
					
				} else if (error.response.data && error.response.data.fieldErrors) {
					// gestione fieldErrors (solo su salvataggio)
					
					// questo e' piu' difficile da gestire, per via dell'accoppiamento con la pagina chiamante:
					// solo il chiamante sa quali field prevede e quali funzioni ha definito per settare i messaggi di errore...
					
					// questo e' il codice originale, per come era usato nel chiamante:
					
					/*
					error.response.data.fieldErrors.forEach((fieldError) => {
						
						if (fieldError.field === 'descrizione') {
							setDescrizioneError(fieldError.message);
						}
						
						// arrFields[fieldError.field] e' il nome del campo in errore, nell'esempio sopra corrisponde a "descrizione"
						// 
						// arrFunctions[fieldError.field] e' il nome della funzione che setta il messaggio di errore per il campo in errore, 
						//                                nell'esempio sopra corrisponde a "setDescrizioneError(fieldError.message)"
						
					});
					*/
					
					// a quanto pare, si fa cosi': https://stackoverflow.com/questions/4908378/javascript-array-of-functions
					// ma questo prevede l'uso di loop su un indice dell'array, non il loop forEach come sopra...
					
					// per cui si provvede a creare un array associativo, come indicato qui: https://www.w3schools.com/js/js_arrays.asp
					// in cui ogni elemento e' fatto cosi': functionArray["nazione"] = setNazioneError; 
					
					error.response.data.fieldErrors.forEach((fieldError) => {
						//console.info("gestisciErroreSuSalvataggioEntita - processing fieldError: " + JSON.stringify(fieldError));
						
						if(functionArray[fieldError.field] instanceof Function) {
							// mostro il messaggio di errore per il campo
							//console.info("mostro il messaggio di errore per il campo: " + fieldError.field);
							functionArray[fieldError.field](fieldError.message);
							
							//console.info("accordionFunctionArray esiste: " + (accordionFunctionArray!== undefined));
							//console.info("accordionFunctionArray e' un array: " + Array.isArray(accordionFunctionArray));
							//console.info("Funzione per l'accordion del campo '" + fieldError.field + "': " + (accordionFunctionArray[fieldError.field].name));
							//console.info("Si tratta proprio di una funzione: " + (accordionFunctionArray[fieldError.field] instanceof Function));
							if (accordionFunctionArray && Array.isArray(accordionFunctionArray) && accordionFunctionArray[fieldError.field] instanceof Function) {
								// espando l'accordion che contiene il campo
								//console.info("espando l'accordion che contiene il campo: " + fieldError.field);
								accordionFunctionArray[fieldError.field](true);
							} else {
								console.info("Nessun accordion da espandere per il campo:" + fieldError.field);
							}
							
						} else {
							console.error("Errore in gestisciErroreSuSalvataggioEntita: funzione '" + functionArray[fieldError.field] + "' non definita");
						}
					});
					
				} else {
					// questo non dovrebbe mai succedere
					console.error("error.response: " + JSON.stringify(error.response));
					
					setAlertMessage(Messages.ERR_GENERIC, "error");
				}
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};

export const gestisciErroreSuCaricamentoEntita = (error, setAlertMessage) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}

	// questo include diversi errori (almeno 400 e 403, ma qui ci aspettiamo solo il 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};

export const gestisciErroreSuEliminazioneEntita = (error, setAlertMessage) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400 e 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else if (error.response.status === 400) {
				// 400 - BAD_REQUEST
				console.error("error.response: " + JSON.stringify(error.response));
				
				if (error.response.data) {
					console.error("error.response.data: " + JSON.stringify(error.response.data));
					
					// mostro il messaggio di errore restituito dal server
					
					setAlertMessage(error.response.data, "error");
					
				} else {
					// questo non dovrebbe mai succedere
					console.error("error.response: " + JSON.stringify(error.response));
					
					setAlertMessage(Messages.ERR_GENERIC, "error");
				}							
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};

export const gestisciErroreSuOperazioniVarie = (error, setAlertMessage) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400 e 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else if (error.response.status === 400) {
				// 400 - BAD_REQUEST
				//console.error("error.response: " + JSON.stringify(error.response));
				
				if (error.response.data) {
					//console.error("error.response.data: " + JSON.stringify(error.response.data));
					// mostro il messaggio di errore restituito dal server
					
					setAlertMessage(error.response.data, "error");
					
				} else {
					// questo non dovrebbe mai succedere
					console.error("error.response: " + JSON.stringify(error.response));
					
					setAlertMessage(Messages.ERR_GENERIC, "error");
				}					
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};

export const gestisciErroreSuDownloadVari = (error, responseObj, setAlertMessage) => {
	console.error("error.code: " + error.code);
	
	// The reason is that the response type is blob.
	// In case of error, the status code is available directly in your exception object. 
	// However, the response is a promise. --> il messaggio di errore e' nel responseObj
	console.error("responseObj: " + JSON.stringify(responseObj));
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400 e 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else if (error.response.status === 400) {
				// 400 - BAD_REQUEST
				console.error("error.response: " + JSON.stringify(error.response));
				
				if (responseObj) {
					// mostro il messaggio di errore restituito dal server
					
					setAlertMessage(responseObj, "error");
					
				} else {
					// questo non dovrebbe mai succedere
					console.error("error.response: " + JSON.stringify(error.response));
					
					setAlertMessage(Messages.ERR_GENERIC, "error");
				}					
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};
export const gestisciErroreSuCaricamentoDecodificheInterne = (error, setAlertMessage) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400 e 403, ma qui ci aspettiamo solo il 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");
};

export const gestisciErroreSuCaricamentoDecodificheEsterne = (error, setAlertMessage) => {
	console.error("error.code: " + error.code);
				
	// questo include problemi di rete come il timeout
	if (error.code === "ERR_NETWORK") {
		console.error("Timeout - server is not responding");
		
		setAlertMessage(Messages.ERR_NETWORK, "error");
		return;
	}
	
	// questo include diversi errori (almeno 400 e 403, ma qui ci aspettiamo solo il 403):
	if (error.code === "ERR_BAD_REQUEST") {
		console.error("Errore - Bad Request, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.status === 401) {
				// 401 - UNAUTHORIZED	--> token JWT scaduto
				
				setAlertMessage(Messages.ERR_TOKEN_EXPIRED, "error");
				
			} else if (error.response.status === 403) {
				// 403 - FORBIDDEN		--> problema credenziali
				
				setAlertMessage(Messages.ERR_FORBIDDEN, "error");
				
			} else if (error.response.status === 409) {
				// 409 - CONFLICT		--> errore nello stato di un elemento
				
				if (error.response.data) {
					setAlertMessage(error.response.data, "warning");
				} else {
					setAlertMessage(Messages.ERR_FORBIDDEN, "error");				
				}
				
			} else {
				// errore non gestito specificamente
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_GENERIC, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));
		}
		return;
	}
	
	// questo include diversi errori (almeno il 500)
	if (error.code === "ERR_BAD_RESPONSE") {
		console.error("Errore - Bad Response, verifica status code");
		
		if (error.response) {
			// c'e' un dettaglio dell'errore
			
			if (error.response.data) {
				
				if (error.response.data.message) {
					console.error("error.response.data.message: " + JSON.stringify(error.response.data.message));
					
					// c'e' un messaggio di errore
					setAlertMessage("Errore del server: " + error.response.data.message, "error");
					
				} else {
					// nessun messaggio di errore
					console.error("error.response: " + JSON.stringify(error.response.data));
					
					setAlertMessage("Errore del server: " + error.response.data, "error");
				}
				
			} else {
				// nessun messaggio di errore
				console.error("error.response: " + JSON.stringify(error.response));
				
				setAlertMessage(Messages.ERR_NO_MESSAGE_IN_ERROR, "error");
			}
			
		} else {
			// nessun dettaglio di errore
			
			setAlertMessage(Messages.ERR_NO_RESPONSE_IN_ERROR, "error");
			
			if (error.request) {
				console.error("error.request: " + JSON.stringify(error.request));
			} else {
				console.error('error.message: ' + JSON.stringify(error.message));
			}
			console.error("error.config :" + JSON.stringify(error.config));						
		}
		return;
	}
	
	// se sono arrivato qui vuol dire che si tratta di un errore non gestito
	if (error.request) {
		console.error("error.request: " + JSON.stringify(error.request));
	} else {
		console.error('error.message: ' + JSON.stringify(error.message));
	}
	console.error("error.config :" + JSON.stringify(error.config));
	setAlertMessage(Messages.ERR_NOT_HANDLED + error.code, "error");	
};
