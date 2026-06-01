import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../services/supabaseClient";

import "./UI/Bags.css";

const textVariant = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

// Компонент одной сумки
const BagItem = ({ bag, t, i18n }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const currentLang = i18n.language || "uz";

  const photos =
    bag.images?.length > 0 ? bag.images : ["https://via.placeholder.com/600"];

  // Функция для получения текста на нужном языке (защита от объектов)
  const getLangText = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data[currentLang] || data["ru"] || data["uz"] || "";
  };

  // Функция для красивого вывода цены с учетом валюты и периода
  const getFormattedPrice = (priceRaw, lang, periodKey) => {
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

  return (
    <div
      className="product-box"
      data-aos="fade-up"
      style={{ marginBottom: "80px" }}
    >
      <div className="thumbnails">
        {photos.map((thumb, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`thumb-wrapper ${activePhoto === idx ? "active" : ""}`}
            onClick={() => setActivePhoto(idx)}
          >
            <img
              src={thumb}
              alt="variant"
              className="thumbnail"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <div className="main-photo">
        <AnimatePresence mode="wait">
          <motion.img
            key={photos[activePhoto]}
            src={photos[activePhoto]}
            alt={bag.title}
            className="main-image"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="product-info">
        <motion.h2
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariant}
          className="product-name"
        >
          {bag.title}
        </motion.h2>

        {/* ИСПРАВЛЕННОЕ ОПИСАНИЕ */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariant}
          className="description"
        >
          {getLangText(bag.description)}
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariant}
          className="price-row"
        >
          <div className="price-block">
            <span className="price">
              {getFormattedPrice(bag.price, currentLang, bag.price_period)}
            </span>
            <p className="deposit-note">
              {t("deposit")}: {bag.deposit || "—"}
            </p>
          </div>
        </motion.div>

        {/* ИСПРАВЛЕННЫЕ ХАРАКТЕРИСТИКИ */}
        {bag.features && Array.isArray(bag.features) && (
          <ul className="features">
            {bag.features.map((feat, i) => (
              <motion.li
                key={i}
                custom={3 + i}
                initial="hidden"
                animate="visible"
                variants={textVariant}
              >
                <ChevronRight size={18} className="feat-icon" />
                <span>{getLangText(feat)}</span>
              </motion.li>
            ))}
          </ul>
        )}

        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={textVariant}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginTop: "20px" }}
        >
          <a href="tel:+998990805999" className="rent-btn-link">
            <button className="rent-btn">
              {t("rentNow")}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ marginLeft: "8px" }}
              >
                →
              </motion.span>
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default function Bags() {
  const { t, i18n } = useTranslation();
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    });
    fetchBags();
  }, []);

  const fetchBags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "bags")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBags(data || []);
    } catch (err) {
      console.error("Fetch bags error:", err);
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
      <header className="page-header" data-aos="zoom-out-up">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <ShoppingBag size={48} className="icon-accent" />
        </motion.div>
        <h1>{t("bags")}</h1>
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
          {bags.length > 0 ? (
            bags.map((bag) => (
              <BagItem key={bag.id} bag={bag} t={t} i18n={i18n} />
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
