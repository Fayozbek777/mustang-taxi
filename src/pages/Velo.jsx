import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaBiking, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../services/supabaseClient";
import "./UI/Velo.css";

// Под-компонент для одного велосипеда
const BikeItem = ({ bike, t, i18n }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const photos =
    bike.images?.length > 0 ? bike.images : ["https://via.placeholder.com/600"];

  const currentLang = i18n.language || "uz";

  // Универсальная функция для получения текста на нужном языке
  const getLangText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    // Приоритет: Текущий язык -> RU -> UZ -> EN
    return obj[currentLang] || obj["ru"] || obj["uz"] || obj["en"] || "";
  };

  const getVeloPrice = (priceRaw, lang, periodFromDb) => {
    const baseUzS = parseInt(priceRaw?.toString().replace(/\D/g, "")) || 0;

    // Перевод периода
    const periods = {
      uz: { kun: "kuniga", oy: "oyiga", yil: "yiliga" },
      ru: { kun: "в день", oy: "в месяц", yil: "в год" },
      en: { kun: "per day", oy: "per month", yil: "per year" },
      hi: { kun: "प्रति दिन", oy: "प्रति माह", yil: "प्रति वर्ष" },
      ur: { kun: "فی دن", oy: "فی مہینہ", yil: "فی سال" },
      ar: { kun: "في اليوم", oy: "في الشهر", yil: "في السنة" },
    };

    const p = periods[lang]?.[periodFromDb || "kun"] || periods["en"]["kun"];

    const rates = {
      uz: { val: baseUzS.toLocaleString(), sym: "so'm" },
      ru: { val: Math.round(baseUzS / 135).toLocaleString(), sym: "руб" },
      en: { val: (baseUzS / 12600).toFixed(0), sym: "$" },
      hi: { val: Math.round(baseUzS / 150).toLocaleString(), sym: "₹" },
      ur: { val: Math.round(baseUzS / 45).toLocaleString(), sym: "₨" },
      ar: { val: (baseUzS / 3400).toFixed(0), sym: "ر.س" },
    };

    const current = rates[lang] || rates["en"];
    return `${current.val} ${current.sym} / ${p}`;
  };

  // В самом JSX вызови её так:
  <div className="price">
    {getVeloPrice(bike.price, i18n.language, bike.price_period)}
  </div>;

  return (
    <motion.div
      className="product-box"
      data-aos="zoom-in-up"
      layout
      style={{ marginBottom: "60px" }}
    >
      <div className="thumbnails">
        {photos.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`thumb-wrapper ${activeImgIdx === idx ? "active" : ""}`}
            onClick={() => setActiveImgIdx(idx)}
          >
            <img
              src={img}
              alt={`Velo ${idx + 1}`}
              className="thumbnail"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <div className="main-photo">
        <AnimatePresence mode="wait">
          <motion.img
            key={photos[activeImgIdx]}
            src={photos[activeImgIdx]}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            loading="lazy"
            transition={{ duration: 0.4 }}
            className="main-image"
            alt={bike.title}
          />
        </AnimatePresence>
      </div>

      <div className="product-info">
        <motion.h2 className="product-name">{bike.title}</motion.h2>

        {/* ОПИСАНИЕ (ОБЪЕКТ) */}
        <p className="description">{getLangText(bike.description)}</p>

        {/* ХАРАКТЕРИСТИКИ (МАССИВ ОБЪЕКТОВ) */}
        {bike.features && Array.isArray(bike.features) && (
          <div className="specs">
            {bike.features.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="spec-row"
              >
                <FaCheckCircle className="spec-icon" />
                <span>{getLangText(spec)}</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="price-block">
          <div className="price">{getVeloPrice(bike.price, i18n.language)}</div>
          <div className="deposit">
            <FaShieldAlt /> {t("deposit")}: {bike.deposit}
          </div>
        </div>

        <a href="tel:+998990805999" style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rent-btn"
          >
            {t("rentNow")}
          </motion.button>
        </a>
      </div>
    </motion.div>
  );
};

const Velo = () => {
  const { t, i18n } = useTranslation();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "velo")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBikes(data || []);
    } catch (err) {
      console.error("Fetch bikes error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header" data-aos="fade-right">
        <FaBiking className="icon-accent" size={50} />
        <h1>{t("bikes")}</h1>
      </div>

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
          {bikes.length > 0 ? (
            bikes.map((bike) => (
              <BikeItem key={bike.id} bike={bike} t={t} i18n={i18n} />
            ))
          ) : (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              {t("noProducts")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Velo;
