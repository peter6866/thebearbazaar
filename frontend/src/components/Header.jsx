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
import { alpha } from "@mui/material";

const pages = [
  { name: "My Bid", path: "/mybid" },
  { name: "FAQ", path: "/faq" },
  { name: "Admin", path: "/admin" },
];

function Header() {
  const { logout, role } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { darkMode, toggleTheme } = useTheme();

  // Track if the page has been scrolled
  const [scrolled, setScrolled] = React.useState(false);

  // Monitor scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <div className="hidden md:block">
        {/* Spacer for fixed navbar */}
        <Box sx={{ height: "70px" }} />

        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            top: scrolled ? "10px" : 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            borderBottom: scrolled
              ? "none"
              : `1.1px solid ${darkMode ? "#424242" : "lightgray"}`,
            transition: "all 0.3s ease",
            zIndex: 1100,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              py: scrolled ? "8px" : "8px",
              transition: "all 0.3s ease",
              position: "relative",
              backgroundColor: scrolled
                ? "transparent"
                : darkMode
                ? "#121212"
                : "#ffffff",
            }}
          >
            {scrolled && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: "100%",
                  height: "100%",
                  transform: "translateX(-50%)",
                  backgroundColor: alpha(
                    darkMode ? "#121212" : "#ffffff",
                    0.85
                  ),
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  boxShadow: darkMode
                    ? "0 8px 16px -2px rgba(0,0,0,0.3)"
                    : "0 8px 16px -2px rgba(0,0,0,0.1)",
                  zIndex: -1,
                }}
              />
            )}

            <NavLink to="/" className="flex items-center mr-8 mb-[2px]">
              <img
                src="/pawlogo.png"
                alt="The Bear Bazaar logo"
                className={`h-7 mr-3 ${
                  darkMode && "filter invert"
                } transition-transform duration-300 ${
                  scrolled ? "scale-90" : "scale-100"
                }`}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: scrolled ? "20px" : "22px",
                  fontWeight: "bold",
                  color: "text.primary",
                  transition: "all 0.3s ease",
                }}
              >
                The Bear Bazaar
              </Typography>
            </NavLink>

            <div className="flex-1 space-x-12 ml-6 mt-[10px]">
              {pages.map((page) =>
                page.name === "Admin" && role !== "admin" ? null : (
                  <NavLink
                    key={page.name}
                    to={page.path}
                    className={({ isActive }) => {
                      const baseClasses = "transition-all duration-300";
                      if (isActive) {
                        return `text-[#BA0C2F] font-semibold border-b-[3.5px] border-[#BA0C2F] ${baseClasses}`;
                      } else {
                        if (darkMode) {
                          return `text-gray-300 hover:border-b-[3.5px] hover:border-gray-300 ${baseClasses}`;
                        }
                        return `text-gray-700 hover:border-b-[3.5px] hover:border-gray-300 ${baseClasses}`;
                      }
                    }}
                    style={{
                      paddingBottom: scrolled ? "1.1rem" : "1.1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {page.name}
                  </NavLink>
                )
              )}
            </div>

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  mr: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha(darkMode ? "#ffffff" : "#000000", 0.1),
                  },
                }}
              >
                {darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>

              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    border: "2px solid transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: alpha(darkMode ? "#ffffff" : "#000000", 0.2),
                    },
                  }}
                >
                  <Avatar
                    src=""
                    sx={{
                      transition: "all 0.3s ease",
                      transform: scrolled ? "scale(0.9)" : "scale(1)",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    boxShadow: darkMode
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  },
                }}
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
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: alpha(darkMode ? "#ffffff" : "#000000", 0.05),
                    },
                  }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: alpha(darkMode ? "#ffffff" : "#000000", 0.05),
                    },
                  }}
                >
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
