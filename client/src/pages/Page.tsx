import { Box, Grid, Tab, Typography } from "@mui/material"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Fragment, useEffect, useState } from "react";
import { deleteSheet, fetchCurrentUser, fetchNestedEntities, fetchUserSheets } from "../server/requests";
import SheetModel from "../models/sheetModel";
import DeleteIcon from "@mui/icons-material/Delete";

import ConfirmDialog, { ConfirmDialogProps } from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import AddSheetDialog from "../components/AddSheetDialog";
import SectionModel from "../models/sectionModel";
import ItemModel from "../models/itemModel";
import NestedEntityType from "../enums/nestedEntityTypeEnum";

function Page() {
    const [sheets, setSheets] = useState<Array<SheetModel>>([]);
    const [nestedEntities, setNestedEntities] = useState<Array<SectionModel | ItemModel>>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetchCurrentUser()
            .then(async () => {
                var sheets = await fetchUserSheets();
                setSheets(sheets);
                if (sheets.length > 0)
                    setNestedEntities(await fetchNestedEntities(sheets[selectedTab]?.id))
            })
            .then(() => setIsLoaded(true))
    }, []);

    useEffect(() => {
        if (sheets.length > 0 && selectedTab != undefined)
            getNestedEntities()
    }, [selectedTab])

    async function getNestedEntities() {
        setNestedEntities(await fetchNestedEntities(sheets[selectedTab]?.id));
    }

    async function removeSheet(id: number) {
        await deleteSheet(id)
            .then((id) => setSheets([...sheets.filter(s => s.id !== id)]));
    }

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const populateConfirmDeleteDialog = (id: number) => {
        return {
            mainButtonTooltipText: "Delete",
            mainButtonIcon: <DeleteIcon />,
            mainButtonColour: "error",
            title: "Delete Sheet",
            details: "Are you sure you want to delete this sheet and all its contents? This cannot be undone!",
            action: () => removeSheet(id)
        } as ConfirmDialogProps
    }

    const populatePanel = (ne: SectionModel | ItemModel) => {
        if (ne.type === NestedEntityType.Section)
            return populateSection(ne as SectionModel)
        return populateItem(ne as ItemModel)
    }

    const populateSection = (section: SectionModel) => {
        return (
            <Box key={section.id}>
                <Typography>{section.name}</Typography>
                <Typography>{new Date(section.lastModified).toUTCString()}</Typography>
                <Box ml={2}>
                    {section.items.map((item) => populateItem(item))}
                </Box>
            </Box>
        );
    }

    const populateItem = (item: ItemModel) => {
        return (
            <Box key={item.id}>
                <Typography>{item.name}</Typography>
                <Typography>{item.description}</Typography>
                <Typography>{new Date(item.lastModified).toUTCString()}</Typography>
            </Box>
        )
    }

    return (
        <Fragment>
            {isLoaded ?
                <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <TabContext value={selectedTab}>
                        <Box sx={{ '& .MuiTabs-indicator': { background: 'transparent' } }}>
                            <TabList variant="scrollable" scrollButtons={true} onChange={handleChange} sx={{ height: '48px', '& :focus': { outline: 'none' }, '& :focus-visible': { outline: 'none' }, '& .MuiTabs-list': { gap: 1 }, '& .Mui-selected': { background: sheets[selectedTab]?.hexColour, zIndex: 3 }, '& .MuiTab-root': { '& :hover': { zIndex: 3 } } }}>
                                <AddSheetDialog sheets={sheets} setSheets={setSheets} />
                                {sheets.map((sheet, index) =>
                                    <Tab key={sheet.id} label={sheet.name} value={index} sx={{ lineHeight: 'normal', background: sheet.hexColour, borderRadius: '15px 15px 0 0', color: '#f1f1f1 !important' }} />
                                )}
                            </TabList>
                        </Box>

                        {sheets.map((sheet, index) =>
                            <TabPanel key={sheet.id} value={index} sx={{ flexGrow: 1, background: sheet.hexColour, borderRadius: '15px', boxShadow: '0 0 10px 1px black', zIndex: 2 }}>
                                <Grid container columns={2} spacing={2}>
                                    <Grid size='grow' display='flex' alignItems='center'>
                                        <Typography variant="h5" sx={{ my: 'auto', lineHeight: 'normal' }}>{sheet.name.toUpperCase()}</Typography>
                                    </Grid>
                                    <Grid size='auto' display='flex' justifyContent='end'>
                                        <ConfirmDialog confirmDialogProps={populateConfirmDeleteDialog(sheet.id)} />
                                    </Grid>
                                    <Grid container spacing={2} size={2} columns={2}>
                                        {nestedEntities.map((ne) => {
                                            return (
                                                <Grid spacing={2} size={1}>
                                                    {populatePanel(ne)}
                                                </Grid>)
                                        })}
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        )}
                    </TabContext>
                </Box>
                :
                <Loader />
            }
        </Fragment>
    );
}

export default Page