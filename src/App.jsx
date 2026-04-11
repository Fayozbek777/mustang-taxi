import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
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

function App() {
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-panel";

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <Routes>
        {/* 1. СНАЧАЛА ЛОГИН */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 2. ПОТОМ ЗАЩИЩЕННАЯ АДМИНКА */}
        <Route element={<ProtectedRoute />}>
          <Route path={`/${SECRET_PATH}`} element={<AdminLayout />}>
            {/* index означает, что этот компонент откроется сразу по адресу /admin-mustang */}
            <Route index element={<AdminDashboard />} />

            {/* Эта страница будет открываться, когда кликаешь по категориям в сайдбаре */}
            <Route path="products" element={<AdminProducts />} />

            <Route path="add" element={<EditProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>
        </Route>

        {/* 3. ВСПОМОГАТЕЛЬНЫЙ РЕДИРЕКТ */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* 4. И ТОЛЬКО В КОНЦЕ ПУБЛИЧНАЯ ЧАСТЬ */}
        <Route
          path="/*"
          element={
            <div className="app-wrapper">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/scooters" element={<Scooters />} />
                  <Route path="/drongo" element={<Drongo />} />
                  <Route path="/bags" element={<Bags />} />
                  <Route path="/velo" element={<Velo />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
