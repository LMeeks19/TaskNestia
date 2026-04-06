import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme, IconButton, Divider, Tooltip, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import NestedEntityType from "../enums/nestedEntityTypeEnum";
import { addItem, addSection } from "../server/requests";
import CreateSectionRequestModel from "../server/models/createSectionRequestModel";
import CreateItemRequestModel from "../server/models/createItemRequestModel";
import { useRecoilState } from "recoil";
import { nestedEntitiesState } from "../state/globalState";
import SectionModel from "../models/sectionModel";
import ItemModel from "../models/itemModel";

export default function AddNestedEntityDialog(props: { sheetId: number, sectionId?: number }) {
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);

    const [open, setOpen] = useState(false);

    const [selectedName, setSelectedName] = useState("");
    const [selectedType, setSelectedType] = useState<NestedEntityType | -1>(props.sectionId ? NestedEntityType.Item : -1);
    const [description, setDescription] = useState<string | null>(null);

    const theme = useTheme();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedName("");
        setSelectedType(props.sectionId ? NestedEntityType.Item : -1);
        setDescription(null);
        setOpen(false);
    };

    const createNestedEntity = async () => {
        if (selectedType === NestedEntityType.Section) {
            var sectionRequest = {
                name: selectedName,
                sheetId: props.sheetId
            } as CreateSectionRequestModel
            var sectionResponse = await addSection(sectionRequest);
            setNestedEntities((nestedEntities) => [sectionResponse as SectionModel, ...nestedEntities]);
        } else if (selectedType === NestedEntityType.Item) {
            var itemRequest = {
                sheetId: props.sheetId,
                sectionId: props.sectionId,
                name: selectedName,
                description: description ?? ""
            } as CreateItemRequestModel
            var itemResponse = await addItem(itemRequest);

            if (props.sectionId) {
                setNestedEntities(nestedEntities.map((ne) => {
                    if (ne.id === props.sectionId) {
                        var section = ne as SectionModel;
                        return { ...section, items: [itemResponse, ...section.items] }
                    }
                    return ne;
                }));
            }
            else {
                setNestedEntities((nestedEntities) => [itemResponse as ItemModel, ...nestedEntities]);
            }
        }
        handleClose();
    }

    return (
        <Fragment>
            <Tooltip title="Add" placement="top" followCursor arrow>
                <AddIcon onClick={handleClickOpen} sx={{ cursor: 'pointer' }} />
            </Tooltip>
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: '15px' } }} fullWidth>
                <DialogTitle sx={{ background: theme.palette.primary.main, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    ADD {props.sectionId ? 'ITEM' : 'SECTION OR ITEM'}
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px 24px !important' }}>
                    <TextField slotProps={{ htmlInput: { maxLength: 50 } }} error={!selectedName} helperText={!selectedName && "A name is required"} value={selectedName} onChange={(e) => setSelectedName(e.target.value)} variant="standard" label="Name" placeholder="Enter name..." fullWidth sx={{ '& .MuiInputLabel-root': { color: 'inherit' }, '& .MuiInput-root': { color: 'inherit', '::before': { borderBottomColor: '#1976d244' } } }} />
                    <Select error={selectedType === -1} value={selectedType} onChange={(e) => setSelectedType(e.target.value as NestedEntityType)} variant="standard" label="Type" fullWidth sx={{ mt: 3, color: 'inherit', '::before': { borderBottomColor: '#1976d244' }, '& .MuiSvgIcon-root': { color: 'inherit' } }}>
                        <MenuItem value={-1}>Select type...</MenuItem>
                        {!props.sectionId && (
                            <MenuItem value={NestedEntityType.Section}>Section</MenuItem>
                        )}
                        <MenuItem value={NestedEntityType.Item}>Item</MenuItem>
                    </Select>
                    {selectedType === NestedEntityType.Item && (
                        <TextField slotProps={{ htmlInput: { maxLength: 100 } }} value={description} onChange={(e) => setDescription(e.target.value)} variant="standard" label="Description" fullWidth multiline rows={4} sx={{ mt: 3, '& .MuiInputLabel-root': { color: 'inherit' }, '& .MuiInput-root': { color: 'inherit', '::before': { borderBottomColor: '#1976d244' } } }} />
                    )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ padding: 2 }}>
                    <Button disabled={!selectedName || selectedType === -1} onClick={() => createNestedEntity()} sx={{ borderRadius: 2, minWidth: 'fit-content', px: '12px' }} variant="contained">
                        <AddIcon />
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
