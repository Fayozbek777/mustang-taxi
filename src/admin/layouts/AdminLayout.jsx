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
  Settings, // 🔥 Импортируем иконку шестеренки для настроек
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../UI/AdminLayout.css";

const EXPO = [0.16, 1, 0.3, 1];

const sidebarVariants = {
  open: { x: 0, transition: { duration: 0.38, ease: EXPO } },
  closed: { x: "-100%", transition: { duration: 0.32, ease: EXPO } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: i * 0.055, ease: EXPO },
  }),
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH;

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  /* lock body scroll when mobile sidebar is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: `/${SECRET_PATH}`, icon: LayoutDashboard },
    {
      name: "Scooters",
      path: `/${SECRET_PATH}/products?cat=scooters`,
      icon: Zap,
    },
    { name: "Bicycles", path: `/${SECRET_PATH}/products?cat=velo`, icon: Bike },
    {
      name: "Drongo",
      path: `/${SECRET_PATH}/products?cat=drongo`,
      icon: ArrowRightLeft,
    },
    {
      name: "Bags",
      path: `/${SECRET_PATH}/products?cat=bags`,
      icon: ShoppingBag,
    },
    { name: "Settings", path: `/${SECRET_PATH}/settings`, icon: Settings }, // 🔥 Добавили вкладку настроек
  ];

  const isActive = (path) => location.pathname + location.search === path;

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const SidebarContent = () => (
    <>
      <div className="al-logo">
        <div className="al-logo-mark">M</div>
        <span className="al-logo-text">
          {" "}
          MY<span className="al-logo-accent">ADMIN</span>{" "}
        </span>
      </div>
      <nav className="al-nav">
        <span className="al-nav-label">Management</span>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <motion.div
              key={item.name}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={item.path}
                className={`al-nav-item${active ? " al-nav-item--active" : ""}`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="al-nav-icon">
                  <Icon size={17} strokeWidth={1.8} />
                </span>
                {item.name}
                {active && <span className="al-nav-dot" />}
              </Link>
            </motion.div>
          );
        })}
        <div className="al-nav-divider" />
      </nav>
      <div className="al-footer">
        <button className="al-logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.8} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="al-root">
      <aside className="al-sidebar al-sidebar--desktop">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="al-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      <motion.aside
        className="al-sidebar al-sidebar--mobile"
        variants={sidebarVariants}
        initial="closed"
        animate={mobileOpen ? "open" : "closed"}
      >
        <SidebarContent />
      </motion.aside>
      {/* ── Mobile menu toggle ── */}
      <motion.button
        className="al-menu-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Menu size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      {/* ── Main ── */}
      <main className="al-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
