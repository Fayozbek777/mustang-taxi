import React from "react";
import { Wrench, ShieldAlert } from "lucide-react";
import "../pages/UI/Working.css"; // Файл стилей

export default function Working() {
  return (
    <div className="working-container">
      <div className="working-card">
        <div className="working-icon-wrapper">
          <Wrench className="icon-pulse" size={48} />
        </div>
        <h2>Ведутся технические работы</h2>
        <p>
          Мы улучшаем наш сервис **Mustang**, чтобы сделать его еще быстрее и
          комфортнее для вас. Совсем скоро сайт вернется в штатный режим!
        </p>
        <div className="working-footer">
          <ShieldAlert size={16} />
          <span>Разработчик уже работает с этими проблемами</span>
        </div>
      </div>
    </div>
  );
}
