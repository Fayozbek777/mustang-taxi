import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Battery, Gauge, Zap, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../services/supabaseClient";

import "./UI/Drongo.css";
import { FaCheckCircle } from "react-icons/fa";

// Вспомогательный компонент для одного товара Drongo
const DrongoItem = ({ item, t, i18n }) => {
  const [activePhoto, setActivePhoto] = useState(0);

  const getLangText = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;

    const currentLang = i18n.language || "uz";
    return data[currentLang] || data["ru"] || data["uz"] || "";
  };
  const photos =
    item.images?.length > 0 ? item.images : ["https://via.placeholder.com/600"];

  // Функция конвертации цен на лету
  const getFormattedPrice = (priceRaw, lang) => {
    // Убираем лишние символы из цены, если они пришли из БД (оставляем только цифры)
    const baseUzS = parseInt(priceRaw?.toString().replace(/\D/g, "")) || 0;

    const rates = {
      uz: { val: baseUzS.toLocaleString(), sym: "so'm", period: "kuniga" },
      ru: {
        val: Math.round(baseUzS / 135).toLocaleString(),
        sym: "руб",
        period: "в день",
      },
      en: { val: (baseUzS / 12600).toFixed(1), sym: "$", period: "per day" },
      hi: {
        val: Math.round(baseUzS / 150).toLocaleString(),
        sym: "₹",
        period: "प्रति दिन",
      },
      ur: {
        val: Math.round(baseUzS / 45).toLocaleString(),
        sym: "₨",
        period: "فی دن",
      },
      ar: { val: (baseUzS / 3400).toFixed(1), sym: "ر.с", period: "في اليوم" },
    };

    const current = rates[lang] || rates["en"];
    return `${current.val} ${current.sym} / ${current.period}`;
  };

  return (
    <div
      className="product-box"
      data-aos="fade-up"
      style={{ marginBottom: "80px" }}
    >
      <div className="thumbnails">
        {photos.map((thumb, idx) => (
          <div
            key={idx}
            className={`thumb-wrapper ${activePhoto === idx ? "active" : ""}`}
            onClick={() => setActivePhoto(idx)}
          >
            <img src={thumb} alt="thumb" className="thumbnail" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="main-photo">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePhoto}
            src={photos[activePhoto]}
            loading="lazy"
            alt={item.title}
            className="main-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>

      <div className="product-info">
        <h2 className="product-name">{item.title}</h2>
        <p className="description">
          {typeof item.description === "object"
            ? item.description[i18n.language] ||
              item.description["ru"] ||
              item.description["uz"]
            : item.description}
        </p>

        <div className="specs">
          <div className="spec-row">
            <Battery size={26} className="spec-icon" />
            <span>
              {t("battery")}: <b>{item.battery}%</b>
            </span>
          </div>
          <div className="spec-row">
            <Gauge size={26} className="spec-icon" />
            <span>
              {t("speed")}: <b>{item.speed} km/h</b>
            </span>
          </div>
          <div className="spec-row price-row">
            <div className="price-block">
              <span className="price">
                {getFormattedPrice(item.price, i18n.language)}
              </span>
              <span className="deposit">
                {t("deposit")}: {item.deposit}
              </span>
            </div>
          </div>
        </div>

        {item.features &&
          item.features.map((spec, i) => (
            <li key={i}>
              <FaCheckCircle className="spec-icon" />
              {/* ВМЕСТО {spec} ПИШЕМ: */}
              <span>{getLangText(spec)}</span>
            </li>
          ))}

        <a href="tel:+998990805999" className="rent-btn-link">
          <button className="rent-btn">{t("rentNow")}</button>
        </a>
      </div>
    </div>
  );
};

export default function Drongo() {
  const { t, i18n } = useTranslation();
  const [drongos, setDrongos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
    fetchDrongos();
  }, []);

  const fetchDrongos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "drongo")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrongos(data || []);
    } catch (err) {
      console.error("Fetch drongos error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="page-wrapper"
    >
      <header className="page-header" data-aos="fade-down">
        <Zap size={44} className="icon-accent" />
        <h1>{t("drongo")}</h1>
      </header>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "100px",
          }}
        >
          <Loader2 className="spinner" size={40} />
        </div>
      ) : (
        <div className="products-list">
          {drongos.length > 0 ? (
            drongos.map((item) => (
              <DrongoItem key={item.id} item={item} t={t} i18n={i18n} />
            ))
          ) : (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              {t("noProducts")}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
