import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import Preview from "./components/Preview/Preview";
import AppRoutes from "./Router/AppRoutes";

// Импортируем инструменты для работы с темой MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Создаем тему и указываем ваш основной шрифт Inter
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  // Здесь в будущем можно настроить цвета, например:
  // palette: { primary: { main: '#000000' } }
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

  // Если показывается превью, оборачиваем его в тему, чтобы внутри работал MUI
  if (showPreview) {
    return (
      <ThemeProvider theme={theme}>
        <Preview />
      </ThemeProvider>
    );
  }

  // Основной рендеринг приложения с поддержкой темы MUI
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes secretPath={SECRET_PATH} />
    </ThemeProvider>
  );
}

export default App;
