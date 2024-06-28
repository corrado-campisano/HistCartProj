import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import {CustomSpinner} from "./ui/CustomSpinner"

export const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    
    window.scroll(0,0);
    document.body.scroll(0,0);
    
    promiseInProgress ? document.body.style.overflow="hidden" : document.body.style.overflow="auto";
    
    return (
        promiseInProgress && <CustomSpinner/>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// lasciare abilitato normalmente, in quanto e' raccomandato in sviluppo,
// ma disabilitare per evitare i doppi caricamenti dei componenti della UI,
// che spesso comportano doppie chiamate alle API che popolano tali componenti,
// il che rende il "debugging" (fatto attraverso il console.log) ingestibile:
// disabilitare quindi solo in caso serva fare "debugging" piu' "preciso"...
const doStrictMode = true;

if (doStrictMode) {
	
	root.render(
		<React.StrictMode>
			<Router>
				<LoadingIndicator/>
				<App />
			</Router>
		</React.StrictMode>
	);
	
} else {
	
	root.render(
		<Router>
			<LoadingIndicator/>
			<App />
		</Router>
	);
}