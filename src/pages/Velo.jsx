import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
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
      monthlyPrice: t("velo_monthly_price"),
      monthlyEquiv: t("velo_monthly_equiv") || "",
      deposit: t("velo_deposit"),
      desc: t("veloSpeedDesc"),
      specs: [t("spec_21speed"), t("spec_aluminum"), t("spec_discbrakes")],
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
      <div className="page-header" data-aos="fade-right">
        <FaBiking className="icon-accent" size={50} />
        <h1>{t("bikes")}</h1>
      </div>

      <motion.div className="product-box" data-aos="zoom-in-up" layout>
        {/* Галерея миниатюр */}
        <div className="thumbnails">
          {activeModel.images.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`thumb-wrapper ${activeImg === img ? "active" : ""}`}
              onClick={() => setActiveImg(img)}
            >
              <img
                src={img}
                alt={`Велосипед Trinx M100 фото ${idx + 1}`}
                className="thumbnail"
              />
            </motion.div>
          ))}
        </div>

        {/* Главное фото с анимацией смены */}
        <div className="main-photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={activeImg}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="main-image"
              alt="Trinx M100 — основной вид"
            />
          </AnimatePresence>
        </div>

        {/* Информация о товаре */}
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
            <div className="price">{activeModel.monthlyPrice}</div>
            {activeModel.monthlyEquiv && (
              <div className="price-equiv small-text">
                {activeModel.monthlyEquiv}
              </div>
            )}
            <div className="deposit">
              <FaShieldAlt /> {activeModel.deposit}
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

      {/* Переключатель моделей (пока одна, но оставляем на будущее) */}
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
