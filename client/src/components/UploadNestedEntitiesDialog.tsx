import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import NestedEntityType from "../enums/nestedEntityTypeEnum";
import SheetModel from "../models/sheetModel";
import { useRecoilValue } from "recoil";
import { sheetsState } from "../state/globalState";
import UploadDataRequestModel from "../server/models/uploadDataRequestModel";
import { uploadNestedEntities } from "../server/requests";

function UploadNestedEntitiesDialog(props: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const sheets = useRecoilValue(sheetsState);
    const theme = useTheme();
    const [selectedType, setSelectedType] = useState<NestedEntityType | -1>(-1);
    const [selectedSheet, setSelectedSheet] = useState<number | -1>(-1);
    const [sectionName, setSectionName] = useState<string | null>(null);
    const [dataToUpload, setDataToUpload] = useState<Array<string>>([]);

    const handleClose = () => {
        resetFields();
        props.setOpen(false);
    };

    const disableUpload = () => {
        if (selectedType === -1 || selectedSheet === -1)
            return true;
        if (selectedType === NestedEntityType.Section && !sectionName)
            return true;
        if (dataToUpload.length === 0)
            return true;
        return false;
    }

    const resetFields = () => {
        setSelectedType(-1);
        setSelectedSheet(-1);
        setSectionName(null);
        setDataToUpload([]);
    }

    const addNestedEntities = async () => {
        var uploadRequest = {
            sheetId: selectedSheet as number,
            type: selectedType as NestedEntityType,
            sectionName: selectedType === NestedEntityType.Section ? sectionName : null,
            uploadData: dataToUpload,
        } as UploadDataRequestModel;
        await uploadNestedEntities(uploadRequest)
            .then(() => resetFields())
            .then(() => handleClose());
    }


    return (
        <Dialog open={props.open} sx={{ '& .MuiPaper-root': { borderRadius: '15px' } }} fullWidth>
            <DialogTitle sx={{ background: theme.palette.primary.main, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                UPLOAD
                <IconButton size="small" color="inherit" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '20px 24px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Select error={selectedSheet === -1} value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)} variant="standard" label="Sheet" fullWidth sx={{ mt: 3, color: 'inherit', '::before': { borderBottomColor: '#1976d244' }, '& .MuiSvgIcon-root': { color: 'inherit' } }}>
                    <MenuItem value={-1}>Select sheet...</MenuItem>
                    {sheets.map(sheet =>
                        <MenuItem key={sheet.id} value={sheet.id}>{sheet.name}</MenuItem>
                    )}
                </Select>
                <Select error={selectedType === -1} value={selectedType} onChange={(e) => setSelectedType(e.target.value as NestedEntityType)} variant="standard" label="Type" fullWidth sx={{ mt: 3, color: 'inherit', '::before': { borderBottomColor: '#1976d244' }, '& .MuiSvgIcon-root': { color: 'inherit' } }}>
                    <MenuItem value={-1}>Select type...</MenuItem>
                    <MenuItem value={NestedEntityType.Section}>Section</MenuItem>
                    <MenuItem value={NestedEntityType.Item}>Item</MenuItem>
                </Select>
                {selectedType === NestedEntityType.Section &&
                    <TextField variant="standard" placeholder="Enter section name" label="Section name" onChange={(e) => setSectionName(e.target.value)}
                        sx={{ '& .MuiInputLabel-root': { color: 'inherit' }, '& .MuiInput-root': { color: 'inherit', '::before': { borderBottomColor: '#1976d244' } } }} fullWidth
                    />
                }
                {selectedType !== -1 && (
                    <TextField variant="standard" multiline rows={10} placeholder="Enter data to upload" label="Upload data" onChange={(e) => setDataToUpload(e.target.value.split(/\n|\r|\d+\.\s|,/).map(s => s.trim()).filter(s => s.length > 0))}
                        sx={{ '& .MuiInputLabel-root': { color: 'inherit' }, '& .MuiInput-root': { color: 'inherit', '::before': { borderBottomColor: '#1976d244' } } }} fullWidth
                    />
                )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={() => addNestedEntities()} disabled={disableUpload()} sx={{ borderRadius: 2, minWidth: 'fit-content', px: '12px' }} variant="contained">
                    <AddIcon />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UploadNestedEntitiesDialog;