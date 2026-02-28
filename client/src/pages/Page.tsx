import { Box, IconButton, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/AddOutlined';

function Page() {
    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
                <Box sx={{ cursor: 'pointer', background: '#800026', color: '#f1f1f1', width: 'fit-content', padding: '8px 16px', borderRadius: '15px 15px 0 0', transition: 'background .25s ease-in-out', ":hover": { background: '#800026' } }}>
                    <Typography variant="h6">Sheet 1</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer', background: '#6d800088', color: '#f1f1f1', width: 'fit-content', padding: '8px 16px', borderRadius: '15px 15px 0 0', transition: 'background .25s ease-in-out', ":hover": { background: '#6d8000' } }}>
                    <Typography variant="h6">Sheet 2</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer', background: '#801e0088', color: '#f1f1f1', width: 'fit-content', padding: '8px 16px', borderRadius: '15px 15px 0 0', transition: 'background .25s ease-in-out', ":hover": { background: '#801e00' } }}>
                    <Typography variant="h6">Sheet 3</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer', background: '#00801188', color: '#f1f1f1', width: 'fit-content', padding: '8px 16px', borderRadius: '15px 15px 0 0', transition: 'background .25s ease-in-out', ":hover": { background: '#008011' } }}>
                    <Typography variant="h6">Sheet 4</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer', background: '#001e8088', color: '#f1f1f1', width: 'fit-content', padding: '8px 16px', borderRadius: '15px 15px 0 0', transition: 'background .25s ease-in-out', ":hover": { background: '#001e80' } }}>
                    <Typography variant="h6">Sheet 5</Typography>
                </Box>
                <IconButton sx={{ ml: 0.5, my: 'auto', height: 'fit-content', color: 'inherit', transition: 'all .25s ease-in-out', ":hover": { background: '#1976d2', color: '#f1f1f1' } }}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>
            <Box sx={{ padding: 4, background: '#800026', color: '#f1f1f1', display: 'flex', flexGrow: 1, borderRadius: '0 15px 15px 15px' }}>
                <Typography variant="body1">Content</Typography>
            </Box>
        </Box>
    );
}

export default Page