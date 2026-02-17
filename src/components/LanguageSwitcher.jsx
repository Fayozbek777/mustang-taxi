import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import "./UI/LanguageSwitcher.css";

const languages = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "ur", label: "UR" },
  { code: "hi", label: "HI" },
];

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className={`lang-switcher ${className}`}>
      <Globe size={18} className="lang-icon" />
      {languages.map(({ code, label }) => (
        <button
          key={code}
          className={`lang-btn ${currentLang === code ? "active" : ""}`}
          onClick={() => i18n.changeLanguage(code)}
          title={code.toUpperCase()}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
