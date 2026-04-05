import { Divider, ListItemIcon, MenuItem, ListItemText, MenuList, Typography, Menu } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUploadOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import { getModifierKey } from "../helpers/platformExtensions";
import UploadNestedEntitiesDialog from "./UploadNestedEntitiesDialog";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";

function TopBarMenu(params: { anchorEl: null | HTMLElement | undefined, setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null | undefined>> }) {
    const open = Boolean(params.anchorEl);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);

    const handleClose = () => {
        params.setAnchorEl(null);
    };

    return (
        <Fragment>
            <Menu
                anchorEl={params.anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 5,
                        sx: {
                            overflow: 'hidden',
                            background: 'inherit',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            width: 320,
                            maxWidth: '100%',
                            borderRadius: '15px',
                            '& .MuiMenuItem-root': {
                                color: 'inherit',
                                transition: 'background .2s ease-in-out',

                                '&:hover': {
                                    background: '#1976d240'
                                }
                            },
                            '& .MuiListItemIcon-root': {
                                color: 'inherit'
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuList>
                    <MenuItem onClick={() => setOpenUploadDialog(true)}>
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText>Upload</ListItemText>
                        <Typography variant="body2">
                            {getModifierKey()}U
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText>Account</ListItemText>
                        <Typography variant="body2">
                            {getModifierKey()}A
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                        <Typography variant="body2">
                            {getModifierKey()}S
                        </Typography>
                    </MenuItem>
                </MenuList>
            </Menu>
            <UploadNestedEntitiesDialog open={openUploadDialog} setOpen={setOpenUploadDialog} />
        </Fragment>
    );
}

export default TopBarMenu;