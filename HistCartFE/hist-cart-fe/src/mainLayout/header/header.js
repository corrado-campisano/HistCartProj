import React, { useCallback, useState } from 'react';
import { AppBar, Drawer, IconButton, ListItemIcon, MenuItem, MenuList, Toolbar, Grid, Typography } from '@mui/material';

import {vaiAllaHome, vaiAllaMappa, vaiLeggendeCorrelate, vaiEventiStorici, 
	vaiGeoEntitiesPartenza, vaiGeoEntitiesArrivo} from "../../utils/NavigationFunctions.js";

import Messages from "../../utils/constants/Messages";

import { useNavigate } from "react-router-dom";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../images/mappamondo.jpg';

export default function Header() {
	
	// funzioni per lo stato del menu aperto/chiuso
	
	const [open, setOpen] = useState(false);

	const toggleDrawer = useCallback(() => {
		setOpen(open => !open);
	}, []);
	
	// variabili non di tipo useState (che e' async), per Axios
 	
	// recupero dati dal sessionStorage
	
 	let token = sessionStorage.getItem("jwt");
 		
	// altre funzioni
	
	const navigate = useNavigate();
	
	const logout = () => {
		sessionStorage.clear();
		window.close();
	}	
	
	// costruisce il menu laterale
	
	const sideList = () => (
		
		<div role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
			
			<MenuList>
				<MenuItem onClick={() => vaiAllaHome(navigate, token)}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<Typography variant="inherit">Home</Typography>
				</MenuItem>
				
				<MenuItem onClick={() => vaiAllaMappa(navigate, token)}>
					<ListItemIcon>
						<TravelExploreIcon />
					</ListItemIcon>
					<Typography variant="inherit">Mappa</Typography>
				</MenuItem>

				<MenuItem onClick={() => vaiEventiStorici(navigate, token)}>
					<ListItemIcon>
						<FormatListNumberedIcon />
					</ListItemIcon>
					<Typography variant="inherit">Eventi Storici</Typography>
				</MenuItem>
				
				<MenuItem onClick={() => vaiLeggendeCorrelate(navigate, token)}>
					<ListItemIcon>
						<FormatListNumberedIcon />
					</ListItemIcon>
					<Typography variant="inherit">Leggende Correlate</Typography>
				</MenuItem>
				
				<MenuItem onClick={() => vaiGeoEntitiesPartenza(navigate, token)}>
					<ListItemIcon>
						<FormatListNumberedIcon />
					</ListItemIcon>
					<Typography variant="inherit">GeoEntities di Partenza</Typography>
				</MenuItem>
				
				<MenuItem onClick={() => vaiGeoEntitiesArrivo(navigate, token)}>
					<ListItemIcon>
						<FormatListNumberedIcon />
					</ListItemIcon>
					<Typography variant="inherit">GeoEntities di Arrivo</Typography>
				</MenuItem>
					
				<MenuItem onClick={logout}>
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<Typography variant="inherit">Logout</Typography>
				</MenuItem>
			</MenuList>
		</div>
	);
	
	return (
		<div>
			<AppBar position="static" style={{ backgroundColor: "#002742" }}>
				<Toolbar>
					<Grid container spacing={1} alignItems="flex-end" >
						<Grid item xs={1}>
							<IconButton edge="start" color="inherit" aria-label="Menu" onClick={toggleDrawer} >
								<MenuIcon />
							</IconButton>
						</Grid>
						
						<Grid item xs={2}>
							<img onClick={() => vaiAllaHome(navigate, token)} src={logo} alt="HistCartPrj Logo" 
								style={{cursor: "pointer", maxWidth: '100%'}} />
						</Grid>
						
						<Grid item xs={9}>
							<Typography variant="h5">{Messages.MSG_APPNAME}</Typography>
						</Grid>				
					</Grid>
					<Drawer open={open} onClose={toggleDrawer} >
						{sideList('left')}
					</Drawer>
				</Toolbar>
			</AppBar>
		</div>
	);
}
