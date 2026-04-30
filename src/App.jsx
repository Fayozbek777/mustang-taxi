import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ReactLenis } from "lenis/react"; // Новый правильный импорт
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import "./i18n";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Scooters from "./pages/Scooters";
import Drongo from "./pages/Drongo";
import Bags from "./pages/Bags";
import Velo from "./pages/Velo";
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminLogin from "./admin/AdminLogin";
import EditProduct from "./admin/EditProduct";
import AdminDashboard from "./admin/AdminDashboard";

const ProtectedRoute = () => {
  const isAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const PublicLayout = () => (
  <div className="app-wrapper">
    <Header />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-panel";

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path={`/${SECRET_PATH}`} element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="add" element={<EditProduct />} />
              <Route path="edit/:id" element={<EditProduct />} />
            </Route>
          </Route>
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/scooters" element={<Scooters />} />
            <Route path="/drongo" element={<Drongo />} />
            <Route path="/bags" element={<Bags />} />
            <Route path="/velo" element={<Velo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ReactLenis>
  );
}

export default App;
