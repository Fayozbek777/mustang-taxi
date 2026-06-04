import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../services/api"; // Переключили на наш локальный API сервис
import { Save, ArrowLeft, Plus, X, PcCase } from "lucide-react";
import "./UI/Admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const languages = ["uz", "ru", "en", "hi", "ur"];
  const currentCat = searchParams.get("cat") || "scooters";

  const [imageUrlInput, setImageUrlInput] = useState(""); // Поле для ручного ввода ссылки на фото

  const [formData, setFormData] = useState({
    title: "",
    category: currentCat,
    price: "",
    price_period: "kun",
    images: [],
    battery: "",
    speed: "",
    deposit: "$",
    description: { uz: "", ru: "", en: "", hi: "", ur: "" },
    features: [
      {
        id: 1,
        uz: "Dubulg'a to'plamda",
        ru: "Шлем в комплекте",
        en: "Helmet included",
        hi: "हेлмет शामिल है",
        ur: "ہیلمٹ शामिल है",
      },
      {
        id: 2,
        uz: "Quvvatlantirish qurilmasi",
        ru: "Зарядное устройство",
        en: "Charger",
        hi: "चार्ज",
        ur: "چارجر",
      },
      {
        id: 3,
        uz: "Telefon ushlagichi",
        ru: "Держатель для телефона",
        en: "Phone holder",
        hi: "फ़ोन होल्डर",
        ur: "فون ہولڈر",
      },
      {
        id: 4,
        uz: "Bepul ta'mirlash",
        ru: "Бесплатный ремонт",
        en: "Free repair",
        hi: "मुफ्त मरम्मत",
        ur: "مفت मरम्मत",
      },
    ],
  });

  useEffect(() => {
    if (id && id !== "undefined") fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAll();
      // Ищем нужный товар по ID из общего JSON-файла бекенда
      const data = allProducts.find((p) => p.id === parseInt(id));

      if (data) {
        setFormData({
          ...data,
          description: data.description || {
            uz: "",
            ru: "",
            en: "",
            hi: "",
            ur: "",
          },
          features: data.features || formData.features,
          price_period: data.price_period || "kun",
          images: data.images || [],
        });
      }
    } catch (error) {
      console.error("Ошибка получения товара:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    if (formData.images.length >= 4) return alert("Максимум 4 фотографии");

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id: _, created_at: __, ...cleanData } = formData;

    try {
      if (id && id !== "undefined") {
        // Вызов метода PUT для обновления существующего товара
        await productService.update(parseInt(id), cleanData);
      } else {
        // Вызов метода POST для создания нового товара
        await productService.create(cleanData);
      }
      navigate(-1);
    } catch (error) {
      alert("Ошибка: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button type="button" onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Назад
        </button>
        <h1>
          {id && id !== "undefined" ? "Редактировать товар" : "Новый товар"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <section className="base-info">
          <div className="form-group">
            <label>Название (Model)</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Категория</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="scooters">Scooters</option>
              <option value="velo">Bicycles</option>
              <option value="bags">Bags</option>
              <option value="drongo">Drongo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Цена и период</label>
            <div className="price-row">
              <input
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Цена"
              />
              <select
                value={formData.price_period}
                onChange={(e) =>
                  setFormData({ ...formData, price_period: e.target.value })
                }
              >
                <option value="kun">/ день</option>
                <option value="oy">/ месяц</option>
                <option value="yil">/ год</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Условия залога</label>
            <input
              value={formData.deposit}
              onChange={(e) =>
                setFormData({ ...formData, deposit: e.target.value })
              }
              placeholder="Напр: 100$ без паспорта"
            />
          </div>

          {(formData.category === "scooters" ||
            formData.category === "drongo") && (
            <div className="tech-specs-row">
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Скорость (км/ч)</label>
                <input
                  value={formData.speed}
                  onChange={(e) =>
                    setFormData({ ...formData, speed: e.target.value })
                  }
                  placeholder="25"
                />
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Батарея / Запас хода</label>
                <input
                  value={formData.battery}
                  onChange={(e) =>
                    setFormData({ ...formData, battery: e.target.value })
                  }
                  placeholder="15000 mAh или 40 км"
                />
              </div>
            </div>
          )}
        </section>

        <section className="lang-section">
          <h2>Описание</h2>
          <div className="lang-grid">
            {languages.map((lang) => (
              <div key={lang} className="lang-box">
                <span className="lang-label">{lang.toUpperCase()}</span>
                <textarea
                  value={formData.description[lang] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="images-section">
          <h2>Фотографии товара (до 4-х)</h2>

          {/* Блок ввода ссылки (остался как был, для универсальности) */}
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Вставьте ссылку на фото (например, https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="image-url-input"
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              style={{
                padding: "8px 15px",
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}
            >
              <Plus size={16} style={{ marginRight: "5px" }} /> Ссылка
            </button>

            {/* СКРЫТЫЙ ИНПУТ ДЛЯ ВЫБОРА ФАЙЛОВ */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={async (e) => {
                const files = Array.from(e.target.files);

                // Проверяем лимит, чтобы суммарно не превысить 4 фотографии
                if (formData.images.length + files.length > 4) {
                  alert("Максимум можно добавить 4 фотографии");
                  return;
                }

                const base64Promises = files.map((file) => {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file); // Конвертируем в Base64 Data URL
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                  });
                });

                try {
                  const base64Images = await Promise.all(base64Promises);
                  setFormData({
                    ...formData,
                    images: [...formData.images, ...base64Images],
                  });
                } catch (error) {
                  console.error("Ошибка при чтении файлов:", error);
                  alert("Не удалось загрузить некоторые файлы");
                }

                // Очищаем инпут, чтобы можно было загрузить тот же файл повторно
                e.target.value = "";
              }}
            />

            {/* КНОПКА ЗАГРУЗКИ С ПК */}
            <button
              type="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              style={{
                padding: "8px 15px",
                background: "#10b981", // Зеленый цвет для отличия
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}
            >
              <PcCase size={16} style={{ marginRight: "5px" }} /> Загрузить с ПК
            </button>
          </div>

          {/* Сетка предпросмотра изображений (осталась без изменений) */}
          <div className="images-upload-grid">
            {formData.images &&
              formData.images.map((url, index) => (
                <div
                  key={index}
                  className="image-preview-item"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="remove-img-btn"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
          </div>
        </section>

        <section className="features-section">
          <h2>Преимущества при аренде (по языкам)</h2>
          <div className="languages-features-container">
            {languages.map((lang) => (
              <div key={lang} className="lang-feature-group">
                <h3 className="lang-group-title">
                  {lang.toUpperCase()} версия преимуществ
                </h3>
                <div className="features-inputs-list">
                  {formData.features.map((feat, idx) => (
                    <div key={feat.id} className="feature-input-item">
                      <span className="feature-number">{idx + 1}</span>
                      <input
                        placeholder={`Текст на ${lang.toUpperCase()}...`}
                        value={feat[lang] || ""}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[idx][lang] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="save-btn" disabled={loading}>
          <Save size={20} /> {loading ? "Сохранение..." : "СОХРАНИТЬ ВСЁ"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
