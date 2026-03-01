import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, ButtonPropsColorOverrides, Typography } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { ReactElement, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CancelIcon from "@mui/icons-material/CancelOutlined";

export default function ConfirmDialog(params: { confirmDialogProps: ConfirmDialogProps }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteSheet = () => {
        params.confirmDialogProps.action();
        handleClose;
    }

    return (
        <Fragment>
            <Button sx={{ display: 'flex', gap: 0.5, px: 1 }} color={params.confirmDialogProps.mainButtonColour} variant="contained" onClick={handleClickOpen}>
                {params.confirmDialogProps.mainButtonIcon}
                {params.confirmDialogProps.mainButtonText}
            </Button>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: '15px' } }}
            >
                <DialogTitle sx={{ background: '#e20808' }}>
                    {params.confirmDialogProps.title.toUpperCase()}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText sx={{ color: 'inherit' }}>
                        {params.confirmDialogProps.details}
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ padding: 2 }}>
                    <Button sx={{ display: 'flex', gap: 0.5, px: 1 }} color='warning' variant="contained" onClick={handleClose}>
                        <CancelIcon />
                        Cancel
                    </Button>
                    <Button onClick={() => deleteSheet()} sx={{ display: 'flex', gap: 0.5, px: 1 }} color="error" variant="contained">
                        {params.confirmDialogProps.mainButtonIcon}
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export interface ConfirmDialogProps {
    mainButtonText: string;
    mainButtonIcon: ReactElement;
    mainButtonColour: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>
    title: string;
    details: string;
    action: Function
}