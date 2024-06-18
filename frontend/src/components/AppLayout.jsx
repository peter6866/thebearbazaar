import { Outlet } from "react-router-dom";
import Header from "./Header";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

// TODO: Add a Snackbar component here
function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Box
        sx={{
          backgroundColor: "white",
        }}
      >
        <div className="max-w-[800px] min-w-[300px] p-4 md:p-6 mx-auto md:mt-4 mb-12">
          <div
            elevation={3}
            className="p-8 rounded-lg shadow-md border border-gray-200"
          >
            <Outlet />
          </div>
        </div>
      </Box>
    </div>
  );
}

export default AppLayout;
