import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../Admin.css";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  // Состояния для кастомного Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Состояния системы блокировки
  const [attempts, setAttempts] = useState(() => {
    return Number(localStorage.getItem("login_attempts")) || 0;
  });
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  // Инициализация и проверка таймера блокировки
  useEffect(() => {
    const lockUntil = localStorage.getItem("login_lock_until");
    if (lockUntil) {
      const remaining = Math.ceil((Number(lockUntil) - Date.now()) / 1000);
      if (remaining > 0) {
        setIsLocked(true);
        setTimeLeft(remaining);
      } else {
        // Время бана истекло — сбрасываем
        localStorage.removeItem("login_lock_until");
        localStorage.setItem("login_attempts", "0");
        setAttempts(0);
        setIsLocked(false);
      }
    }
  }, []);

  // Секундомер обратного отсчета бана
  useEffect(() => {
    if (!isLocked || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("login_lock_until");
          localStorage.setItem("login_attempts", "0");
          setAttempts(0);
          setIsLocked(false);
          showToast("Доступ разблокирован. Попробуйте снова.", "success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, timeLeft]);

  // Функция вызова кастомного уведомления (Toast)
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // Форматирование времени (минуты:секунды)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (isLocked) {
      showToast(
        `Система заблокирована. Подождите ${formatTime(timeLeft)}`,
        "error",
      );
      return;
    }

    const correctUser = import.meta.env.VITE_ADMIN_USER;
    const correctPass = import.meta.env.VITE_ADMIN_PASS;
    const secretPath = import.meta.env.VITE_ADMIN_PATH;

    if (user === correctUser && pass === correctPass) {
      localStorage.setItem("isAdminAuthenticated", "true");
      localStorage.setItem("login_attempts", "0");
      showToast("Авторизация успешна! Вход...", "success");
      setTimeout(() => {
        navigate(`/${secretPath}`);
      }, 1000);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem("login_attempts", nextAttempts.toString());

      if (nextAttempts >= 3) {
        const lockDuration = 30 * 1000;
        const lockUntilTime = Date.now() + lockDuration;
        localStorage.setItem("login_lock_until", lockUntilTime.toString());
        setIsLocked(true);
        setTimeLeft(30);
        showToast(
          "Превышено количество попыток! Доступ заблокирован на 30 секунд.",
          "error",
        );
      } else {
        showToast(
          `Неверный логин или пароль! Осталось попыток: ${3 - nextAttempts}`,
          "error",
        );
      }
    }
  };

  return (
    <div className="login-page">
      {/* Кастомный Toast Уведомлений */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`custom-toast ${toast.type}`}
          >
            <div className="toast-icon">
              {toast.type === "success" ? "✓" : "✕"}
            </div>
            <span className="toast-message">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Мягкий фоновый премиальный свет */}
      <div className="login-glow" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="login-card"
        data-aos="zoom-in"
      >
        {/* Индикатор статуса защиты (Guard Status) */}
        <div className="security-guard">
          <span
            className={`guard-dot ${isLocked ? "locked" : "active"}`}
          ></span>
          <span className="guard-text">
            {isLocked ? "GUARD: LOCKED" : "GUARD: ACTIVE SECURITY"}
          </span>
        </div>

        <div className="brand-badge">MUSTANG SYSTEM</div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>Вход в панель</h2>
          <p className="subtitle">Требуется верификация администратора</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Логин"
              required
              disabled={isLocked}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={isLocked ? "input-disabled" : ""}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Пароль"
              required
              disabled={isLocked}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className={isLocked ? "input-disabled" : ""}
            />
          </div>

          <motion.button
            whileHover={
              !isLocked ? { scale: 1.01, filter: "brightness(1.1)" } : {}
            }
            whileTap={!isLocked ? { scale: 0.99 } : {}}
            type="submit"
            className={`login-btn ${isLocked ? "btn-locked" : ""}`}
            disabled={isLocked}
          >
            {isLocked
              ? `Блокировка (${formatTime(timeLeft)})`
              : "Подтвердить вход"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
