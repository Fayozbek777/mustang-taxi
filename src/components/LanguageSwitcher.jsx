import React from "react";
import { useTranslation } from "react-i18next";
import "./UI/LanguageSwitcher.css";

const languages = [
  { code: "uz", label: "UZ", name: "O'zbek" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "en", label: "EN", name: "English" },
  { code: "ur", label: "UR", name: "اردو" },
  { code: "hi", label: "HI", name: "हिन्दी" },
];

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <nav
      className={`lang-switcher ${className}`}
      aria-label="Language switcher"
    >
      {languages.map(({ code, label, name }, index) => (
        <React.Fragment key={code}>
          {index > 0 && <div className="lang-divider" aria-hidden="true" />}
          <button
            className={`lang-btn ${currentLang === code ? "active" : ""}`}
            onClick={() => i18n.changeLanguage(code)}
            aria-label={name}
            aria-pressed={currentLang === code}
          >
            {label}
            <span className="lang-tooltip" aria-hidden="true">
              {name}
            </span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default LanguageSwitcher;
