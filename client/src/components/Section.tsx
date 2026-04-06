import { Checkbox, Chip, Divider, FormControlLabel, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import SectionModel from "../models/sectionModel";
import Item from "./Item";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { nestedEntitiesState } from "../state/globalState";
import { updateSectionEntity } from "../helpers/recursives";
import { deleteSection, updateSection } from "../server/requests";
import UpdateSectionRequestModel from "../server/models/updateSectionRequestModel";
import AddNestedEntityDialog from "./AddNestedEntityDialog";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityOn from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ConfirmDialog, { ConfirmDialogProps } from "./ConfirmDialog";

function Section(props: { id: number }) {
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);
    const [section, setSection] = useState<SectionModel>({} as SectionModel);
    const [collapsed, setCollapsed] = useState<boolean>(section.items?.every(i => i.isComplete));
    const [showCompleted, setShowCompleted] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        var section = nestedEntities.find(ne => ne.id === props.id) as SectionModel;
        setCollapsed(section.items?.every(i => i.isComplete));
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

    const handleDelete = async (id: number) => {
        var deletedSectionId = await deleteSection(id);
        setNestedEntities((nestedEntities) => nestedEntities.filter(ne => ne.id !== deletedSectionId));
    }

    const populateConfirmDeleteDialog = (id: number) => {
        return {
            mainButtonTooltipText: "Delete",
            mainButtonIcon: <DeleteIcon color="error" />,
            title: "Delete Section",
            details: "Are you sure you want to delete this section and all its contents? This cannot be undone!",
            action: () => handleDelete(id)
        } as ConfirmDialogProps
    }

    const numberCompleted = section.items?.reduce((count, item) => count + (item.isComplete ? 1 : 0), 0);
    const completionProgress: string = `${numberCompleted}/${section.items?.length}`
    const isComplete = numberCompleted == section.items?.length && section.items?.length != 0;

    return (
        <Grid key={section.id} bgcolor={theme.palette.primary.main} p={1} borderRadius={2.5} boxShadow={2}>
            <Grid container columns={3} sx={{ opacity: isComplete ? 0.5 : 1 }} spacing={2} pb={!collapsed ? 1 : 0} wrap='nowrap' justifyContent='space-between'>
                <FormControlLabel
                    sx={{ mx: 0, gap: 1, overflow: 'hidden' }}
                    label={
                        <Typography whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
                            {section.name}
                        </Typography>
                    }
                    control={
                        <Checkbox
                            sx={{ color: `${theme.palette.primary.contrastText} !important`, p: 0.5 }}
                            checked={isComplete}
                            onChange={handleChange}
                        />
                    }
                />
                <Grid size='auto' display='flex' alignItems='center' height='fit-content' gap={0.5}>
                    <Chip label={completionProgress} color={isComplete ? "success" : numberCompleted === 0 ? "error" : "warning"} sx={{ color: 'inherit' }} />
                    <Tooltip title="Show/Hide completed items" followCursor arrow>
                        {showCompleted ?
                            <VisibilityOn onClick={() => setShowCompleted(false)} sx={{ cursor: 'pointer', color: `${theme.palette.primary.contrastText} !important` }} /> :
                            <VisibilityOff onClick={() => setShowCompleted(true)} sx={{ cursor: 'pointer', color: `${theme.palette.primary.contrastText} !important` }} />
                        }
                    </Tooltip>
                    <AddNestedEntityDialog sheetId={section.sheetId} sectionId={section.id} />
                    <ConfirmDialog confirmDialogProps={populateConfirmDeleteDialog(section.id)} isNestedEntity={true} />
                    <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="top" followCursor arrow>
                        {collapsed ?
                            <ExpandMoreIcon onClick={() => setCollapsed(false)} sx={{ cursor: 'pointer' }} />
                            :
                            <ExpandLessIcon onClick={() => setCollapsed(true)} sx={{ cursor: 'pointer' }} />
                        }
                    </Tooltip>
                </Grid>
            </Grid>
            {!collapsed &&
                <Fragment>
                    <Divider />
                    {section.items?.length === 0 ? (
                        <Grid container direction='column' pt={1}>
                            <Typography textAlign='center' sx={{ opacity: 0.75 }}>No items yet</Typography>
                        </Grid>
                    ) : (
                        <Grid container direction='column' pt={1} gap={1}>
                            {showCompleted ?
                                section.items?.map((item) => {
                                    return <Item key={item.id} itemId={item.id} sectionId={item.sectionId} />
                                }) :
                                section.items?.filter((item) => !item.isComplete).map((item) => {
                                    return <Item key={item.id} itemId={item.id} sectionId={item.sectionId} />
                                })
                            }
                        </Grid>
                    )}
                </Fragment>
            }
        </Grid>
    )
}

export default Section;