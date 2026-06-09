import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

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
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);

  const updateIndicator = (code) => {
    const btn = buttonRefs.current[code];
    const container = containerRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  };

  useLayoutEffect(() => {
    updateIndicator(currentLang);
  }, [currentLang]);

  useEffect(() => {
    setMounted(true);
    const observer = new ResizeObserver(() => updateIndicator(currentLang));
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mounted) updateIndicator(currentLang);
  }, [currentLang, mounted]);

  return (
    <nav
      ref={containerRef}
      className={`lang-switcher ${className}`}
      aria-label="Language switcher"
    >
      <span
        className="lang-indicator"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
          opacity: indicator.opacity,
        }}
        aria-hidden="true"
      />

      {languages.map(({ code, label, name }) => (
        <button
          key={code}
          ref={(el) => (buttonRefs.current[code] = el)}
          className={`lang-btn ${currentLang === code ? "active" : ""} ${
            hovered === code ? "hovered" : ""
          }`}
          onClick={() => i18n.changeLanguage(code)}
          onMouseEnter={() => setHovered(code)}
          onMouseLeave={() => setHovered(null)}
          aria-label={name}
          aria-pressed={currentLang === code}
        >
          <span className="lang-label">{label}</span>
          <span className="lang-tooltip" aria-hidden="true">
            {name}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default LanguageSwitcher;
