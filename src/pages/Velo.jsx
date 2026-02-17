import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion"; // Добавляем motion
import { FaBiking, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import "./UI/Velo.css";

import velo1 from "../assets/images/velosiped-image1.png";
import velo2 from "../assets/images/velosiped-image2.png";
import velo3 from "../assets/images/velosiped-image3.png";
import velo4 from "../assets/images/velosidep-image4.png";

const Velo = () => {
  const { t } = useTranslation();

  const bikeModels = [
    {
      id: "speed",
      name: "Trinx M100",
      images: [velo1, velo2, velo3, velo4],
      price: "500,000",
      desc: t("veloSpeedDesc"),
      specs: ["21 Speed", "Aluminum Frame", "Mechanical Disc Brakes"],
    },
  ];

  const [activeModel, setActiveModel] = useState(bikeModels[0]);
  const [activeImg, setActiveImg] = useState(activeModel.images[0]);

  const handleModelChange = (model) => {
    setActiveModel(model);
    setActiveImg(model.images[0]);
  };

  return (
    <div className="page-wrapper">
      {/* Заголовок с AOS */}
      <div className="page-header" data-aos="fade-right">
        <FaBiking className="icon-accent" size={50} />
        <h1>{t("bikes")}</h1>
      </div>

      {/* Основной бокс с AOS */}
      <motion.div
        className="product-box"
        data-aos="zoom-in-up"
        layout // Framer motion автоматически подстроит размеры при смене контента
      >
        {/* Миниатюры с Framer Motion hover эффектом */}
        <div className="thumbnails">
          {activeModel.images.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`thumb-wrapper ${activeImg === img ? "active" : ""}`}
              onClick={() => setActiveImg(img)}
            >
              <img src={img} alt="thumb" className="thumbnail" />
            </motion.div>
          ))}
        </div>

        {/* Главное фото с анимацией смены изображения */}
        <div className="main-photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg} // Ключ заставляет motion видеть смену фото
              src={activeImg}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="main-image"
            />
          </AnimatePresence>
        </div>

        {/* Информация о продукте */}
        <div className="product-info">
          <motion.h2
            key={activeModel.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="product-name"
          >
            {activeModel.name}
          </motion.h2>

          <p className="description">{activeModel.desc}</p>

          <div className="specs">
            {activeModel.specs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="spec-row"
              >
                <FaCheckCircle className="spec-icon" />
                <span>{spec}</span>
              </motion.div>
            ))}
          </div>

          <div className="price-block">
            <div className="price">
              {activeModel.price} UZS / {t("monthly")}
            </div>
            <div className="deposit">
              <FaShieldAlt /> {t("depositVelo")}
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

      {/* Переключатель моделей */}
      <div className="model-switcher" data-aos="fade-up">
        {bikeModels.map((model) => (
          <motion.button
            key={model.id}
            whileHover={{ y: -5 }}
            className={`model-btn ${activeModel.id === model.id ? "active" : ""}`}
            onClick={() => handleModelChange(model)}
          >
            {model.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Velo;
