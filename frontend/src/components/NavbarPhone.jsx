import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpIcon from "@mui/icons-material/Help";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Button, Menu, MenuItem, Typography, Box } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { grey } from "@mui/material/colors";

function NavbarPhone() {
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const location = useLocation();
  const currentRoute = location.pathname;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClickSettings = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  const renderTabButton = (
    tabName,
    activeIconComponent,
    IconComponent,
    path
  ) => {
    const isActive = currentRoute === path;
    return (
      <NavLink
        key={tabName}
        to={path}
        className={`flex flex-col items-center text-gray-500 ${
          isActive ? "text-[#BA0C2F]" : ""
        }`}
      >
        <IconRenderComponent
          IconComponent={isActive ? activeIconComponent : IconComponent}
          isActive={isActive}
        />

        <Typography
          variant="body2"
          sx={{
            color: isActive ? "#BA0C2F" : "text.secondary",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          {tabName}
        </Typography>
      </NavLink>
    );
  };

  const IconRenderComponent = ({ IconComponent, isActive }) => (
    <div
      className={`h-8 w-[74px] mb-1 pt-1 flex justify-center items-center border-t-2 ${
        isActive ? "border-[#BA0C2F]" : "border-transparent"
      }`}
    >
      <IconComponent
        className={`h-6 w-6 ${
          isActive
            ? "text-[#BA0C2F]"
            : darkMode
            ? "text-gray-100"
            : "text-gray-900"
        }`}
      />
    </div>
  );

  const renderSettingsButton = () => {
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "text.secondary",
            textTransform: "none",
            padding: "0",
          }}
          onClick={handleClickSettings}
        >
          <IconRenderComponent
            IconComponent={open ? SettingsIcon : SettingsOutlinedIcon}
            isActive={false}
          />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            Settings
          </Typography>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseSettings}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </MenuItem>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    // px 0.75 rem pb 0.5 rem
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: darkMode ? grey[900] : grey[50],
        px: "0.75rem",
        pb: "0.5rem",
        boxShadow: 3,
      }}
    >
      {renderTabButton("Dashboard", DashboardIcon, DashboardOutlinedIcon, "/")}
      {renderTabButton("My Bid", PaymentsIcon, PaymentsOutlinedIcon, "/mybid")}
      {renderTabButton("FAQ", HelpIcon, HelpOutlineIcon, "/faq")}
      {renderTabButton(
        "Profile",
        AccountCircleIcon,
        AccountCircleOutlinedIcon,
        "/profile"
      )}
      {renderSettingsButton()}
    </Box>
  );
}

export default NavbarPhone;
