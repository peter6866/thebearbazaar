import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import NavbarPhone from "./NavbarPhone";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

const pages = [
  { name: "My Bid", path: "/mybid" },
  { name: "FAQ", path: "/faq" },
  { name: "Admin", path: "/admin" },
];

function Header() {
  const { logout, role } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { darkMode, toggleTheme } = useTheme();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <div className="hidden md:block">
        <AppBar
          position="static"
          sx={{
            backgroundColor: "background.default",
            borderBottom: `1.1px solid ${darkMode ? "#424242" : "lightgray"}`,
          }}
        >
          <Container maxWidth="lg" sx={{ display: "flex", py: "10px" }}>
            <NavLink to="/" className="flex items-center mr-8 mb-[2px]">
              <img
                src="/pawlogo.png"
                alt="The Bear Bazaar logo"
                className="h-7 mr-3"
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "text.primary",
                }}
              >
                The Bear Bazaar
              </Typography>
            </NavLink>

            <div className="flex-1 space-x-12 ml-6 mt-2">
              {pages.map((page) =>
                page.name === "Admin" && role !== "admin" ? null : (
                  <NavLink
                    key={page.name}
                    to={page.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#a51417] font-semibold border-b-[3.5px] border-[#a51417]"
                        : "text-gray-700 hover:border-b-[3.5px] hover:border-gray-300"
                    }
                    style={{
                      paddingBottom: "1.1rem",
                    }}
                  >
                    {page.name}
                  </NavLink>
                )
              )}
            </div>

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
                {darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  component={NavLink}
                  to="/profile"
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={logout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Container>
        </AppBar>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
        <NavbarPhone />
      </div>
    </>
  );
}
export default Header;
