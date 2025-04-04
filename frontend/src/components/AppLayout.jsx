import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";

function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <Box
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            minWidth: "300px",
            p: { xs: 2, md: 3 },
            mx: "auto",
            mt: { md: 2 },
            mb: 6,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
