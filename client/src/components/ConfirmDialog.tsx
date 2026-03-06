import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ButtonPropsColorOverrides, useTheme, IconButton, Tooltip, Divider } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { ReactElement, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CloseIcon from "@mui/icons-material/CloseOutlined";

export default function ConfirmDialog(params: { confirmDialogProps: ConfirmDialogProps, isNestedEntity?: boolean }) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const action = async () => {
        await params.confirmDialogProps.action()
            .then(handleClose);
    }

    return (
        <Fragment>
            <Tooltip title={params.confirmDialogProps.mainButtonTooltipText} placement="top" followCursor arrow>
                {params.isNestedEntity ? (
                    <IconButton color={params.confirmDialogProps.mainButtonColour} size="small" onClick={handleClickOpen}>
                        {params.confirmDialogProps.mainButtonIcon}
                    </IconButton>
                ) : (
                    <Button sx={{ borderRadius: 2, minWidth: 'fit-content', px: '12px' }} color={params.confirmDialogProps.mainButtonColour} variant="contained" onClick={handleClickOpen}>
                        {params.confirmDialogProps.mainButtonIcon}
                    </Button>
                )}
            </Tooltip>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: '15px' } }} fullWidth>
                <DialogTitle sx={{ background: theme.palette.primary.main, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {params.confirmDialogProps.title.toUpperCase()}
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px 24px !important' }}>
                    <DialogContentText sx={{ color: 'inherit' }}>
                        {params.confirmDialogProps.details}
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={() => action()} sx={{ borderRadius: 2, minWidth: 'fit-content', px: '12px' }} color="error" variant="contained">
                        {params.confirmDialogProps.mainButtonIcon}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export interface ConfirmDialogProps {
    mainButtonTooltipText: string;
    mainButtonIcon: ReactElement;
    mainButtonColour: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>
    title: string;
    details: string;
    action: Function
}