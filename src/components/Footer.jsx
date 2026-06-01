import React from "react";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaPhoneAlt } from "react-icons/fa";
import "./UI/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top-accent" />

      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-plain">My</span>
            <span className="footer__logo-accent">Mustang</span>
          </div>
          <p className="footer__tagline">
            {t("Аренда скутеров и аксессуаров в Ташкенте") ||
              "Аренда скутеров и аксессуаров в Ташкенте"}
          </p>
          <div className="footer__divider-short" />
        </div>

        <div className="footer__section">
          <h4 className="footer__section-title">Контакты</h4>
          <div className="footer__links">
            <a href="tel:+998990805999" className="footer__link">
              <span className="footer__link-icon">
                <FaPhoneAlt size={13} />
              </span>
              +998 99 080 59 99
            </a>
            <a
              href="https://t.me/YandexMustang"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              <span className="footer__link-icon">
                <FaTelegramPlane size={14} />
              </span>
              Telegram
            </a>
          </div>
        </div>

        {/* Decorative */}
        <div className="footer__decor-col">
          <span className="footer__ornament">✦</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <div className="footer__bottom-divider" />
        <div className="footer__bottom-content">
          <p className="footer__copy">
            © {currentYear} MyMustang.{" "}
            <span className="footer__copy-light">
              {t("allRightsReserved") || "Все права защищены"}
            </span>
          </p>
          <p className="footer__city">Tashkent, Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
