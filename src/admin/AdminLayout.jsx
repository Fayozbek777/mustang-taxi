import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bike,
  Zap,
  ShoppingBag,
  LogOut,
  ArrowRightLeft,
  Menu,
  X,
} from "lucide-react";
import "./UI/Admin.css";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH;

  // Закрываем меню при смене страницы (для мобилок)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: `/${SECRET_PATH}`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Scooters",
      path: `/${SECRET_PATH}/products?cat=scooters`,
      icon: <Zap size={20} />,
    },
    {
      name: "Bicycles",
      path: `/${SECRET_PATH}/products?cat=velo`,
      icon: <Bike size={20} />,
    },
    {
      name: "Drongo",
      path: `/${SECRET_PATH}/products?cat=drongo`,
      icon: <ArrowRightLeft size={20} />,
    },
    {
      name: "Bags",
      path: `/${SECRET_PATH}/products?cat=bags`,
      icon: <ShoppingBag size={20} />,
    },
  ];

  return (
    <div className="admin-layout">
      {/* Кнопка открытия меню для мобилок */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Оверлей (затемнение) при открытом меню на мобилке */}
      {isMobileMenuOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar__logo">
          <span className="logo-my">MY</span>
          <span className="logo-mustang">ADMIN</span>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="nav-label">Management</div>
          {menuItems.map((item) => {
            const isActive = location.pathname + location.search === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
          <div className="nav-divider" />
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
