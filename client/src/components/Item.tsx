import { Box, FormControlLabel, Grid, IconButton, Typography, useTheme } from "@mui/material";
import ItemModel from "../models/itemModel";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import { deleteItem, updateItem } from "../server/requests";
import { useRecoilState } from "recoil";
import { nestedEntitiesState } from "../state/globalState";
import SectionModel from "../models/sectionModel";
import { updateItemEntity, updateSectionEntity } from "../helpers/recursives";
import ConfirmDialog, { ConfirmDialogProps } from "./ConfirmDialog";

function Item(props: { itemId: number, sectionId?: number }) {
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);
    const [item, setItem] = useState<ItemModel>({} as ItemModel);

    const theme = useTheme();

    useEffect(() => {
        if (props.sectionId) {
            var section = nestedEntities.find(ne => ne.id === props.sectionId) as SectionModel;
            var nestedItem = section.items.find(i => i.id === props.itemId) as ItemModel;
            setItem(nestedItem);
        }
        else {
            var item = nestedEntities.find(ne => ne.id === props.itemId) as ItemModel;
            setItem(item)
        }
    }, [nestedEntities])

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        var updatedItem = await updateItem({ itemId: item.id, isComplete: event.target.checked })

        var updatedNestedEntities = nestedEntities.map((ne) => {
            if (ne.id === item.id)
                return updateItemEntity((ne as ItemModel), updatedItem)
            else if (ne.id === item.sectionId) {
                return updateSectionEntity((ne as SectionModel), {
                    id: item.id,
                    isComplete: updatedItem.isComplete,
                    lastModified: updatedItem.lastModified
                })
            }
            return ne;
        });

        setNestedEntities(updatedNestedEntities);
    }

    const handleDelete = async (id: number) => {
        var deletedItemId = await deleteItem(id);
        if (props.sectionId) {
            setNestedEntities(nestedEntities.map((ne) => {
                if (ne.id === props.sectionId) {
                    var section = ne as SectionModel;
                    return { ...section, items: section.items.filter(i => i.id !== deletedItemId) }
                }
                return ne;
            }))
        }
        else {
            setNestedEntities((nestedEntities) => nestedEntities.filter(ne => ne.id !== deletedItemId));
        }
    }

    const populateConfirmDeleteDialog = (id: number) => {
        return {
            mainButtonTooltipText: "Delete",
            mainButtonIcon: <DeleteIcon />,
            mainButtonColour: "error",
            title: "Delete Item",
            details: "Are you sure you want to delete this item? This cannot be undone!",
            action: () => handleDelete(id)
        } as ConfirmDialogProps
    }

    return (
        <Grid key={item.id} sx={{ opacity: item.isComplete ? 0.5 : 1 }} bgcolor={theme.palette.primary.main} p={!item.sectionId ? 1 : 0} borderRadius={2.5} boxShadow={!item.sectionId ? 1 : 0}>
            <Grid container columns={2} spacing={1} wrap='nowrap' justifyContent='space-between'>
                <FormControlLabel
                    sx={{ mx: 0, gap: 1, overflow: 'hidden', '& .MuiFormControlLabel-label': { overflow: 'hidden' } }}
                    label={
                        <Box display='flex' flexDirection='column' justifyContent='center'>
                            <Typography>{item.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.75 }}>{item.description}</Typography>
                        </Box>
                    }
                    control={<Checkbox
                        sx={{ color: `${theme.palette.primary.contrastText} !important`, p: 0.5 }}
                        checked={item.isComplete}
                        onChange={handleChange}
                    />
                    }
                />
                <Grid size='auto' display='flex' alignItems='center'>
                    <ConfirmDialog confirmDialogProps={populateConfirmDeleteDialog(item.id)} isNestedEntity={true} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Item;