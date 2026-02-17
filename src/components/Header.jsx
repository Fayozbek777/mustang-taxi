import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";
import "./UI/Header.css";

const Header = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          My<span>Mustang</span>
        </Link>

        <nav className={`nav-menu ${isOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            {t("home")}
          </Link>
          <Link to="/scooters" onClick={() => setIsOpen(false)}>
            {t("scooters")}
          </Link>
          <Link to="/drongo" onClick={() => setIsOpen(false)}>
            {t("drongo")}
          </Link>
          <Link to="/velo" onClick={() => setIsOpen(false)}>
            {" "}
            {/* <-- Новая ссылка */}
            {t("bikes")}
          </Link>
          <Link to="/bags" onClick={() => setIsOpen(false)}>
            {t("bags")}
          </Link>

          <div className="lang-mobile">
            <LanguageSwitcher />
          </div>
        </nav>

        <div className="right-side">
          <LanguageSwitcher className="lang-desktop" />
          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
