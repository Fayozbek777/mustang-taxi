import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { ShoppingBag, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

// Импорт картинок (согласно твоей структуре папок)
import b1 from "../assets/images/bags-image1.png";
import b2 from "../assets/images/bags-image2.png";
import b3 from "../assets/images/bags-image3.png";
import b4 from "../assets/images/bags-image4.png";

// Исправленный путь к стилям (из src/pages/Bags.jsx в src/pages/UI/Bags.css)
import "./UI/Bags.css";

export default function Bags() {
  const { t } = useTranslation();
  const [activeModel, setActiveModel] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  // ДАННЫЕ ВНУТРИ — ТЕПЕРЬ ОНИ ПЕРЕВОДЯТСЯ
  const bagsData = [
    {
      thumbnails: [b1, b2, b3],
      title: "Urban Backpack Waterproof 25L",
      yearlyPrice: `200 000 ${t("home").replace("Bosh sahifa", "so'm").replace("Главная", "сум").replace("Home", "sum")} / ${t("home").includes("sahifa") ? "yil" : t("home") === "Home" ? "year" : "год"}`,
      depositNote: t("home").includes("sahifa")
        ? "Garov 200 000 so'm (qaytarilmaydi)"
        : t("home") === "Home"
          ? "Deposit 200 000 sum (non-refundable)"
          : "Залог 200 000 сум при годовой аренде — не возвращается",
      descriptionKey: "bagUrbanDesc",
      features: [
        t("features"), // Используем общий ключ характеристик
        "25 L",
        "Waterproof",
      ],
    },
    {
      thumbnails: [b4, b2, b1],
      title: "Premium Courier Bag",
      yearlyPrice: t("price"),
      depositNote: "",
      descriptionKey: "bagPremiumDesc",
      features: [t("features"), "Premium Quality", "Multi-functional"],
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
  }, []);

  const currentModel = bagsData[activeModel];
  const currentMainImg = currentModel.thumbnails[activePhoto];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="page-wrapper"
    >
      <header className="page-header" data-aos="fade-down">
        <ShoppingBag size={44} className="icon-accent" />
        <h1>{t("bags")}</h1>
      </header>

      <div className="product-box" data-aos="fade-up" data-aos-delay="100">
        {/* Миниатюры */}
        <div className="thumbnails">
          {currentModel.thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className={`thumb-wrapper ${activePhoto === idx ? "active" : ""}`}
              onClick={() => setActivePhoto(idx)}
            >
              <img src={thumb} alt="variant" className="thumbnail" />
            </div>
          ))}
        </div>

        {/* Большое фото */}
        <div className="main-photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${activeModel}-${activePhoto}`}
              src={currentMainImg}
              alt={currentModel.title}
              className="main-image"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>

        {/* Инфо */}
        <div className="product-info">
          <h2 className="product-name">{currentModel.title}</h2>
          <p className="description">{t(currentModel.descriptionKey)}</p>

          <div className="specs">
            <div className="spec-row price-row">
              <DollarSign size={28} className="spec-icon price-icon" />
              <div className="price-block">
                <span className="price">{currentModel.yearlyPrice}</span>
                <p
                  className="deposit-note"
                  style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "5px" }}
                >
                  {currentModel.depositNote}
                </p>
              </div>
            </div>
          </div>

          <ul className="features">
            {currentModel.features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>

          <a href="tel:+998990805999" className="rent-btn-link">
            <button className="rent-btn">{t("rentNow")}</button>
          </a>
        </div>
      </div>

      {/* Переключатель моделей */}
      {bagsData.length > 1 && (
        <div className="model-switcher" data-aos="fade-up">
          {bagsData.map((bag, idx) => (
            <button
              key={idx}
              className={`model-btn ${activeModel === idx ? "active" : ""}`}
              onClick={() => {
                setActiveModel(idx);
                setActivePhoto(0);
              }}
            >
              {bag.title}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
