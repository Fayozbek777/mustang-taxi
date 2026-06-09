import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { onLCP, onINP, onCLS } from "web-vitals";
import Stats from "stats.js";
import { toast } from "react-hot-toast";
import {
  Sliders,
  Plus,
  Activity,
  Wifi,
  Cpu,
  User,
  Key,
  Lock,
  Bot,
  Eye,
  EyeOff,
  MessageSquare,
  ShieldCheck,
  Save,
  UserPlus,
} from "lucide-react";
import "../UI/AdminSettings.css";

/* ─── Maintenance Toggle ─────────────────────────── */
function MaintenanceToggle({ on, onToggle }) {
  return (
    <button
      className={`as-maintenance-toggle${on ? " is-on" : ""}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Деактивировать техработы" : "Активировать техработы"}
    >
      <span className="as-toggle-dot" />
      <span className="as-toggle-label">
        {on ? "Техработы" : "Сайт открыт"}
      </span>
    </button>
  );
}

/* ─── Card ────────────────────────────────────────── */
function Card({
  icon,
  iconClass = "as-card-icon--yellow",
  title,
  subtitle,
  children,
  noHover,
}) {
  return (
    <div className={`as-card${noHover ? " as-card--no-hover" : ""}`}>
      <div className="as-card-head">
        <div className={`as-card-icon ${iconClass}`}>{icon}</div>
        <div>
          <div className="as-card-title">{title}</div>
          {subtitle && <div className="as-card-subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Field ───────────────────────────────────────── */
function Field({ label, icon, children }) {
  return (
    <div className="as-field">
      {label && (
        <label>
          {icon}
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

/* ─── PasswordInput ───────────────────────────────── */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="as-input-wrap">
      <input
        type={show ? "text" : "password"}
        className="as-input as-input--pad-r"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "••••••••"}
      />
      <button
        type="button"
        className="as-eye-btn"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Скрыть" : "Показать"}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

/* ─── Vital status badge ──────────────────────────── */
function VitalBadge({ status }) {
  const isGood = !["Задержка", "Нестабильно"].includes(status);
  return (
    <span className={`as-vital-badge${isGood ? "" : " warn"}`}>{status}</span>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */
export default function AdminSettings() {
  const SECRET_PATH =
    import.meta.env.VITE_ADMIN_PATH || "dashboard-mustang-private";
  const statsContainerRef = useRef(null);

  const [maintenance, setMaintenance] = useState(
    () => localStorage.getItem("isMaintenanceMode") === "true",
  );
  const [networkTraffic, setNetworkTraffic] = useState("0.00 MB");
  const [vitals, setVitals] = useState({
    lcp: { value: "—", status: "Ожидание" },
    inp: { value: "—", status: "Ожидание" },
    cls: { value: "—", status: "Ожидание" },
  });

  const [adminUser, setAdminUser] = useState(
    () =>
      localStorage.getItem("VITE_ADMIN_USER") ||
      import.meta.env.VITE_ADMIN_USER ||
      "admin",
  );
  const [adminPass, setAdminPass] = useState(
    () =>
      localStorage.getItem("VITE_ADMIN_PASS") ||
      import.meta.env.VITE_ADMIN_PASS ||
      "aslbek",
  );
  const [botToken, setBotToken] = useState(
    () =>
      localStorage.getItem("VITE_BOT_TOKEN") ||
      import.meta.env.VITE_BOT_TOKEN ||
      "",
  );
  const [chatId, setChatId] = useState(
    () =>
      localStorage.getItem("VITE_CHAT_ID") ||
      import.meta.env.VITE_CHAT_ID ||
      "",
  );
  const [tinyPngKey, setTinyPngKey] = useState(
    () =>
      localStorage.getItem("TINYPNG_API_KEY") ||
      import.meta.env.TINYPNG_API_KEY ||
      "",
  );

  const [teamList, setTeamList] = useState(() => {
    const saved = localStorage.getItem("mustang_team_users");
    return saved
      ? JSON.parse(saved)
      : [{ username: "admin", role: "Супер-Админ" }];
  });
  const [newUsername, setNewUsername] = useState("");
  const [newUserRole, setNewUserRole] = useState("Модератор");

  /* ── Stats.js ──────────────────────────────────── */
  useEffect(() => {
    const stats = new Stats();
    stats.dom.style.position = "relative";
    stats.dom.style.top = "0";
    stats.dom.style.left = "0";
    stats.dom.style.zIndex = "1";
    if (statsContainerRef.current) {
      statsContainerRef.current.appendChild(stats.dom);
    }
    let animId;
    const loop = () => {
      stats.begin();
      stats.end();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    stats.showPanel(0);

    onLCP((m) => {
      const val = (m.value / 1000).toFixed(2) + " с";
      setVitals((p) => ({
        ...p,
        lcp: { value: val, status: m.value < 2500 ? "Отлично" : "Задержка" },
      }));
    });
    onINP((m) => {
      const val = m.value.toFixed(0) + " мс";
      setVitals((p) => ({
        ...p,
        inp: { value: val, status: m.value < 200 ? "Отлично" : "Задержка" },
      }));
    });
    onCLS((m) => {
      const val = m.value.toFixed(3);
      setVitals((p) => ({
        ...p,
        cls: { value: val, status: m.value < 0.1 ? "Отлично" : "Нестабильно" },
      }));
    });

    const calcTraffic = () => {
      const resources = performance.getEntriesByType("resource");
      let total = 0;
      resources.forEach((r) => {
        if (r.transferSize) total += r.transferSize;
      });
      setNetworkTraffic((total / 1024 / 1024).toFixed(2) + " MB");
    };
    calcTraffic();
    const iv = setInterval(calcTraffic, 2000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(iv);
      if (statsContainerRef.current) statsContainerRef.current.innerHTML = "";
    };
  }, []);

  /* ── Handlers ──────────────────────────────────── */
  const handleToggleMaintenance = () => {
    const next = !maintenance;
    setMaintenance(next);
    localStorage.setItem("isMaintenanceMode", String(next));
    window.dispatchEvent(new Event("maintenanceToggle"));
    if (next) toast.error("Техработы активированы — витрина закрыта");
    else toast.success("Сайт открыт для клиентов");
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("VITE_ADMIN_USER", adminUser);
    localStorage.setItem("VITE_ADMIN_PASS", adminPass);
    localStorage.setItem("VITE_BOT_TOKEN", botToken);
    localStorage.setItem("VITE_CHAT_ID", chatId);
    localStorage.setItem("TINYPNG_API_KEY", tinyPngKey);
    toast.success("Ключи сохранены");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Введите имя пользователя");
      return;
    }
    const updated = [
      ...teamList,
      { username: newUsername.trim(), role: newUserRole },
    ];
    setTeamList(updated);
    localStorage.setItem("mustang_team_users", JSON.stringify(updated));
    setNewUsername("");
    toast.success(`@${newUsername} добавлен как ${newUserRole}`);
  };

  const badgeClass = (role) => {
    if (role === "Супер-Админ") return "as-badge as-badge--super";
    if (role === "Администратор") return "as-badge as-badge--mod";
    return "as-badge as-badge--tech";
  };

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className="as-page">
      {/* Header */}
      <header className="as-header">
        <div className="as-header-left">
          <div className="as-header-icon">
            <Sliders size={17} />
          </div>
          <div>
            <div className="as-header-eyebrow">Mustang Admin</div>
            <div className="as-header-title">Глобальные настройки</div>
          </div>
        </div>

        <div className="as-header-right">
          <MaintenanceToggle
            on={maintenance}
            onToggle={handleToggleMaintenance}
          />
          <Link to={`/${SECRET_PATH}/add`} className="as-add-btn">
            <Plus size={14} strokeWidth={2.5} />
            <span>Добавить товар</span>
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="as-body">
        {/* ── Monitor row ── */}
        <div className="as-monitor-grid">
          <Card
            icon={<Cpu size={16} />}
            iconClass="as-card-icon--green"
            title="Аппаратные датчики"
            subtitle="Stats.js — кликни по панели для смены режима"
            noHover
          >
            <p className="as-stats-desc">
              FPS / MS / MEM — живые показатели рендеринга браузера
            </p>
            <div className="as-stats-wrap" ref={statsContainerRef} />
          </Card>

          <Card
            icon={<Activity size={16} />}
            iconClass="as-card-icon--cyan"
            title="Web Vitals"
            subtitle="Метрики производительности Google"
          >
            <div className="as-vitals-list">
              <div className="as-vital-row">
                <span className="as-vital-label">Отрисовка (LCP)</span>
                <span className="as-vital-val">
                  {vitals.lcp.value}
                  <VitalBadge status={vitals.lcp.status} />
                </span>
              </div>
              <div className="as-vital-row">
                <span className="as-vital-label">Отклик ввода (INP)</span>
                <span className="as-vital-val">
                  {vitals.inp.value}
                  <VitalBadge status={vitals.inp.status} />
                </span>
              </div>
              <div className="as-vital-row">
                <span className="as-vital-label">Сдвиг вёрстки (CLS)</span>
                <span className="as-vital-val">
                  {vitals.cls.value}
                  <VitalBadge status={vitals.cls.status} />
                </span>
              </div>
              <div className="as-vital-row">
                <span className="as-vital-label">
                  <Wifi size={12} /> Сетевой трафик
                </span>
                <span className="as-vital-val as-vital-traffic">
                  {networkTraffic}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Main row ── */}
        <div className="as-main-grid">
          {/* Left: forms */}
          <form className="as-form-left" onSubmit={handleSaveConfig}>
            <Card
              icon={<Lock size={16} />}
              iconClass="as-card-icon--red"
              title="Аутентификация"
              subtitle="Логин и пароль супер-администратора"
            >
              <div className="as-row-2">
                <Field label="Логин" icon={<User size={11} />}>
                  <input
                    type="text"
                    className="as-input"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="admin"
                  />
                </Field>
                <Field label="Пароль" icon={<Key size={11} />}>
                  <PasswordInput
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card
              icon={<Bot size={16} />}
              iconClass="as-card-icon--blue"
              title="Конфигурация .env"
              subtitle="Токены, ключи и идентификаторы"
            >
              <div style={{ marginBottom: 14 }}>
                <Field label="Telegram Bot Token" icon={<Bot size={11} />}>
                  <PasswordInput
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="1234567890:AAF..."
                  />
                </Field>
              </div>
              <div className="as-row-2">
                <Field
                  label="Telegram Chat ID"
                  icon={<MessageSquare size={11} />}
                >
                  <input
                    type="text"
                    className="as-input"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="-100..."
                  />
                </Field>
                <Field label="TinyPNG API Key" icon={<Key size={11} />}>
                  <input
                    type="text"
                    className="as-input"
                    value={tinyPngKey}
                    onChange={(e) => setTinyPngKey(e.target.value)}
                    placeholder="••••••••••••••••"
                  />
                </Field>
              </div>
            </Card>

            <button type="submit" className="as-btn-save">
              <Save size={14} />
              Сохранить ключи
            </button>
          </form>

          {/* Right: team */}
          <div className="as-form-right">
            <Card
              icon={<ShieldCheck size={16} />}
              iconClass="as-card-icon--yellow"
              title="Управление командой"
              subtitle="Выдача доступов сотрудникам"
            >
              <form onSubmit={handleCreateUser} className="as-team-subform">
                <Field label="Имя сотрудника" icon={<User size={11} />}>
                  <input
                    type="text"
                    className="as-input"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="doston"
                  />
                </Field>
                <Field label="Роль доступа">
                  <select
                    className="as-select"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                  >
                    <option value="Администратор">Администратор</option>
                    <option value="Модератор">Модератор</option>
                    <option value="Техник поддержки">Техник поддержки</option>
                  </select>
                </Field>
                <button type="submit" className="as-btn-access">
                  <UserPlus size={14} />
                  Выдать доступ
                </button>
              </form>

              {/* Team list */}
              <div className="as-team-label">
                Состав команды — {teamList.length}
              </div>
              <div className="as-team-list">
                {teamList.map((user, idx) => (
                  <div key={idx} className="as-team-item">
                    <span className="as-team-username">@{user.username}</span>
                    <span className={badgeClass(user.role)}>{user.role}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
