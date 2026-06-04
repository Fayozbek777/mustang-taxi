import React from "react";
import { motion } from "framer-motion";

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
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f12]/80 backdrop-blur-md p-1 transition-all duration-300 ${className}`}
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
      {/* Эффект свечения заднего фона при наведении группы (group-hover) */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ffd000]/0 via-[#ffd000]/20 to-[#ffd000]/0 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

      {/* Внутренний контейнер для изоляции контента над эффектом свечения */}
      <div className="relative h-full w-full rounded-[14px] bg-[#0f0f12] p-5">
        {/* Изображение / Медиа */}
        {image && (
          <div className="relative mb-5 overflow-hidden rounded-xl bg-neutral-900 aspect-video">
            <img
              src={image}
              alt={title || "Card image"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Градиентное затемнение поверх картинки */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Контентная часть */}
        <div className="flex flex-col gap-3">
          {title && (
            <div className="relative pb-2">
              <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#ffd000]">
                {title}
              </h3>
              {/* Декоративная линия, которая расширяется при наведении */}
              <div className="absolute bottom-0 left-0 h-[2px] w-8 bg-[#ffd000] transition-all duration-300 group-hover:w-16" />
            </div>
          )}

          {children && (
            <div className="text-sm leading-relaxed text-[#888888] transition-colors duration-300 group-hover:text-neutral-300">
              {children}
            </div>
          )}
        </div>

        {/* Акцентный угловой блик (Corner Glow) */}
        <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-gradient-to-bl from-[#ffd000]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
};

export default Card;
