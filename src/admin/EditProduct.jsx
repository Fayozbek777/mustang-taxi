import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Save, ArrowLeft, Upload, X, CheckCircle2 } from "lucide-react";
import "./UI/Admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const languages = ["uz", "ru", "en", "hi", "ur"];
  const currentCat = searchParams.get("cat") || "scooters";

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
        hi: "हेलमेट शामिल है",
        ur: "ہیلمٹ شامل ہے",
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
        ur: "مفت مرمت",
      },
    ],
  });

  useEffect(() => {
    if (id && id !== "undefined") fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
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
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id: _, created_at: __, ...cleanData } = formData;

    try {
      const query =
        id && id !== "undefined"
          ? supabase.from("products").update(cleanData).eq("id", id)
          : supabase.from("products").insert([cleanData]);

      const { error } = await query;
      if (error) throw error;
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
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Назад
        </button>
        <h1>{id ? "Редактировать товар" : "Новый товар"}</h1>
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

          {/* Показываем доп. поля только для самокатов и Drongo */}
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
        {/* ФОТОГРАФИИ */}
        <section className="images-section">
          <h2>Фотографии товара (до 4-х)</h2>
          <div className="images-upload-grid">
            {formData.images.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url} alt={`preview-${index}`} />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = formData.images.filter(
                      (_, i) => i !== index,
                    );
                    setFormData({ ...formData, images: newImages });
                  }}
                  className="remove-img-btn"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {formData.images.length < 4 && (
              <label className="upload-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setLoading(true);
                    try {
                      const fileExt = file.name.split(".").pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const filePath = `products/${fileName}`;

                      const { error: uploadError } = await supabase.storage
                        .from("images")
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      const {
                        data: { publicUrl },
                      } = supabase.storage
                        .from("images")
                        .getPublicUrl(filePath);

                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, publicUrl],
                      }));
                    } catch (err) {
                      alert("Ошибка загрузки: " + err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  hidden
                />
                <div className="upload-content">
                  <Upload size={32} />
                  <span>Загрузить фото</span>
                </div>
              </label>
            )}
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
