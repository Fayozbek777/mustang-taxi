import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import Home from "../pages/Home/Home";
import Scooters from "../pages/Scooters/Scooters";
import Drongo from "../pages/Drongo/Drongo";
import Bags from "../pages/Bags/Bags";
import Velo from "../pages/Velo/Velo";
import Working from "../pages/Working/Working";
import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "./ProtectedRoute";

const AdminComponents = {
  Layout: lazy(() => import("../admin/layouts/AdminLayout")),
  Dashboard: lazy(() => import("../admin/pages/AdminDashboard")),
  Products: lazy(() => import("../admin/pages/AdminProducts")),
  Login: lazy(() => import("../admin/pages/AdminLogin")),
  EditProduct: lazy(() => import("../admin/pages/EditProduct")),
};

const PublicLayout = () => {
  const [isMaintenance, setIsMaintenance] = useState(() => {
    return localStorage.getItem("isMaintenanceMode") === "true";
  });

  useEffect(() => {
    const handleMaintenanceChange = () => {
      const currentState = localStorage.getItem("isMaintenanceMode") === "true";
      setIsMaintenance(currentState);
    };
    window.addEventListener("maintenanceToggle", handleMaintenanceChange);
    window.addEventListener("storage", handleMaintenanceChange);

    return () => {
      window.removeEventListener("maintenanceToggle", handleMaintenanceChange);
      window.removeEventListener("storage", handleMaintenanceChange);
    };
  }, []);

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

const AppRoutes = ({ secretPath }) => {
  const safePath =
    secretPath ||
    import.meta.env.VITE_ADMIN_PATH ||
    "dashboard-mustang-private";

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scooters" element={<Scooters />} />
          <Route path="/drongo" element={<Drongo />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/velo" element={<Velo />} />
        </Route>
        <Route
          path={`/${safePath}/login`}
          element={<AdminComponents.Login />}
        />

        <Route element={<ProtectedRoute secretPath={safePath} />}>
          <Route path={`/${safePath}`} element={<AdminComponents.Layout />}>
            <Route index element={<AdminComponents.Dashboard />} />
            <Route path="products" element={<AdminComponents.Products />} />
            <Route path="add" element={<AdminComponents.EditProduct />} />
            <Route path="edit/:id" element={<AdminComponents.EditProduct />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
