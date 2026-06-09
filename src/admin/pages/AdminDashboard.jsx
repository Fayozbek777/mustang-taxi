import React, { useEffect, useState, useRef, useCallback } from "react";
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
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import "../UI/AdminDashboard.css";

/* ─── Tokens ─── */
const T = {
  bg: "#050505",
  surf: "#0f0f12",
  card: "#131318",
  border: "rgba(255,255,255,0.06)",
  bh: "rgba(255,255,255,0.11)",
  acc: "#ffd000",
  accLo: "rgba(255,208,0,0.10)",
  accMd: "rgba(255,208,0,0.22)",
  txt: "#ffffff",
  dim: "#888888",
  muted: "#444444",
  green: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  expo: [0.16, 1, 0.3, 1],
};

/* ─── Motion Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: i * 0.07, ease: T.expo },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.065, ease: T.expo },
  }),
};

const slideDown = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: T.expo } },
};

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ad-tooltip">
      <p className="ad-tooltip-label">{label}</p>
      <p className="ad-tooltip-val">{payload[0].value}</p>
    </div>
  );
};

/* ─── Animated Counter ─── */
function AnimatedNumber({ value }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (typeof value !== "number") return;
    const ctrl = animate(mv, value, { duration: 0.9, ease: T.expo });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      ctrl.stop();
      unsub();
    };
  }, [value]);

  if (typeof value === "string") return <span>{value}</span>;
  return <motion.span>{display}</motion.span>;
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon, color, index, trend }) {
  return (
    <motion.div
      custom={index}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.28, ease: T.expo } }}
      className="ad-stat"
    >
      <div className="ad-stat-glow" style={{ background: color }} />
      <div className="ad-stat-top">
        <div
          className="ad-stat-icon"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}28`,
          }}
        >
          <Icon size={19} color={color} strokeWidth={1.8} />
        </div>
        {trend && (
          <div className="ad-stat-trend">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="ad-stat-label">{label}</p>
        <h3 className="ad-stat-val">
          <AnimatedNumber value={value} />
        </h3>
      </div>
    </motion.div>
  );
}

/* ─── Category Card ─── */
function CatCard({ to, icon: Icon, label, color, count, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -3,
        scale: 1.015,
        transition: { duration: 0.22, ease: T.expo },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to} className="ad-cat-card" style={{ "--cat-color": color }}>
        <div
          className="ad-cat-icon"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}22`,
          }}
        >
          <Icon size={17} color={color} strokeWidth={1.8} />
        </div>
        <div className="ad-cat-info">
          <p className="ad-cat-name">{label}</p>
          <p className="ad-cat-count">{count} товаров</p>
        </div>
        <ArrowUpRight size={15} className="ad-cat-arrow" />
      </Link>
    </motion.div>
  );
}

/* ─── Maintenance Toggle ─── */

/* ─── Main ─── */
export default function AdminDashboard() {
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH;

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

  const chartData = [
    { name: "Пн", views: 400 },
    { name: "Вт", views: 300 },
    { name: "Ср", views: 900 },
    { name: "Чт", views: 200 },
    { name: "Пт", views: 278 },
    { name: "Сб", views: 189 },
    { name: "Вс", views: 239 },
  ];
  const maxBar = Math.max(...chartData.map((d) => d.views));

  const categoryData = [
    { name: "Scooters", value: stats.scooters, color: T.blue },
    { name: "Velo", value: stats.velo, color: T.green },
    { name: "Bags", value: stats.bags, color: T.acc },
    { name: "Drongo", value: stats.drongo, color: T.purple },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      if (Array.isArray(data)) {
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
  };

  const handleToggleMaintenance = () => {
    const next = !maintenance;
    setMaintenance(next);
    localStorage.setItem("isMaintenanceMode", String(next));
    window.dispatchEvent(new Event("maintenanceToggle"));
  };

  const catLinks = [
    {
      to: `/${SECRET_PATH}/products?cat=scooters`,
      icon: Zap,
      label: "Scooters",
      color: T.blue,
      count: stats.scooters,
    },
    {
      to: `/${SECRET_PATH}/products?cat=velo`,
      icon: Bike,
      label: "Bicycles",
      color: T.green,
      count: stats.velo,
    },
    {
      to: `/${SECRET_PATH}/products?cat=bags`,
      icon: ShoppingBag,
      label: "Bags",
      color: T.acc,
      count: stats.bags,
    },
    {
      to: `/${SECRET_PATH}/products?cat=drongo`,
      icon: Zap,
      label: "Drongo",
      color: T.purple,
      count: stats.drongo,
    },
  ];

  return (
    <div className="ad-root">
      {/* ── Header ── */}
      <motion.header
        className="ad-header"
        variants={slideDown}
        initial="hidden"
        animate="visible"
      >
        <div className="ad-header-left">
          <motion.div
            className="ad-header-icon"
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ duration: 0.25 }}
          >
            <LayoutDashboard size={18} color={T.acc} strokeWidth={1.8} />
          </motion.div>
          <h1 className="ad-h1">Панель управления</h1>
        </div>
      </motion.header>

      <div className="ad-body">
        {/* ── Stats ── */}
        <motion.p
          className="ad-sec-label"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Обзор
        </motion.p>
        <div className="ad-stats-grid">
          <StatCard
            index={0}
            label="Всего товаров"
            value={loading ? "..." : stats.total}
            icon={Package}
            color={T.blue}
            trend="+12%"
          />
          <StatCard
            index={1}
            label="Просмотры"
            value={1284}
            icon={Users}
            color={T.purple}
            trend="+8%"
          />
          <StatCard
            index={2}
            label="Активность"
            value={loading ? "..." : stats.scooters + stats.velo}
            icon={Activity}
            color={T.green}
            trend="+5%"
          />
          <StatCard
            index={3}
            label="Категории"
            value={4}
            icon={TrendingUp}
            color={T.acc}
          />
        </div>

        <div className="ad-divider" />

        {/* ── Charts ── */}
        <motion.p
          className="ad-sec-label"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Аналитика
        </motion.p>

        <motion.div
          className="ad-charts-row"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          {/* Bar chart */}
          <div className="ad-chart-card">
            <p className="ad-chart-title">
              <Activity size={15} color={T.acc} />
              Активность по дням
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="38%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: T.dim, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="views"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.views === maxBar
                          ? T.acc
                          : "rgba(255,255,255,0.07)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="ad-chart-card">
            <p className="ad-chart-title">
              <Package size={15} color={T.acc} />
              По категориям
            </p>
            <div className="ad-pie-wrap">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={42}
                    outerRadius={60}
                    dataKey="value"
                    paddingAngle={4}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
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
                      color: T.txt,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="ad-pie-center">
                <span className="ad-pie-total">{stats.total || 24}</span>
                <span className="ad-pie-lbl">товаров</span>
              </div>
            </div>
            <div className="ad-legend">
              {categoryData.map((c) => (
                <div key={c.name} className="ad-leg-row">
                  <div className="ad-leg-left">
                    <span
                      className="ad-leg-dot"
                      style={{ background: c.color }}
                    />
                    <span className="ad-leg-name">{c.name}</span>
                  </div>
                  <span className="ad-leg-val">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="ad-divider" />

        {/* ── Categories ── */}
        <motion.p
          className="ad-sec-label"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          Разделы каталога
        </motion.p>
        <div className="ad-cat-grid">
          {catLinks.map((c, i) => (
            <CatCard key={c.label} {...c} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
