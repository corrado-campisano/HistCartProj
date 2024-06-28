import { CircularProgress } from '@mui/material';
import React from "react";
import { Backdrop } from '@mui/material';

export class CustomSpinner extends React.Component {
    render () {
        return (
            <div>
                <Backdrop style={{zIndex: 999999}} open={true}>
                    <CircularProgress />
                </Backdrop>
            </div>
        )}
}