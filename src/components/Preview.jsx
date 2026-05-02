import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import "./UI/Preview.css";

const EXPO = [0.16, 1, 0.3, 1];

function Particle({ delay, x, duration }) {
  return (
    <motion.div
      className="particle"
      style={{ left: `${x}%`, bottom: `${10 + Math.random() * 30}%` }}
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ opacity: [0, 0.6, 0.6, 0], y: [0, -180], scale: [0, 1, 1.5] }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeIn",
      }}
    />
  );
}

function Counter({ from = 0, to = 100, duration = 1.6, delay = 1.2 }) {
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}%`);
  const [display, setDisplay] = useState(`${from}%`);

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    const ctrl = animate(mv, to, { duration, delay, ease: EXPO });
    return () => {
      ctrl.stop();
      unsub();
    };
  }, []);

  return <span>{display}</span>;
}

function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 16L16 6L26 16L16 26L6 16Z"
        stroke="#ffd000"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" fill="#ffd000" />
    </svg>
  );
}

export default function Preview({ onComplete }) {
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("exit");
      setTimeout(() => onComplete?.(), 900);
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 8 + Math.random() * 84,
    delay: 1.5 + Math.random() * 3,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <AnimatePresence>
      {phase === "in" && (
        <motion.div
          key="preview"
          className="preview-root"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.9, ease: EXPO },
          }}
        >
          <div className="preview-noise" />

          <motion.div
            className="preview-scan"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.8, delay: 0.4, ease: EXPO }}
          />

          <motion.div
            className="preview-glow"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease: EXPO }}
          />

          <div className="preview-particles">
            {particles.map((p) => (
              <Particle
                key={p.id}
                x={p.x}
                delay={p.delay}
                duration={p.duration}
              />
            ))}
          </div>

          <div className="preview-center">
            <motion.div
              className="preview-logo"
              initial={{ opacity: 0, y: 16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EXPO }}
            >
              <LogoIcon />
              <motion.div
                className="preview-logo-ring"
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.div
              className="preview-brand"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EXPO }}
            >
              My<span className="preview-brand-accent">Mustang</span>
            </motion.div>

            <motion.div
              className="preview-tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EXPO }}
            >
              Арендуй и Катай
            </motion.div>

            <motion.div
              className="preview-progress-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div className="preview-track">
                <motion.div
                  className="preview-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, delay: 1.2, ease: EXPO }}
                />
              </div>
              <div className="preview-pct">
                <Counter />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
