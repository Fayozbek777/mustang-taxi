// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import {
  User,
  Phone,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MapPin, ExternalLink, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { BsTelegram } from "react-icons/bs";
import collageImg from "../assets/images/collages.png";
import "./UI/Home.css";

const COUNTRIES = [
  {
    flag: "🇺🇿",
    code: "+998",
    label: "UZ",
    mask: "+998 ## ### ## ##",
    digits: 9,
  },
  {
    flag: "🇷🇺",
    code: "+7",
    label: "RU",
    mask: "+7 ### ###-##-##",
    digits: 10,
  },
  {
    flag: "🇬🇧",
    code: "+44",
    label: "EN",
    mask: "+44 #### ######",
    digits: 10,
  },
  {
    flag: "🇵🇰",
    code: "+92",
    label: "PK",
    mask: "+92 ### #######",
    digits: 10,
  },
  {
    flag: "🇮🇳",
    code: "+91",
    label: "IN",
    mask: "+91 ##### #####",
    digits: 10,
  },
];
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
function applyMask(digits, mask) {
  let di = 0;
  return mask.replace(/#/g, () => digits[di++] ?? "").trimEnd();
}

function formatPhoneByCountry(raw, country) {
  const prefix = country.code.replace(/\D/g, "");
  const allDigits = raw.replace(/\D/g, "");
  // убираем код страны в начале если есть
  const local = allDigits.startsWith(prefix)
    ? allDigits.slice(prefix.length)
    : allDigits;
  const sliced = local.slice(0, country.digits);
  return applyMask(sliced, country.mask);
}

function isPhoneComplete(phone, country) {
  return (
    phone.replace(/\D/g, "").length ===
    country.code.replace(/\D/g, "").length + country.digits
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(COUNTRIES[0].code + " ");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_CHAT_ID;

  const handleCountrySelect = (c) => {
    setCountry(c);
    setPhone(c.code + " ");
    setShowPicker(false);
  };

  const handlePhone = (e) => {
    const raw = e.target.value;
    // не даём удалить код страны
    if (!raw.startsWith(country.code)) {
      setPhone(country.code + " ");
      return;
    }
    setPhone(formatPhoneByCountry(raw, country));
  };

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

  const sendToTelegram = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!firstName.trim()) {
      setFormError("Введите имя");
      return;
    }
    if (!isPhoneComplete(phone, country)) {
      setFormError(`Введите полный номер (${country.mask})`);
      return;
    }

    setLoading(true);

    const text = `<b>🛵 Новая заявка — My Mustang</b>

👤 Имя: ${firstName}${lastName ? " " + lastName : ""}
📞 Телефон: ${phone} ${country.flag}
💬 Сообщение: ${message || "—"}`;

    try {
      // На Vercel (prod) → /api/telegram
      // Локально → напрямую в Telegram
      const isProd = import.meta.env.PROD;

      const res = isProd
        ? await fetch("/api/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          })
        : await fetch(
            `https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: import.meta.env.VITE_CHAT_ID,
                text,
                parse_mode: "HTML",
              }),
            },
          );

      const data = await res.json();

      if ((res.ok && data.ok) || (res.ok && isProd)) {
        setSent(true);
        setFirstName("");
        setLastName("");
        setPhone(country.code + " ");
        setMessage("");
      } else {
        setFormError(
          "Ошибка: " + (data.error || data.description || "неизвестно"),
        );
      }
    } catch {
      setFormError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        <section
          className="form-section"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-once="true"
        >
          <motion.div
            className="form-wrapper"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="form-left"
              data-aos="fade-right"
              data-aos-delay="100"
              data-aos-once="true"
            >
              <p className="form-eyebrow">Admin bilam bog'laning</p>
              <h2 className="form-heading">
                Zayavka
                <br />
                <em>qoldiring</em>
              </h2>
              <p className="form-desc">Tez orada Bog'lanamiz</p>
              <div className="form-contacts">
                <a href="tel:+998990805999" className="form-contact-link">
                  <Phone size={16} /> +998 99 080 59 99
                </a>
                <a
                  href="https://t.me/YandexMustang"
                  target="_blank"
                  rel="noreferrer"
                  className="form-contact-link"
                >
                  <BsTelegram size={16} /> @YandexMustang
                </a>
              </div>
            </div>

            {/* ── Right: form card ── */}
            <motion.div
              className="form-right"
              data-aos="fade-left"
              data-aos-delay="150"
              data-aos-once="true"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    className="form-success"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                    >
                      <CheckCircle2 size={52} strokeWidth={1.4} />
                    </motion.div>
                    <h3>Zayavka Jo'natildi</h3>
                    <p>Admin Tez orada Siz bilan bog'lanadi</p>
                    <button className="form-btn" onClick={() => setSent(false)}>
                      Yana bir bor Jonatish
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    className="form-body"
                    onSubmit={sendToTelegram}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Row: first + last */}
                    <div className="form-row">
                      <motion.div
                        className="form-field"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                      >
                        <label className="form-label">
                          Ismingiz <span>*</span>
                        </label>
                        <div className="form-input-wrap">
                          <User size={15} className="form-input-icon" />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Bobur"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        className="form-field"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.18 }}
                      >
                        <label className="form-label">Familiya</label>
                        <div className="form-input-wrap">
                          <User size={15} className="form-input-icon" />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Baxodirovich"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                          />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      className="form-field"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.25 }}
                    >
                      <label className="form-label">
                        Telefon Raqamingiz <span>*</span>
                      </label>
                      <div className="form-phone-row">
                        {/* Country selector */}
                        <div className="form-country-wrap">
                          <button
                            type="button"
                            className="form-country-btn"
                            onClick={() => setShowPicker((v) => !v)}
                            aria-label="Выбрать страну"
                          >
                            <span>{country.flag}</span>
                            <span className="form-country-label">
                              {country.label}
                            </span>
                            <motion.span
                              animate={{ rotate: showPicker ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ display: "flex", lineHeight: 1 }}
                            >
                              ▾
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {showPicker && (
                              <motion.ul
                                className="form-country-dropdown"
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                transition={{
                                  duration: 0.2,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                {COUNTRIES.map((c) => (
                                  <li key={c.code}>
                                    <button
                                      type="button"
                                      className={`form-country-option${c.code === country.code ? " form-country-option--active" : ""}`}
                                      onClick={() => handleCountrySelect(c)}
                                    >
                                      <span>{c.flag}</span>
                                      <span>{c.label}</span>
                                      <span className="form-country-code">
                                        {c.code}
                                      </span>
                                    </button>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Phone input */}
                        <div className="form-input-wrap" style={{ flex: 1 }}>
                          <Phone size={15} className="form-input-icon" />
                          <input
                            type="tel"
                            className="form-input"
                            value={phone}
                            onChange={handlePhone}
                            placeholder={country.mask}
                            inputMode="numeric"
                          />
                          <AnimatePresence>
                            {isPhoneComplete(phone, country) && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                style={{
                                  position: "absolute",
                                  right: 12,
                                  display: "flex",
                                }}
                              >
                                <CheckCircle2
                                  size={16}
                                  className="form-input-check"
                                />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <span className="form-hint">Маска: {country.mask}</span>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      className="form-field"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.32 }}
                    >
                      <label className="form-label">Savol</label>
                      <div className="form-input-wrap form-input-wrap--ta">
                        <MessageSquare
                          size={15}
                          className="form-input-icon form-input-icon--ta"
                        />
                        <textarea
                          className="form-input form-textarea"
                          placeholder="Savolingiz Bormi?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                      {formError && (
                        <motion.div
                          className="form-error"
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <AlertCircle size={15} /> {formError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      className="form-btn"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      {loading ? (
                        <span className="form-btn-spinner" />
                      ) : (
                        <>
                          <Send size={16} /> Zayavka Jonatish
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        <div className="footer-strip">
          © {new Date().getFullYear()} My Mustang Tashkent — All rights reserved
        </div>
      </motion.div>
    </>
  );
}
