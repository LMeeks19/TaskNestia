import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme, IconButton, Divider, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import SheetModel from "../models/sheetModel";
import { addSheet } from "../server/requests";

export default function AddSheetDialog(props: { sheets: Array<SheetModel>, setSheets: Dispatch<SetStateAction<SheetModel[]>> }) {
    const [open, setOpen] = useState(false);
    const [sheetName, setSheetName] = useState<string>("");
    const theme = useTheme();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createSheet = async () => {
        await addSheet(sheetName)
            .then((sheet) => props.setSheets([sheet, ...props.sheets]))
            .then(() => setSheetName(""))
            .then(handleClose);
    }

    return (
        <Fragment>
            <Tooltip title="Add" placement="top" followCursor arrow>
                <Button sx={{ borderRadius: '15px 15px 0 0', minWidth: 'fit-content', px: '12px' }} variant="contained" onClick={handleClickOpen}>
                    <AddIcon />
                </Button>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: '15px' } }} fullWidth>
                <DialogTitle sx={{ background: theme.palette.primary.main, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    ADD SHEET
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px 24px !important' }}>
                    <TextField variant="standard" placeholder="Enter name" label="Name" sx={{ '& .MuiInputLabel-root': { color: 'inherit' }, '& .MuiInput-root': { color: 'inherit', '::before': { borderBottomColor: '#1976d244' } } }} onChange={(e) => setSheetName(e.target.value)} fullWidth />
                </DialogContent>
                <Divider />
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={() => createSheet()} sx={{ borderRadius: 2, minWidth: 'fit-content', px: '12px' }} variant="contained">
                        <AddIcon />
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
