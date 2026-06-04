import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ReactLenis } from "lenis/react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import "./i18n";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Scooters from "./pages/Scooters";
import NotFound from "./pages/NotFound";
import Drongo from "./pages/Drongo";
import Preview from "./components/Preview";
import Bags from "./pages/Bags";
import Velo from "./pages/Velo";
import Working from "./pages/Working"; // Заглушка техработ

// Административная панель
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminLogin from "./admin/AdminLogin";
import EditProduct from "./admin/EditProduct";
import AdminDashboard from "./admin/AdminDashboard";

// Защита админ-роутов
const ProtectedRoute = ({ secretPath }) => {
  const isAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`/${secretPath}/login`} replace />
  );
};

// Публичный слой с реактивным включением техработ
const PublicLayout = () => {
  const [isMaintenance, setIsMaintenance] = useState(() => {
    return localStorage.getItem("isMaintenanceMode") === "true";
  });

  useEffect(() => {
    const handleMaintenanceChange = () => {
      const currentState = localStorage.getItem("isMaintenanceMode") === "true";
      setIsMaintenance(currentState);
    };

    // Слушаем кастомный триггер из панели управления и системные изменения хранилища
    window.addEventListener("maintenanceToggle", handleMaintenanceChange);
    window.addEventListener("storage", handleMaintenanceChange);

    return () => {
      window.removeEventListener("maintenanceToggle", handleMaintenanceChange);
      window.removeEventListener("storage", handleMaintenanceChange);
    };
  }, []);

  // Если активирован режим техработ — полностью блокируем публичную часть приложения
  if (isMaintenance) {
    return <Working />;
  }

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [showPreview, setShowPreview] = useState(() => {
    const hasSeenPreview = localStorage.getItem("hasSeenPreview");
    return hasSeenPreview !== "true";
  });

  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-panel";

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
    return <Preview />;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <Router>
        <Routes>
          {/* Публичные разделы сайта */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/scooters" element={<Scooters />} />
            <Route path="/drongo" element={<Drongo />} />
            <Route path="/bags" element={<Bags />} />
            <Route path="/velo" element={<Velo />} />
          </Route>

          {/* Скрытая авторизация и админка по кастомному пути */}
          <Route path={`/${SECRET_PATH}/login`} element={<AdminLogin />} />

          <Route element={<ProtectedRoute secretPath={SECRET_PATH} />}>
            <Route path={`/${SECRET_PATH}`} element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="add" element={<EditProduct />} />
              <Route path="edit/:id" element={<EditProduct />} />
            </Route>
          </Route>

          {/* Перенаправление со старого статичного адреса на твой динамический */}
          <Route
            path="/admin/*"
            element={<Navigate to={`/${SECRET_PATH}/login`} replace />}
          />

          {/* Страница 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}

export default App;
