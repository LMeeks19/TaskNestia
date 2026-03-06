import { Box, CircularProgress, Typography } from "@mui/material";

function Loader() {
    return (
        <Box sx={{ padding: 2, display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={50} />
        </Box>
    );
}

export default Loader;