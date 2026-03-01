import { Box, Tab, TextField, Typography } from "@mui/material"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import { addSheet, deleteSheet, fetchCurrentUser, fetchUserSheets } from "../server/requests";
import SheetModel from "../models/sheetModel";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from '@mui/icons-material/AddOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';

function Page() {
    const [sheets, setSheets] = useState<Array<SheetModel>>([]);
    const [isAddingSheet, setIsAddingSheet] = useState<boolean>();
    const [selectedTab, setSelectedTab] = useState<number>(-1);
    const [pendingSheetInput, setPendingSheetInput] = useState<string>("");

    useEffect(() => {
        fetchCurrentUser()
            .then(async () => {
                var sheets = await fetchUserSheets();
                setSelectedTab(sheets.length > 0 ? 0 : -1)
                setSheets(sheets)
            })
    }, []);

    async function removeSheet(id: number) {
        await deleteSheet(id)
            .then((id) => setSheets([...sheets.filter(s => s.id !== id)]));
    }

    async function createSheet() {
        var sheet = await addSheet(pendingSheetInput)
        sheets.push(sheet);
        setSelectedTab(sheets.length - 1)
        setIsAddingSheet(false);
        setPendingSheetInput("");
    }

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const populateAddTab = () => {
        if (!isAddingSheet)
            return <AddIcon />

        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 200 }}>
            <TextField autoFocus onChange={(e) => { e.stopPropagation(); setPendingSheetInput(e.target.value) }} variant="filled" placeholder="Name" sx={{ p: 0, '& .MuiInputBase-input': { py: 0., px: 1, background: '#00000044', borderRadius: '5px 5px 0 0' }, '& .MuiInputBase-root': { color: '#f1f1f1', '::after': { borderBottomColor: '#e2080844' } } }} />
            <CancelIcon onClick={(e) => { e.stopPropagation(); setIsAddingSheet(false) }} sx={{ cursor: 'pointer', color: 'inherit' }} />
            <SaveIcon onClick={(e) => { e.stopPropagation(); createSheet() }} sx={{ cursor: 'pointer', color: 'inherit' }} />
        </Box>
    }

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <TabContext value={selectedTab}>
                <Box sx={{ '& .MuiTabs-indicator': { background: 'transparent' } }}>
                    <TabList variant="scrollable" scrollButtons={true} onChange={handleChange} sx={{ '& :focus': { outline: 'none' }, '& :focus-visible': { outline: 'none' }, '& .MuiTabs-list': { gap: 1 }, '& .Mui-selected': { background: sheets[selectedTab]?.hexColour, zIndex: 3 }, '& .MuiTab-root': { '& :hover': { zIndex: 3 } } }}>
                        {sheets.map((sheet, index) =>
                            <Tab key={sheet.id} label={sheet.name} value={index} iconPosition="end" sx={{ lineHeight: 'normal', background: sheet.hexColour, borderRadius: '15px 15px 0 0', color: '#f1f1f1 !important' }} />
                        )}
                        <Box onClick={() => setIsAddingSheet(true)} sx={{ display: 'flex', alignItems: 'center', background: isAddingSheet ? '#e20808' : '#e2080844', cursor: 'pointer', borderRadius: '15px 15px 0 0', padding: '12px 16px', color: '#f1f1f1 !important' }}>
                            {populateAddTab()}
                        </Box>
                    </TabList>
                </Box>

                {sheets.map((sheet, index) =>
                    <TabPanel key={sheet.id} value={index} sx={{ flexGrow: 1, background: sheet.hexColour, borderRadius: '15px', boxShadow: '0 0 10px 1px black', zIndex: 2 }}>{sheet.name}</TabPanel>
                )}
            </TabContext>
        </Box>
    );
}

export default Page