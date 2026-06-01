import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Battery, Gauge, Zap, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../services/supabaseClient";

import "./UI/Scooters.css";
import { FaCheckCircle } from "react-icons/fa";

const ScooterItem = ({ scooter, t, i18n }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const currentLang = i18n.language || "uz";

  // Функция для получения мультиязычного текста
  const getLangText = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data[currentLang] || data["ru"] || data["uz"] || "";
  };

  // Функция расчета и отображения цены (решаем ошибку ReferenceError)
  const getVeloPrice = (priceRaw, lang, periodKey) => {
    const baseUzS = parseInt(priceRaw?.toString().replace(/\D/g, "")) || 0;

    const periods = {
      uz: { kun: "kuniga", oy: "oyiga", yil: "yiliga" },
      ru: { kun: "в день", oy: "в месяц", yil: "в год" },
      en: { kun: "per day", oy: "per month", yil: "per year" },
      hi: { kun: "प्रति दिन", oy: "प्रति माह", yil: "प्रति वर्ष" },
      ur: { kun: "فی دن", oy: "فی مہینہ", yil: "فی سال" },
    };

    const rates = {
      uz: { val: baseUzS.toLocaleString(), sym: "so'm" },
      ru: { val: Math.round(baseUzS / 135).toLocaleString(), sym: "руб" },
      en: { val: (baseUzS / 12600).toFixed(0), sym: "$" },
      hi: { val: Math.round(baseUzS / 150).toLocaleString(), sym: "₹" },
      ur: { val: Math.round(baseUzS / 45).toLocaleString(), sym: "₨" },
    };

    const p = periods[lang]?.[periodKey || "kun"] || periods["en"]["kun"];
    const current = rates[lang] || rates["en"];
    return `${current.val} ${current.sym} / ${p}`;
  };

  const photos =
    scooter.images && scooter.images.length > 0
      ? scooter.images
      : ["https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div
      className="product-box"
      data-aos="fade-up"
      style={{ marginBottom: "50px" }}
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
            key={photos[activePhoto]}
            src={photos[activePhoto]}
            alt={scooter.title}
            className="main-image"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </AnimatePresence>
      </div>

      <div className="product-info">
        <h2 className="product-name">{scooter.title}</h2>
        <p className="description">{getLangText(scooter.description)}</p>

        <div className="specs">
          {scooter.battery && (
            <div className="spec-row">
              <Battery size={26} className="spec-icon" />
              <span>
                {t("battery")}: <b>{scooter.battery}</b>
              </span>
            </div>
          )}

          {scooter.speed && (
            <div className="spec-row">
              <Gauge size={26} className="spec-icon" />
              <span>
                {t("speed")}: <b>{scooter.speed} km/h</b>
              </span>
            </div>
          )}

          <div className="spec-row price-row-display">
            <div className="price-block">
              <span className="price">
                {getVeloPrice(scooter.price, currentLang, scooter.price_period)}
              </span>
              {scooter.deposit && (
                <span
                  className="deposit"
                  style={{
                    display: "block",
                    color: "#d97706",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  🛡️ {t("deposit")}: {scooter.deposit}
                </span>
              )}
            </div>
          </div>
        </div>

        {scooter.features &&
          scooter.features.map((spec, i) => (
            <div key={i} className="spec-row feature-item">
              <FaCheckCircle
                style={{ color: "#22c55e", marginRight: "10px" }}
              />
              <span>{getLangText(spec)}</span>
            </div>
          ))}

        <a href="tel:+998990805999" className="rent-btn-link">
          <button className="rent-btn" style={{ marginTop: "20px" }}>
            {t("rentNow")}
          </button>
        </a>
      </div>
    </div>
  );
};

export default function Scooters() {
  const { t, i18n } = useTranslation();
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "scooters")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScooters(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-wrapper"
    >
      <header className="page-header" data-aos="fade-down">
        <Zap size={44} className="icon-accent" />
        <h1>{t("scooters")}</h1>
      </header>

      {loading ? (
        <div
          className="loader-box"
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
          {scooters.length > 0 ? (
            scooters.map((scooter) => (
              <ScooterItem
                key={scooter.id}
                scooter={scooter}
                t={t}
                i18n={i18n} // Передаем i18n
              />
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>
              {t("noProducts")}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
