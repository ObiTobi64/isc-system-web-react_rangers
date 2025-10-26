import { useCallback, useState, MouseEvent } from "react";
import { styled } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Sidebar from "./Sidebar";
import { useUserStore } from "../store/store";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 240;

const TranslateRole = (rol: string) => {
  const translatedRoles: { [key: string]: string } = {
    professor: "Profesor",
    student: "Estudiante",
    admin: "Administrador",
  };
  return translatedRoles[rol] || rol;
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Layout = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { clearUser, user } = useUserStore();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleProfileClick = useCallback(() => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate("/profile");
    }
    handleCloseUserMenu();
  }, [navigate, handleCloseUserMenu, user?.id]);

  const handleLogoutClick = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionActive");
    clearUser();
    navigate("/login", { replace: true });
    handleCloseUserMenu();
  }, [clearUser, navigate, handleCloseUserMenu]);

  const settings = [
    {
      title: "Perfil",
      onClick: handleProfileClick,
    },
    {
      title: "Logout",
      onClick: handleLogoutClick,
    },
  ];

  return (
    <Box sx = {{ display: "flex" }}>
      <CssBaseline />
      <AppBar position = "fixed" open = {open} sx = {{ bgcolor: "#ffffff" }}>
        <Toolbar>
          <IconButton
            color = "primary"
            aria-label = "open drawer"
            onClick = {handleDrawerOpen}
            edge = "start"
            sx = {{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx = {{ flexGrow: 1 }} />
          <Box mr = {2}>
            <Typography
              variant = "subtitle1"
              noWrap
              color = "primary"
              textAlign = "right"
              className = "font-bold"
            >
              {user?.name}
            </Typography>
            <Typography variant = "subtitle2" color = "textSecondary" textAlign = "right">
              {TranslateRole(user?.roles?.join(", ") || "")}
            </Typography>
          </Box>

          <Tooltip data-test-id = "user_icon" title = "Abrir configuraciones">
            <IconButton onClick = {handleOpenUserMenu} sx = {{ p: 0 }}>
              <Avatar alt = {user?.name} src = "/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx = {{ mt: "45px" }}
            id = "menu-appbar"
            anchorEl = {anchorElUser}
            anchorOrigin = {{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin = {{
              vertical: "top",
              horizontal: "right",
            }}
            open = {Boolean(anchorElUser)}
            onClose = {handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key = {setting.title}
                data-test-id = {setting.title === "Logout" ? "logout_button" : undefined}
                onClick = {setting.onClick}
              >
                <Typography textAlign = "center">{setting.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Sidebar open = {open} setOpen = {setOpen} />
      <Box component = "main" sx = {{ flexGrow: 1, p: 3, overflowX: "auto", width: "100%" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
