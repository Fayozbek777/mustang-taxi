// src/pages/Home.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, ExternalLink, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "./UI/Home.css";
import { BsTelegram } from "react-icons/bs";
import collageImg from "../assets/images/collages.png";

const MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.123456789!2d69.2586378!3d41.2870979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzEzLjUiTiA2OcKwMTUnMzEuMSJF!5e0!3m2!1sru!2suz!4v1698765432100!5m2!1sru!2suz";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=41.2870979,69.2586378";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.4, 0, 0.2, 1], delay },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const { t } = useTranslation();

  /* ── Welcome toast after 3 seconds ───────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.custom(
        (toastObj) => (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={
              toastObj.visible
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 12, scale: 0.95 }
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(10, 8, 4, 0.97)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              borderRadius: "14px",
              padding: "14px 18px",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08)",
              maxWidth: "320px",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
            }}
            onClick={() => toast.dismiss(toastObj.id)}
          >
            {/* Gold icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              🛵
            </div>

            {/* Text */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                }}
              >
                My Mustang
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.3,
                }}
              >
                {t("Арендуйте вместе с My Mustang 🚀") ||
                  "Арендуйте вместе с My Mustang 🚀"}
              </span>
            </div>
          </motion.div>
        ),
        {
          duration: 5000,
          position: "bottom-right",
        },
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [t]);

  const openMapInNewTab = () => {
    window.open(MAP_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ── Toaster container ────────────────────────────────── */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
        }}
      />

      <motion.div initial="hidden" animate="show" className="home-page">
        {/* Hero */}
        <section className="hero-section">
          <motion.div className="hero-content" variants={stagger}>
            <motion.h1 variants={fadeUp} custom={0}>
              {t("welcomeTo")} <span>My Mustang</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={0.1}>
              {t("rentScootersAndBagsInTashkent")}
            </motion.p>
          </motion.div>

          <div className="hero-scroll">
            <div className="hero-scroll-line" />
            <span>Scroll</span>
          </div>
        </section>

        <div className="diagonal-divider" />

        {/* About */}
        <section className="about-section">
          <div className="section-wrapper">
            <motion.div
              className="about-body"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="about-label">
                <Zap size={12} />
                {t("aboutUs")}
              </div>
              <h2 className="about-heading">
                {t("aboutHeading1") || "Твой"}{" "}
                <em>{t("aboutHeading2") || "Свободный"}</em>
                <br />
                {t("aboutHeading3") || "Транспорт"}
              </h2>
              <p>{t("aboutText1")}</p>
              <p>{t("aboutText2")}</p>

              <div className="about-stats">
                <div className="stat-item">
                  <strong>
                    500<span>+</span>
                  </strong>
                  <small>{t("happyClients")}</small>
                </div>
                <div className="stat-item">
                  <strong>
                    50<span>+</span>
                  </strong>
                  <small>{t("scooters")}</small>
                </div>
                <div className="stat-item">
                  <strong>
                    24<span>/7</span>
                  </strong>
                  <small>{t("support")}</small>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="about-card">
                <div className="about-card-inner">
                  <img src={collageImg} alt="Scooter Collage" />
                </div>
              </div>
              <div className="about-badge">
                <strong>#1</strong>
                <span>{t("inTashkent")}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact + Map */}
        <section className="contact-map-section">
          <motion.div
            className="contact-section-label"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
          >
            <div className="about-label" style={{ display: "inline-flex" }}>
              <MapPin size={12} />
              {t("contactUs")}
            </div>
            <h2>{t("Manzil")}</h2>
          </motion.div>

          <div className="contact-grid">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <div
                className="contact-item"
                onClick={() => (window.location.href = "tel:+998990805999")}
                style={{ cursor: "pointer" }}
              >
                <div className="contact-icon-wrap">
                  <Phone size={20} />
                </div>
                <div className="contact-item-body">
                  <strong>+998 99 080 59 99</strong>
                  <small>{t("callAnytime")}</small>
                </div>
              </div>

              <div
                className="contact-item"
                onClick={() =>
                  window.open("https://t.me/YandexMustang", "_blank")
                }
                style={{ cursor: "pointer" }}
              >
                <div className="contact-icon-wrap">
                  <BsTelegram size={20} />
                </div>
                <div className="contact-item-body">
                  <strong>@YandexMustang</strong>
                  <small>{t("writeUs")}</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrap">
                  <MapPin size={20} />
                </div>
                <div className="contact-item-body">
                  <strong>ул. Глинки 27</strong>
                  <small>Ташкент</small>
                </div>
              </div>

              <button className="btn-open-map" onClick={openMapInNewTab}>
                {t("openMapInNewWindow")}
                <ExternalLink size={17} />
              </button>
            </motion.div>

            <motion.div
              className="map-wrapper"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2 }}
            >
              <div className="map-header">
                <div className="map-header-dot" />
                <span>{t("ourLocation")}</span>
              </div>
              <iframe
                src={MAP_URL}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MyMustang location"
              />
            </motion.div>
          </div>
        </section>

        <div className="footer-strip">
          © {new Date().getFullYear()} My Mustang Tashkent — All rights reserved
        </div>
      </motion.div>
    </>
  );
}
