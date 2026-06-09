import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../UI/AdminLogin.css";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Toast({ message, type, onDone }) {
  return (
    <motion.div
      className={`al-toast al-toast--${type}`}
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="al-toast-icon">{type === "success" ? "✓" : "✕"}</span>
      <span className="al-toast-msg">{message}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   AdminLogin
   ═══════════════════════════════════════════════════ */
export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [attempts, setAttempts] = useState(
    () => Number(localStorage.getItem("login_attempts")) || 0,
  );
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const userRef = useRef(null);
  const navigate = useNavigate();

  /* focus on mount */
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  /* init lock state */
  useEffect(() => {
    const lockUntil = localStorage.getItem("login_lock_until");
    if (lockUntil) {
      const rem = Math.ceil((Number(lockUntil) - Date.now()) / 1000);
      if (rem > 0) {
        setIsLocked(true);
        setTimeLeft(rem);
      } else {
        localStorage.removeItem("login_lock_until");
        localStorage.setItem("login_attempts", "0");
        setAttempts(0);
      }
    }
  }, []);

  /* countdown */
  useEffect(() => {
    if (!isLocked || timeLeft <= 0) return;
    const iv = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(iv);
          localStorage.removeItem("login_lock_until");
          localStorage.setItem("login_attempts", "0");
          setAttempts(0);
          setIsLocked(false);
          showToast("Доступ разблокирован", "success");
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isLocked, timeLeft]);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLocked) {
      showToast(`Заблокировано — ${fmt(timeLeft)}`, "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cu = import.meta.env.VITE_ADMIN_USER;
      const cp = import.meta.env.VITE_ADMIN_PASS;
      const sp = import.meta.env.VITE_ADMIN_PATH;

      if (user === cu && pass === cp) {
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("login_attempts", "0");
        showToast("Авторизация успешна", "success");
        setTimeout(() => navigate(`/${sp}`), 900);
      } else {
        const next = attempts + 1;
        setAttempts(next);
        localStorage.setItem("login_attempts", String(next));
        if (next >= 3) {
          const until = Date.now() + 30_000;
          localStorage.setItem("login_lock_until", String(until));
          setIsLocked(true);
          setTimeLeft(30);
          showToast("Превышен лимит попыток — блокировка на 30 с", "error");
        } else {
          showToast(`Неверные данные — осталось ${3 - next} попытки`, "error");
        }
      }
    }, 600);
  };

  const attemptsLeft = Math.max(0, 3 - attempts);

  return (
    <div className="al-page">
      {/* ambient glows */}
      <div className="al-glow al-glow--1" />
      <div className="al-glow al-glow--2" />

      {/* grid texture */}
      <div className="al-grid" aria-hidden="true" />

      {/* Toast */}
      <div className="al-toast-zone" aria-live="polite">
        <AnimatePresence>
          {toast.show && (
            <Toast key="t" message={toast.message} type={toast.type} />
          )}
        </AnimatePresence>
      </div>

      {/* Card */}
      <motion.div
        className="al-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* guard strip */}
        <div className={`al-guard${isLocked ? " al-guard--locked" : ""}`}>
          <span className="al-guard-dot" />
          <span className="al-guard-label">
            {isLocked ? "GUARD: LOCKED" : "GUARD: ACTIVE"}
          </span>
        </div>

        {/* brand */}
        <div className="al-brand">
          <div className="al-brand-icon">M</div>
          <div>
            <div className="al-brand-name">MUSTANG</div>
            <div className="al-brand-sub">ADMIN SYSTEM</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="al-form" noValidate>
          <div className="al-form-head">
            <h1 className="al-form-title">Вход в панель</h1>
            <p className="al-form-desc">Требуется верификация администратора</p>
          </div>

          {/* Login */}
          <div className="al-field">
            <label className="al-label" htmlFor="al-user">
              Логин
            </label>
            <div className="al-input-wrap">
              <svg
                className="al-input-icon"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="5"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="al-user"
                ref={userRef}
                type="text"
                className={`al-input${isLocked ? " al-input--locked" : ""}`}
                placeholder="admin"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                disabled={isLocked}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="al-field">
            <label className="al-label" htmlFor="al-pass">
              Пароль
            </label>
            <div className="al-input-wrap">
              <svg
                className="al-input-icon"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <rect
                  x="2.5"
                  y="6"
                  width="9"
                  height="6.5"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M4.5 6V4.5a2.5 2.5 0 015 0V6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="al-pass"
                type={showPass ? "text" : "password"}
                className={`al-input al-input--pad-r${isLocked ? " al-input--locked" : ""}`}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                disabled={isLocked}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="al-eye"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
                tabIndex={isLocked ? -1 : 0}
              >
                {showPass ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="7"
                      cy="7"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M2 2l10 10"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="7"
                      cy="7"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Attempts bar */}
          {attempts > 0 && !isLocked && (
            <motion.div
              className="al-attempts"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
            >
              <span>Попыток осталось</span>
              <div className="al-attempts-dots">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`al-attempts-dot${i < attemptsLeft ? "" : " used"}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            className={`al-btn${isLocked ? " al-btn--locked" : ""}${loading ? " al-btn--loading" : ""}`}
            disabled={isLocked || loading}
            whileHover={!isLocked && !loading ? { scale: 1.01 } : {}}
            whileTap={!isLocked && !loading ? { scale: 0.98 } : {}}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="spin"
                  className="al-spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              ) : isLocked ? (
                <motion.span
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Заблокировано — {fmt(timeLeft)}
                </motion.span>
              ) : (
                <motion.span
                  key="normal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Подтвердить вход
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
