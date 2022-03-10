import React, { useEffect, useState } from 'react';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  Avatar,
} from '@mui/material';
import { useAppContext } from '../../store';
import { makeStyles } from '@mui/styles';
import { useImageSrc } from '../../hooks/useImageSrc';
import { appLinks } from '../../router/routes';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import useApiRequest from '../../hooks/userApiRequest';
import { logout } from '../../api/authApi';
import { logOutUser } from '../../store/actions';
import Loader from '../Loader';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme: Theme) => ({
  logoBox: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  logo: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  avatar: {
    maxWidth: '5%',
    height: '5%',
  },
  iconButton: {
    backgroundColor: `#FFFFFF !important`,
    padding: '0 !important',
  },
  settingItem: {
    marginLeft: '6% !important',
  },
  searchBox: {
    width: '30%',
  },
}));

function Header() {
  const classes = useStyles();
  const location = useLocation();
  const [isAuthPage, setIsAuthPage] = useState(false);
  const { state, dispatch } = useAppContext();
  const avatarSrc = useImageSrc(state.user.photo);
  const navigate = useNavigate();
  const { requestFn: logoutApi, isLoading } = useApiRequest(logout, {
    showSuccessMessage: false,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    [appLinks.login.link, appLinks.registration.link].includes(location.pathname)
      ? setIsAuthPage(true)
      : setIsAuthPage(false);
  }, [location.pathname]);

  const dropDownSettings = [
    {
      icon: <AccountCircleIcon />,
      field: 'My profile',
      onClick: () => {
        handleClose();
        navigate(`${appLinks.index.link}${state.user._id}`);
      },
    },
    {
      icon: <SettingsOutlinedIcon />,
      field: 'Settings',
      onClick: () => {
        handleClose();
        navigate(appLinks.setting.link);
      },
    },
    {
      icon: <LogoutIcon />,
      field: 'Log out',
      onClick: async () => {
        await logoutApi({});
        dispatch(logOutUser());
        handleClose();
        navigate(appLinks.login.link);
      },
    },
  ];

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box className={classes.logoBox}>
            <Typography
              variant="h6"
              component="a"
              href={`${appLinks.index.link}${state.user._id}`}
              className={classes.logo}
            >
              {'Social Network'}
            </Typography>
          </Box>
          {!isAuthPage && state.isAuth && (
            <>
              <Box className={classes.searchBox}>
                <SearchBar />
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="User profile">
                  <IconButton onClick={handleMenu} className={classes.iconButton}>
                    <Avatar alt={state.user.fullName} src={avatarSrc} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {dropDownSettings.map((setting, i) => (
                    <MenuItem key={setting.field} onClick={setting.onClick} disabled={isLoading}>
                      {setting.icon}
                      <Typography textAlign="center" className={classes.settingItem}>
                        {setting.field}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
