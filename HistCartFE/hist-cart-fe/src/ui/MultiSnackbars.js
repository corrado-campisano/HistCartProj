import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar, closeSnackbar } from 'notistack';

const action = snackbarId => (
		<>
    		<IconButton onClick={() => closeSnackbar(snackbarId)}>
				<Typography variant='body1'>Chiudi</Typography>
				<CloseIcon />
			</IconButton>
		</>
	);

const style = {
    'fontFamily': 'Roboto, Helvetica, Arial, sans-serif',
};

export function setAlertMessage(message, variant) {
	
	//const variant = "error"|"warning"|"info"|"success";
	//console.info("Aggiunta snackbar di tipo: " + variant + ", con msg: " + message);
	
	enqueueSnackbar(""+message, { style, variant, action, persist: true });
	//console.warn("snackbar aggiunto con id: " + id);
};