// src/components/Card.jsx
import React from "react";
import { motion } from "framer-motion";
import "./UI/Card.css";

const Card = ({
  image,
  title,
  children,
  className = "",
  hoverLift = -10,
  ...props
}) => {
  return (
    <div
      className={`card ${className}`}
      whileHover={{
        y: hoverLift,
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.75), 0 0 60px rgba(201,168,76,0.06)",
      }}
      whileTap={{ scale: 0.985 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      data-aos="fade-up"
      data-aos-duration="900"
      data-aos-once="true"
      {...props}
    >
      {image && (
        <div className="card-image-wrapper">
          <img src={image} alt={title} loading="lazy" className="card-image" />
        </div>
      )}

      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {children && <div className="card-body">{children}</div>}
      </div>
    </div>
  );
};

export default Card;
