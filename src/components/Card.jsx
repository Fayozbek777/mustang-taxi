import React from "react";
import { motion } from "framer-motion";
import "./UI/Card.css";

const Card = ({
  image,
  title,
  children,
  className = "",
  hoverLift = -12,
  ...props
}) => {
  return (
    <motion.div
      className={`modern-card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: hoverLift }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      {...props}
    >
      {image && (
        <div className="card-media">
          <img src={image} alt={title} loading="lazy" className="card-img" />
          <div className="card-overlay" />
        </div>
      )}

      <div className="card-info">
        {title && (
          <div className="card-header-box">
            <h3 className="card-title-text">{title}</h3>
            <div className="card-title-line" />
          </div>
        )}
        {children && <div className="card-description">{children}</div>}
      </div>

      <div className="card-corner-glow" />
    </motion.div>
  );
};

export default Card;
