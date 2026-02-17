import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";
import "./UI/Header.css";

const navLinks = [
  { to: "/", key: "home" },
  { to: "/scooters", key: "scooters" },
  { to: "/drongo", key: "drongo" },
  { to: "/velo", key: "bikes" },
  { to: "/bags", key: "bags" },
];

/* ── Framer variants ──────────────────────────────────────── */
const drawerVariants = {
  hidden: {
    x: "100%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  visible: {
    x: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

const backdropVariants = {
  hidden: { opacity: 0, transition: { duration: 0.3 } },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const linkVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.12 + i * 0.07,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ── Magnetic hook ────────────────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  const onMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    },
    [x, y, strength],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return { ref, sx, sy, onMove, onLeave };
}

/* ── Custom cursor ────────────────────────────────────────── */
function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(useMotionValue(-100), {
    stiffness: 85,
    damping: 20,
    mass: 0.8,
  });
  const ringY = useSpring(useMotionValue(-100), {
    stiffness: 85,
    damping: 20,
    mass: 0.8,
  });
  const sc = useMotionValue(1);
  const op = useMotionValue(1);

  useEffect(() => {
    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest("a,button")) {
        sc.set(1.9);
        op.set(0.5);
      }
    };
    const out = () => {
      sc.set(1);
      op.set(1);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [dotX, dotY, ringX, ringY, sc, op]);

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          scale: sc,
          opacity: op,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════════════ */
const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burger = useMagnetic(0.38);

  /* AOS */
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Scrolled flag */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /*
   * Scroll lock — position:fixed trick
   * Prevents page from jumping when drawer opens.
   * Page content stays visually in place.
   */
  useEffect(() => {
    if (open) {
      const y = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%;`;
    } else {
      const y = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.cssText = "";
      window.scrollTo(0, y);
    }
    return () => {
      document.body.style.cssText = "";
    };
  }, [open]);

  return (
    <>
      <CustomCursor />

      {/* ══════════════════════════════════════════════════════
          HEADER BAR — contains only the sticky nav strip.
          The drawer lives OUTSIDE this element entirely.
          ══════════════════════════════════════════════════════ */}
      <motion.header
        className={`header${scrolled ? " header--scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-container">
          {/* Logo */}
          <Link
            to="/"
            className="logo"
            data-aos="fade-right"
            data-aos-delay="80"
          >
            My<em>Mustang</em>
          </Link>

          {/* Desktop nav */}
          <nav
            className="nav-desktop"
            data-aos="fade-down"
            data-aos-delay="130"
          >
            {navLinks.map(({ to, key }) => (
              <Link
                key={key}
                to={to}
                className={`nav-link${location.pathname === to ? " nav-link--active" : ""}`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div
            className="header-right"
            data-aos="fade-left"
            data-aos-delay="80"
          >
            <LanguageSwitcher className="lang-desktop" />

            <motion.button
              ref={burger.ref}
              className={`burger${open ? " burger--open" : ""}`}
              onMouseMove={burger.onMove}
              onMouseLeave={burger.onLeave}
              onClick={() => setOpen((v) => !v)}
              style={{ x: burger.sx, y: burger.sy }}
              aria-label="Toggle menu"
              aria-expanded={open}
              whileTap={{ scale: 0.88 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>
      {/* ══ END OF HEADER BAR ══ */}

      {/* ══════════════════════════════════════════════════════
          DRAWER + BACKDROP
          Rendered as siblings to <header>, NOT inside it.
          position:fixed → zero effect on page layout.
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="drawer-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              className="nav-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Ambient orb */}
              <div className="mobile-orb" aria-hidden="true" />

              {/* Close button */}
              <motion.button
                className="drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.2 }}
              >
                <X size={16} />
              </motion.button>

              {/* Nav links */}
              <div className="mobile-links">
                {navLinks.map(({ to, key }, i) => (
                  <motion.div
                    key={key}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link
                      to={to}
                      className={`mobile-link${location.pathname === to ? " mobile-link--active" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="mobile-link-num">0{i + 1}</span>
                      <span className="mobile-link-label">{t(key)}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Language switcher */}
              <motion.div
                className="mobile-lang"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.32 }}
              >
                <LanguageSwitcher />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
