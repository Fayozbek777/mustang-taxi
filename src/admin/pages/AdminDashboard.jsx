import React, { useEffect, useState, useRef } from "react";
import { productService } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Package,
  Users,
  Plus,
  LayoutDashboard,
  Bike,
  Zap,
  ShoppingBag,
  Eye,
  EyeOff,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────── DESIGN TOKENS ─────────────── */
const T = {
  bg: "#050505",
  surface: "#0f0f12",
  card: "#131318",
  border: "rgba(255,255,255,0.06)",
  accent: "#ffd000",
  accentLo: "rgba(255,208,0,0.12)",
  accentMd: "rgba(255,208,0,0.25)",
  text: "#ffffff",
  muted: "#888888",
  dim: "#444444",
  expo: [0.16, 1, 0.3, 1],
};

/* ─────────────── ANIMATION VARIANTS ─────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, delay: i * 0.08, ease: T.expo },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: T.expo },
  }),
};

/* ─────────────── CUSTOM TOOLTIP ─────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
      }}
    >
      <p style={{ color: T.muted, fontSize: 11, margin: 0 }}>{label}</p>
      <p
        style={{
          color: T.accent,
          fontWeight: 600,
          fontSize: 16,
          margin: "2px 0 0",
        }}
      >
        {payload[0].value}
      </p>
    </div>
  );
};

/* ─────────────── STAT CARD ─────────────── */
function StatCard({ label, value, icon: Icon, color, index, trend }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = typeof value === "number" ? value : 0;
    if (end === 0) return;
    let start = 0;
    const dur = 900;
    const step = Math.ceil(end / (dur / 16));
    const t = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [value]);

  return (
    <motion.div
      custom={index}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.3, ease: T.expo } }}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "24px 24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Glow accent corner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `radial-gradient(circle at top right, ${color}18 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={color} strokeWidth={1.8} />
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#10b981",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <ArrowUpRight size={13} />
            {trend}
          </div>
        )}
      </div>

      <div>
        <p
          style={{
            color: T.muted,
            fontSize: 13,
            margin: "0 0 6px",
            fontWeight: 400,
          }}
        >
          {label}
        </p>
        <motion.h3
          style={{
            color: T.text,
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          {typeof value === "string" ? value : count.toLocaleString()}
        </motion.h3>
      </div>
    </motion.div>
  );
}

/* ─────────────── CAT CARD ─────────────── */
function CatCard({ to, icon: Icon, label, color, count, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -3,
        scale: 1.02,
        transition: { duration: 0.25, ease: T.expo },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to} style={{ textDecoration: "none" }}>
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transition: "border-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = `${color}40`)
          }
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${color}15`,
              border: `1px solid ${color}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={color} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                color: T.text,
                fontWeight: 600,
                fontSize: 14,
                margin: "0 0 2px",
              }}
            >
              {label}
            </p>
            <p style={{ color: T.muted, fontSize: 12, margin: 0 }}>
              {count} товаров
            </p>
          </div>
          <ArrowUpRight size={16} color={T.dim} />
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    scooters: 0,
    velo: 0,
    bags: 0,
    drongo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(
    () => localStorage.getItem("isMaintenanceMode") === "true",
  );

  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH;

  const chartData = [
    { name: "Пн", views: 400 },
    { name: "Вт", views: 300 },
    { name: "Ср", views: 900 },
    { name: "Чт", views: 200 },
    { name: "Пт", views: 278 },
    { name: "Сб", views: 189 },
    { name: "Вс", views: 239 },
  ];

  const categoryData = [
    { name: "Scooters", value: stats.scooters, color: "#3b82f6" },
    { name: "Velo", value: stats.velo, color: "#10b981" },
    { name: "Bags", value: stats.bags, color: T.accent },
    { name: "Drongo", value: stats.drongo, color: "#8b5cf6" },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleMaintenance = () => {
    const next = !maintenance;
    setMaintenance(next);
    localStorage.setItem("isMaintenanceMode", String(next));
    window.dispatchEvent(new Event("maintenanceToggle"));
  };

  async function fetchStats() {
    try {
      setLoading(true);
      const data = await productService.getAll();
      if (data && Array.isArray(data)) {
        const counts = data.reduce(
          (acc, item) => {
            const cat = item.category?.toLowerCase();
            if (cat === "scooters") acc.scooters++;
            else if (cat === "velo" || cat === "bicycles") acc.velo++;
            else if (cat === "bags") acc.bags++;
            else if (cat === "drongo") acc.drongo++;
            acc.total++;
            return acc;
          },
          { total: 0, scooters: 0, velo: 0, bags: 0, drongo: 0 },
        );
        setStats(counts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* ── Styles ── */
  const s = {
    root: {
      minHeight: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "0 0 60px",
    },
    header: {
      borderBottom: `1px solid ${T.border}`,
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      background: `${T.surface}cc`,
      backdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexWrap: "wrap",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    h1: {
      fontSize: 20,
      fontWeight: 700,
      margin: 0,
      letterSpacing: "-0.4px",
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    toggleBlock: (on) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: on ? T.accentLo : "rgba(255,255,255,0.04)",
      border: `1px solid ${on ? T.accent + "44" : T.border}`,
      borderRadius: 12,
      padding: "8px 14px",
      cursor: "pointer",
      userSelect: "none",
      transition: "all 0.3s ease",
    }),
    toggleText: (on) => ({
      fontSize: 13,
      fontWeight: 500,
      color: on ? T.accent : T.muted,
      whiteSpace: "nowrap",
    }),
    track: (on) => ({
      width: 36,
      height: 20,
      borderRadius: 10,
      background: on ? T.accent : T.dim,
      position: "relative",
      transition: "background 0.3s",
      flexShrink: 0,
    }),
    thumb: (on) => ({
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: on ? T.bg : T.surface,
      position: "absolute",
      top: 3,
      left: on ? 19 : 3,
      transition: "left 0.25s cubic-bezier(0.16,1,0.3,1)",
    }),
    addBtn: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: T.accent,
      color: T.bg,
      border: "none",
      borderRadius: 12,
      padding: "9px 18px",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      textDecoration: "none",
      transition: "opacity 0.2s, transform 0.2s",
      whiteSpace: "nowrap",
    },
    body: { padding: "32px 32px 0", maxWidth: 1280, margin: "0 auto" },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.1em",
      color: T.muted,
      textTransform: "uppercase",
      margin: "0 0 16px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 16,
      marginBottom: 28,
    },
    chartsRow: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 16,
      marginBottom: 28,
    },
    chartCard: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: "24px",
    },
    chartTitle: {
      fontSize: 15,
      fontWeight: 600,
      color: T.text,
      margin: "0 0 20px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    catGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12,
    },
    divider: {
      height: 1,
      background: T.border,
      margin: "28px 0",
    },
  };

  const catLinks = [
    {
      to: `/${SECRET_PATH}/products?cat=scooters`,
      icon: Zap,
      label: "Scooters",
      color: "#3b82f6",
      count: stats.scooters,
    },
    {
      to: `/${SECRET_PATH}/products?cat=velo`,
      icon: Bike,
      label: "Bicycles",
      color: "#10b981",
      count: stats.velo,
    },
    {
      to: `/${SECRET_PATH}/products?cat=bags`,
      icon: ShoppingBag,
      label: "Bags",
      color: T.accent,
      count: stats.bags,
    },
    {
      to: `/${SECRET_PATH}/products?cat=drongo`,
      icon: Zap,
      label: "Drongo",
      color: "#8b5cf6",
      count: stats.drongo,
    },
  ];

  return (
    <div style={s.root}>
      {/* ── HEADER ── */}
      <motion.header
        style={s.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: T.expo }}
      >
        <div style={s.headerLeft}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <LayoutDashboard size={22} color={T.accent} strokeWidth={1.8} />
          </motion.div>
          <h1 style={s.h1}>Панель управления</h1>
        </div>

        <div style={s.headerRight}>
          {/* Maintenance toggle */}
          <motion.div
            style={s.toggleBlock(maintenance)}
            onClick={handleToggleMaintenance}
            whileTap={{ scale: 0.96 }}
          >
            <AnimatePresence mode="wait">
              {maintenance ? (
                <motion.div
                  key="off"
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff size={15} color={T.accent} />
                </motion.div>
              ) : (
                <motion.div
                  key="on"
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye size={15} color={T.muted} />
                </motion.div>
              )}
            </AnimatePresence>
            <span style={s.toggleText(maintenance)}>
              {maintenance ? "Техработы включены" : "Сайт открыт"}
            </span>
            <div style={s.track(maintenance)}>
              <motion.div
                style={s.thumb(maintenance)}
                animate={{ left: maintenance ? 19 : 3 }}
                transition={{ duration: 0.25, ease: T.expo }}
              />
            </div>
          </motion.div>

          {/* Add product btn */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to={`/${SECRET_PATH}/add`} style={s.addBtn}>
              <Plus size={16} strokeWidth={2.5} />
              Добавить товар
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <div style={s.body}>
        {/* ── STATS ── */}
        <motion.p
          style={s.sectionLabel}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Обзор
        </motion.p>
        <div style={s.statsGrid}>
          <StatCard
            index={0}
            label="Всего товаров"
            value={loading ? "..." : stats.total}
            icon={Package}
            color="#3b82f6"
            trend="+12%"
          />
          <StatCard
            index={1}
            label="Просмотры"
            value={1284}
            icon={Users}
            color="#8b5cf6"
            trend="+8%"
          />
          <StatCard
            index={2}
            label="Активность"
            value={loading ? "..." : stats.scooters + stats.velo}
            icon={Activity}
            color="#10b981"
            trend="+5%"
          />
          <StatCard
            index={3}
            label="Категории"
            value={4}
            icon={TrendingUp}
            color={T.accent}
          />
        </div>

        <div style={s.divider} />

        {/* ── CHARTS ── */}
        <motion.p
          style={s.sectionLabel}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Аналитика
        </motion.p>

        <motion.div
          style={s.chartsRow}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          {/* Bar chart */}
          <div style={s.chartCard}>
            <p style={s.chartTitle}>
              <Activity size={16} color={T.accent} />
              Активность по дням
            </p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={chartData} barCategoryGap="35%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: T.muted, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.views ===
                        Math.max(...chartData.map((d) => d.views))
                          ? T.accent
                          : "rgba(255,255,255,0.08)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div style={s.chartCard}>
            <p style={s.chartTitle}>
              <Package size={16} color={T.accent} />
              Категории
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={48}
                  outerRadius={68}
                  dataKey="value"
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 4,
              }}
            >
              {categoryData.map((c) => (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: c.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: T.muted, fontSize: 13 }}>
                      {c.name}
                    </span>
                  </div>
                  <span
                    style={{ color: T.text, fontWeight: 600, fontSize: 13 }}
                  >
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={s.divider} />

        {/* ── CATEGORIES ── */}
        <motion.p
          style={s.sectionLabel}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          Разделы каталога
        </motion.p>
        <div style={s.catGrid}>
          {catLinks.map((c, i) => (
            <CatCard key={c.label} {...c} index={i} />
          ))}
        </div>
      </div>

      {/* ── RESPONSIVE OVERRIDES ── */}
      <style>{`
        @media (max-width: 900px) {
          .charts-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          header { padding: 14px 16px !important; }
          .body  { padding: 20px 16px 0 !important; }
        }
      `}</style>
    </div>
  );
}
