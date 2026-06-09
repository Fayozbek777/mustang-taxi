import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import Preview from "./components/Preview/Preview";
import AppRoutes from "./Router/AppRoutes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [showPreview, setShowPreview] = useState(() => {
    const hasSeenPreview = localStorage.getItem("hasSeenPreview");
    return hasSeenPreview !== "true";
  });

  const SECRET_PATH =
    import.meta.env.VITE_ADMIN_PATH || "dashboard-mustang-private";

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    if (!showPreview) return;

    const timer = setTimeout(() => {
      setShowPreview(false);
      localStorage.setItem("hasSeenPreview", "true");
    }, 2500);

    return () => clearTimeout(timer);
  }, [showPreview]);

  if (showPreview) {
    return (
      <ThemeProvider theme={theme}>
        <Preview />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppRoutes secretPath={SECRET_PATH} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #2d2d2d",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            fontFamily: '"Inter", sans-serif',
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          },
          success: {
            duration: 6000,
            style: {
              border: "1px solid #2e7d32",
            },
            iconTheme: {
              primary: "#4caf50",
              secondary: "#1a1a1a",
            },
          },
          error: {
            duration: 4000,
            style: {
              border: "1px solid #d32f2f",
            },
            iconTheme: {
              primary: "#f44336",
              secondary: "#1a1a1a",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
