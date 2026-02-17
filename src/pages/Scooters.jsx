import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Battery, Gauge, DollarSign, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import sk1 from "../assets/images/skooter-image1.png";
import sk2 from "../assets/images/skooter-image2.png";
import sk3 from "../assets/images/skooter-image3.png";

import "./UI/Scooters.css";

export default function Scooters() {
  const { t } = useTranslation();
  const [activeModel, setActiveModel] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
  }, []);

  // МАССИВ ТЕПЕРЬ ТУТ (ВНУТРИ), ЧТОБЫ t() РАБОТАЛА
  const scootersData = [
    {
      thumbnails: [sk1, sk2, sk3],
      title: "Skooter H8",
      priceKey: "fromPriceDay", // передаем ключ
      depositKey: "depositScooter", // передаем ключ
      battery: "85–90%",
      speed: "25", // только цифра
      descriptionKey: "scooterXiaomiDesc",
      featuresKeys: [
        // массив ключей
        "helmetIncluded",
        "chargerIncluded",
        "phoneHolder",
        "freeService",
      ],
    },
  ];

  const currentModel = scootersData[activeModel];
  const currentMainImg = currentModel.thumbnails[activePhoto];

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

      <div className="product-box" data-aos="fade-up">
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

        {/* Главное фото */}
        <div className="main-photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto}
              src={currentMainImg}
              alt={currentModel.title}
              className="main-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </AnimatePresence>
        </div>

        {/* Инфо (ОБРАТИ ВНИМАНИЕ НА t() НИЖЕ) */}
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
                {t("speed")}: <b>{currentModel.speed} km/h</b>
              </span>
            </div>
            <div className="spec-row price-row">
              <DollarSign size={28} className="spec-icon price-icon" />
              <div className="price-block">
                <span className="price">{t(currentModel.priceKey)}</span>
                <span className="deposit">{t(currentModel.depositKey)}</span>
              </div>
            </div>
          </div>

          <ul className="features">
            {currentModel.featuresKeys.map((key, i) => (
              <li key={i}>{t(key)}</li>
            ))}
          </ul>
          <a href="tel:+998990805999" className="rent-btn-link">
            <button className="rent-btn">{t("rentNow")}</button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
