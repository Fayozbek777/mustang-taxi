# My Mustang 🛵

**Luxury-платформа аренды транспорта в Ташкенте**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://vercel.com)
[![i18n](https://img.shields.io/badge/i18n-5_langs-c9a84c)](https://react.i18next.com)

---

### 🚀 Особенности

- **Мультиязычность:** Полная поддержка UZ, RU, EN, HI, UR.
- **Backend:** Supabase (PostgreSQL + Storage) для управления товарами.
- **Admin Panel:** Управление контентом, ценами и фото в реальном времени.
- **Luxury UI:** Анимации Framer Motion, AOS и адаптивный дизайн.
- **Telegram CRM:** Мгновенные уведомления о новых заявках.

---

### 🛠 Стек

- **Frontend:** React 18, Vite, Lucide Icons.
- **Database:** Supabase (JSONB для мультиязычности).
- **Animations:** Framer Motion, AOS.
- **API:** Vercel Serverless (для Telegram Bot API).

---

### 📂 Структура Admin

```text
src/admin/
├── UI/              # Стили админ-панели
├── AdminDashboard   # Статистика и управление
├── AdminProducts    # Список всех товаров
└── EditProduct      # Редактор (Мультиязычность + Загрузка фото)
```

---

### ⚙️ Настройка (.env)

```env
# Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Telegram Bot
VITE_BOT_TOKEN=your_token
VITE_CHAT_ID=your_id

# Admin Access
VITE_ADMIN_PATH=/your-secret-dashboard-path
VITE_ADMIN_LOGIN=admin
VITE_ADMIN_PASSWORD=your_password
```

---

### 🛠 Запуск

```bash
npm install
npm run dev
```

---

### 📍 Контакты

- **Telegram:** [@YandexMustang](https://t.me/YandexMustang)
- **Адрес:** Ташкент, ул. Глинки 27

```

```
