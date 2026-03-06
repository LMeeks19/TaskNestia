import { Checkbox, Divider, FormControlLabel, Grid, IconButton, Tooltip } from "@mui/material";
import SectionModel from "../models/sectionModel";
import Item from "./Item";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { nestedEntitiesState } from "../state/globalState";
import { updateSectionEntity } from "../helpers/recursives";
import { deleteSection, updateSection } from "../server/requests";
import UpdateSectionRequestModel from "../server/models/updateSectionRequestModel";
import AddNestedEntotyDialog from "./AddNestedEntityDialog";

function Section(props: { id: number }) {
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);
    const [section, setSection] = useState<SectionModel>({} as SectionModel);

    useEffect(() => {
        var section = nestedEntities.find(ne => ne.id === props.id) as SectionModel;
        setSection(section);
    }, [nestedEntities])

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        var updatedSection = await updateSection({
            sectionId: section.id,
            isComplete: event.target.checked
        } as UpdateSectionRequestModel)

        var updatedNestedEntities = nestedEntities.map((ne) => {
            if (ne.id === section.id)
                return updateSectionEntity((ne as SectionModel), { ...updatedSection, id: undefined });
            return ne;
        });

        setNestedEntities(updatedNestedEntities);
    }

    const handleDelete = async () => {
        var deletedSectionId = await deleteSection(section.id);
        setNestedEntities((nestedEntities) => nestedEntities.filter(ne => ne.id !== deletedSectionId));
    }

    return (
        <Grid key={section.id} sx={{ borderRadius: 5 }}>
            <Grid container columns={3} spacing={2}>
                <Grid size='grow' display='flex' alignItems='center'>
                    <FormControlLabel
                        label={section.name}
                        control={
                            <Checkbox
                                checked={section.items?.every(i => i.isComplete)}
                                onChange={handleChange}
                            />
                        }
                    />
                </Grid>
                <Grid size='auto' display='flex' alignItems='center' justifyContent='end'>
                    <AddNestedEntotyDialog sheetId={section.sheetId} sectionId={section.id} />
                    <Tooltip title="Delete" placement="top" followCursor arrow>
                        <IconButton color="error" size="small" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Divider />
            <Grid ml={2}>
                {section.items?.map((item) => {
                    return <Item key={item.id} itemId={item.id} sectionId={item.sectionId} />
                })}
            </Grid>
        </Grid>)
}

export default Section;