import { Box } from "@mui/material";
import TopBar from "./components/TopBar";
import Page from "./pages/Page";
import "./App.css";

function App() {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 'inherit', height: '100vh' }}>
            <TopBar />
            <Page />
        </Box>
    );
}

export default App;