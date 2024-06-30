import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Paper, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";

// TODO: Add a Snackbar component here
function AppLayout() {
  const theme = useTheme();

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
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 2,
              border: 1,
              borderColor:
                theme.palette.mode === "dark" ? "grey.800" : "#e5e7eb",
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
