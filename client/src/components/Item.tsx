import { Box, FormControlLabel, Grid, IconButton, Typography } from "@mui/material";
import ItemModel from "../models/itemModel";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import { deleteItem, updateItem } from "../server/requests";
import UpdateItemRequestModel from "../server/models/updateItemRequestModel";
import { useRecoilState } from "recoil";
import { nestedEntitiesState } from "../state/globalState";
import SectionModel from "../models/sectionModel";
import { updateItemEntity, updateSectionEntity } from "../helpers/recursives";
import NestedEntityType from "../enums/nestedEntityTypeEnum";

function Item(props: { itemId: number, sectionId?: number }) {
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);
    const [item, setItem] = useState<ItemModel>({} as ItemModel);

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

    const handleDelete = async () => {
        var deletedItemId = await deleteItem(item.id);
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

    return (
        <Grid key={item.id} sx={{ borderRadius: 5 }}>
            <Grid container columns={2} spacing={1} justifyContent='space-between'>
                <Grid size='auto' sx={{ my: 1 }}>
                    <FormControlLabel
                        label={
                            <Box display='flex' flexDirection='column' justifyContent='center'>
                                <Typography> {item.name}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.75 }}>{item.description}</Typography>
                            </Box>
                        }
                        control={<Checkbox
                            checked={item.isComplete}
                            onChange={handleChange}
                        />
                        }
                    />
                </Grid>
                <Grid size='auto' display='flex' alignItems='center'>
                    <IconButton color="error" size='small' onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Item;