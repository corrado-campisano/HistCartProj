import React from "react";
import Messages from "../../utils/constants/Messages";
import { Typography } from '@mui/material';
import packageJson from '../../../package.json';

//console.log("packageJson.version: " + packageJson.version);

export default class Footer extends React.Component {
			
	render() {
		
		return (
            <React.Fragment>
                <div style={{
                    backgroundColor: '#002742',
                    height: 40,
                    position: "fixed",
                    bottom: 0,
                    //left: 0,
                    //marginTop: 5,
                    display: "flex",
                    width: "100%"
                }}>
                    <a style={{textDecoration: "none"}} target="_blank" rel="noreferrer" 
                    	href="/">
                    	<Typography variant="body2" noWrap style={{flexGrow: 1, padding:20, textAlign: "start", color:"white"}}>
                    		{Messages.MSG_APPNAME}</Typography>
                    </a>
                    
                    <Typography variant="body2" noWrap style={{flexGrow: 1, padding:20, textAlign: "end", color:"white"}}>
                    	{Messages.MSG_VERSION} {packageJson.version}</Typography>
                </div>
            </React.Fragment>
        );
	}
}
