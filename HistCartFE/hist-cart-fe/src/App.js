import { Route, Routes } from "react-router-dom";
import MainTemplate from "../src/mainLayout/template/mainTemplate"

import ErrorPage from "../src/mainLayout/errorPage"

import Home from "./pages/Home";

import "./App.css";

import Mappa from "./pages/Mappa";

import EventiStorici from "./pages/EventiStorici";
import EventoStorico from "./pages/EventoStorico";

import LeggendeCorrelate from "./pages/LeggendeCorrelate";
import LeggendaCorrelata from "./pages/LeggendaCorrelata";

import GeoEntitiesPartenza from "./pages/GeoEntitiesPartenza";
import GeoEntityPartenza from "./pages/GeoEntityPartenza";

import GeoEntitiesArrivo from "./pages/GeoEntitiesArrivo";
import GeoEntityArrivo from "./pages/GeoEntityArrivo";

function App() {
	
	return (
		
		<div>
			<MainTemplate>
				<Routes>
					<Route path="/" element={<Home />} />
					
					<Route path="/mappa/" element={<Mappa />} />
					
					<Route path="/eventiStorici/" element={<EventiStorici />} />
					<Route path="/eventoStorico/:id" element={<EventoStorico />} />
					
					<Route path="/leggendeCorrelate/" element={<LeggendeCorrelate />} />
					<Route path="/leggendaCorrelata/:id" element={<LeggendaCorrelata />} />
					
					<Route path="/geoEntitiesPartenza/" element={<GeoEntitiesPartenza />} />
					<Route path="/geoEntityPartenza/:id" element={<GeoEntityPartenza />} />
					
					<Route path="/geoEntitiesArrivo/" element={<GeoEntitiesArrivo />} />
					<Route path="/geoEntityArrivo/:id" element={<GeoEntityArrivo />} />
					
					<Route path="/errorPage" element={<ErrorPage />} />
				</Routes>
			</MainTemplate>
		</div>
	);
}

export default App;
