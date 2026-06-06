import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/index";
import { BrowserRouter } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
// Импортируем компонент базового сброса стилей от MUI
import CssBaseline from "@mui/material/CssBaseline";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactLenis
      root
      options={{ autoRaf: true, lerp: 0.1, duration: 1.2, smoothWheel: true }}
    >
      <BrowserRouter>
        {/* Сброс стилей MUI применяется внутри роутера и анимаций */}
        <CssBaseline />
        <App />
      </BrowserRouter>
    </ReactLenis>
  </React.StrictMode>,
);
