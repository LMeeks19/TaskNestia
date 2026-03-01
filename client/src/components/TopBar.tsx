import { AppBar, IconButton, Typography } from "@mui/material";
import TopBarMenu from './TopBarMenu';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

function TopBar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <AppBar sx={{ position: 'relative', padding: '0.5rem 1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: '#e20808' }}>
            <Typography variant="h4">
                TaskNestia
            </Typography>
            <IconButton color="inherit" onClick={(e) => handleClick(e)}>
                <MenuIcon fontSize="large" />
            </IconButton>
            <TopBarMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </AppBar>
    )
}

export default TopBar;