import { Box, Grid, Tab, Typography, useTheme } from "@mui/material"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Fragment, useEffect, useState } from "react";
import { deleteSheet, fetchCurrentUser, fetchNestedEntities, fetchUserSheets } from "../server/requests";
import DeleteIcon from "@mui/icons-material/Delete";
import Masonry from "react-masonry-css";
import ConfirmDialog, { ConfirmDialogProps } from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import AddSheetDialog from "../components/AddSheetDialog";
import SectionModel from "../models/sectionModel";
import ItemModel from "../models/itemModel";
import NestedEntityType from "../enums/nestedEntityTypeEnum";
import Section from "../components/Section";
import Item from "../components/Item";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentUserState, nestedEntitiesState, sheetsState } from "../state/globalState";
import AddNestedEntityDialog from "../components/AddNestedEntityDialog";

function Page() {
    const setCurrentUser = useSetRecoilState(currentUserState);
    const [sheets, setSheets] = useRecoilState(sheetsState);
    const [nestedEntities, setNestedEntities] = useRecoilState(nestedEntitiesState);

    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const theme = useTheme();

    useEffect(() => {
        fetchDetails();
    }, []);

    async function fetchDetails() {
        setCurrentUser(await fetchCurrentUser());
        var sheets = await fetchUserSheets()
        setSheets(sheets);

        if (sheets.length > 0)
            setNestedEntities(await fetchNestedEntities(sheets[selectedTab]?.id));

        setIsLoaded(true);
    }

    useEffect(() => {
        setNestedEntities([]);
        if (sheets.length > 0 && selectedTab != undefined) {
            getNestedEntities()
        }
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
            mainButtonIcon: <DeleteIcon color="error" />,
            title: "Delete Sheet",
            details: "Are you sure you want to delete this sheet and all its contents? This cannot be undone!",
            action: () => removeSheet(id)
        } as ConfirmDialogProps
    }

    const populatePanel = (ne: SectionModel | ItemModel) => {
        if (ne.type === NestedEntityType.Section)
            return <Section id={ne.id} />
        return <Item itemId={ne.id} sectionId={(ne as ItemModel).sectionId} />
    }

    const breakpoints = {
        default: 2,
        800: 1,
    };

    return (
        isLoaded ?
            <Box p={3} display='flex' flexDirection='column' flexGrow={1} color={theme.palette.primary.contrastText}>
                <TabContext value={selectedTab}>
                    <Box sx={{ '& .MuiTabs-indicator': { background: 'transparent' } }}>
                        <TabList variant="scrollable" scrollButtons={true} onChange={handleChange} sx={{ height: '48px', '& :focus': { outline: 'none' }, '& :focus-visible': { outline: 'none' }, '& .MuiTabs-list': { gap: 1,height: '100%' }, '& .Mui-selected': { background: sheets[selectedTab]?.hexColour, zIndex: 3 }, '& .MuiTab-root': { '& :hover': { zIndex: 3 } } }}>
                            <AddSheetDialog sheets={sheets} setSheets={setSheets} />
                            {sheets.map((sheet, index) =>
                                <Tab key={sheet.id} label={sheet.name} value={index} sx={{ lineHeight: 'normal', background: sheet.hexColour, borderRadius: '15px 15px 0 0', color: '#f1f1f1 !important' }} />
                            )}
                        </TabList>
                    </Box>

                    {sheets.length === 0 ?
                        <Box sx={{ display: 'flex', flexGrow: 1, background: theme.palette.primary.main, borderRadius: '15px', boxShadow: '0 0 10px 1px black', zIndex: 2 }}>
                            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' flexGrow={1} gap={1}>
                                <Typography variant="h4" sx={{ opacity: 0.7 }}>
                                    You don't have any sheets yet!
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.7 }}>
                                    Click the + button to create your first sheet
                                </Typography>
                            </Box>
                        </Box>
                        :
                        sheets.map((sheet, index) =>
                            <TabPanel key={sheet.id} value={index} sx={{ flexGrow: 1, background: sheet.hexColour, borderRadius: '15px', boxShadow: '0 0 10px 1px black', zIndex: 2 }}>
                                <Box display='flex' alignItems='center' justifyContent='space-between' gap={1}>
                                    <Typography variant="h5" noWrap sx={{ my: 'auto', lineHeight: 'normal' }}>{sheet.name.toUpperCase()}</Typography>
                                    <Box display='flex' gap={1}>
                                        <AddNestedEntityDialog sheetId={sheet.id} />
                                        <ConfirmDialog confirmDialogProps={populateConfirmDeleteDialog(sheet.id)} />
                                    </Box>
                                </Box>
                                <Box display='flex' flexGrow={1} mt={2} sx={{ overflowY: 'auto' }}>
                                    {nestedEntities?.length === 0 ? (
                                        <Typography variant="h6" sx={{ opacity: 0.7 }}>
                                            Nothing to see here! Click the + button to add your first section or item
                                        </Typography>
                                    ) : (
                                        <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-grid-column">
                                            {nestedEntities.map((ne) => {
                                                return (
                                                    <Box key={ne.id}>
                                                        {populatePanel(ne)}
                                                    </Box>
                                                )
                                            })}
                                        </Masonry>
                                    )}
                                </Box>
                            </TabPanel>
                        )}
                </TabContext>
            </Box>
            :
            <Loader />
    );
}

export default Page