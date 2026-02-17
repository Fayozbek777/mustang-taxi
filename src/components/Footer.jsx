import React from "react";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaInstagram, FaPhoneAlt } from "react-icons/fa"; // все из Font Awesome
import "./UI/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>MyScooter</h3>
          <p>
            {t("footerSlogan") || "Аренда скутеров и аксессуаров в Ташкенте"}
          </p>
        </div>

        <div className="footer-links">
          <a href="tel:+998991234567">
            <FaPhoneAlt size={20} /> +998 99 080 59 99
          </a>

          <a
            href="https://t.me/@YandexMustang"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane size={20} /> Telegram
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} MyScooter. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
