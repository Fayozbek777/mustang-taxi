// src/components/Card.jsx
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
      className={`card ${className}`}
      whileHover={{
        y: hoverLift,
        scale: 1.03,
        boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-once="true"
      {...props}
    >
      <div className="card-image-wrapper">
        <img src={image} alt={title} loading="lazy" className="card-image" />
      </div>

      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {children && <div className="card-body">{children}</div>}
      </div>
    </motion.div>
  );
};

export default Card;
