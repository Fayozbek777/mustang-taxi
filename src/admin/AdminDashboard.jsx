import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    scooters: 0,
    velo: 0,
    bags: 0,
    drongo: 0,
  });
  const [loading, setLoading] = useState(true);
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
    { name: "Bags", value: stats.bags, color: "#f59e0b" },
    { name: "Drongo", value: stats.drongo, color: "#8b5cf6" },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data } = await supabase.from("products").select("category");
      if (data) {
        const counts = data.reduce(
          (acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            acc.total += 1;
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

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <LayoutDashboard className="icon-accent" />
          <h1>Панель управления</h1>
        </div>
        <Link to={`/${SECRET_PATH}/add`} className="btn-save">
          <Plus size={20} /> Добавить товар
        </Link>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <p>Всего товаров</p>
            <h3>{stats.total}</h3>
          </div>
          <Package color="#3b82f6" />
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p>Просмотры</p>
            <h3>1,284</h3>
          </div>
          <Users color="#8b5cf6" />
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-container main-chart">
          <h3>Активность (просмотры)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="views" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container pie-chart">
          <h3>Категории</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                paddingAngle={5}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="section-subtitle">Быстрый переход к разделам</h3>
      <div className="categories-manage-grid">
        <Link
          to={`/${SECRET_PATH}/products?cat=scooters`}
          className="cat-manage-card"
        >
          <Zap /> Scooters
        </Link>
        <Link
          to={`/${SECRET_PATH}/products?cat=velo`}
          className="cat-manage-card"
        >
          <Bike /> Bicycles
        </Link>
        <Link
          to={`/${SECRET_PATH}/products?cat=bags`}
          className="cat-manage-card"
        >
          <ShoppingBag /> Bags
        </Link>
        <Link
          to={`/${SECRET_PATH}/products?cat=drongo`}
          className="cat-manage-card"
        >
          <Zap /> Drongo
        </Link>
      </div>
    </div>
  );
}
