import { Alert, Snackbar } from '@mui/material'
import React from 'react'

export const MySnackbar = ({ open, handleClose, type, message }) => {
    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}
