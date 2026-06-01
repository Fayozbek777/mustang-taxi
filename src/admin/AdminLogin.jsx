import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctUser = import.meta.env.VITE_ADMIN_USER;
    const correctPass = import.meta.env.VITE_ADMIN_PASS;
    const secretPath = import.meta.env.VITE_ADMIN_PATH;

    if (user === correctUser && pass === correctPass) {
      localStorage.setItem("isAdminAuthenticated", "true");
      navigate(`/${secretPath}`);
    } else {
      alert("Доступ запрещен!");
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="login-glow"
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="login-card"
        data-aos="zoom-in" // Для библиотеки AOS
      >
        <div className="brand-badge">Mustang Control</div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>Авторизация</h2>
          <p className="subtitle">Введите данные для доступа к панели</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Логин"
              required
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Пароль"
              required
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-btn"
          >
            Войти в систему
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
