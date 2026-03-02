import { Box, CircularProgress } from "@mui/material";

function Loader() {
    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
            Loading...
        </Box>
    );
}

export default Loader;