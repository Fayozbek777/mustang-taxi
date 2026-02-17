import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Battery, Gauge, DollarSign, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

// Исправленные импорты картинок (в соответствии с твоей структурой папок)
import d1 from "../assets/images/drango-image1.png";
import d2 from "../assets/images/drango-image2.png";
import d3 from "../assets/images/drango-image3.png";

// Исправленный путь к стилям
import "./UI/Drongo.css";

export default function Drongo() {
  const { t } = useTranslation();
  const [activeModel, setActiveModel] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  // ДАННЫЕ ВНУТРИ КОМПОНЕНТА — это ключ к смене языка
  const drongoData = [
    {
      thumbnails: [d1, d2, d3],
      title: "Drongo Model A",
      price: `70 000 ${t("monthly").replace("oyiga", "so'm")} / ${t("daily")}`,
      deposit: t("depositScooter"),
      battery: "100%",
      speed: "70 km/h",
      descriptionKey: "drongoModelADesc",
      features: [
        t("helmetIncluded"),
        t("phoneHolder"),
        t("freeService"),
        t("chargerIncluded"),
      ],
    },
    {
      thumbnails: [d2, d1, d3],
      title: "Drongo Model B Pro",
      price: `90 000 ${t("monthly").replace("oyiga", "so'm")} / ${t("daily")}`,
      deposit: t("depositScooter"),
      battery: "100%",
      speed: "50 km/h",
      descriptionKey: "drongoModelBProDesc",
      features: [
        t("helmetIncluded"),
        t("phoneHolder"),
        t("freeService"),
        t("chargerIncluded"),
      ],
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
  }, []);

  const currentModel = drongoData[activeModel];
  const currentMainImg = currentModel.thumbnails[activePhoto];

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

      <div className="product-box" data-aos="fade-up" data-aos-delay="100">
        {/* Миниатюры */}
        <div className="thumbnails">
          {currentModel.thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className={`thumb-wrapper ${activePhoto === idx ? "active" : ""}`}
              onClick={() => setActivePhoto(idx)}
            >
              <img src={thumb} alt="thumb" className="thumbnail" />
            </div>
          ))}
        </div>

        {/* Большое фото */}
        <div className="main-photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto}
              src={currentMainImg}
              alt={currentModel.title}
              className="main-image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </div>

        {/* Инфо */}
        <div className="product-info">
          <h2 className="product-name">{currentModel.title}</h2>
          <p className="description">{t(currentModel.descriptionKey)}</p>

          <div className="specs">
            <div className="spec-row">
              <Battery size={26} className="spec-icon" />
              <span>
                {t("battery")}: <b>{currentModel.battery}</b>
              </span>
            </div>
            <div className="spec-row">
              <Gauge size={26} className="spec-icon" />
              <span>
                {t("speed")}: <b>{currentModel.speed}</b>
              </span>
            </div>
            <div className="spec-row price-row">
              <DollarSign size={28} className="spec-icon price-icon" />
              <div className="price-block">
                <span className="price">{currentModel.price}</span>
                <span className="deposit">{currentModel.deposit}</span>
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
      <div className="model-switcher" data-aos="fade-up">
        {drongoData.map((model, idx) => (
          <button
            key={idx}
            className={`model-btn ${activeModel === idx ? "active" : ""}`}
            onClick={() => {
              setActiveModel(idx);
              setActivePhoto(0);
            }}
          >
            {model.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
