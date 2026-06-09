import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../../services/api";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Upload,
  Link,
  Info,
  Image,
  Star,
  Languages,
  Loader2,
  Check,
} from "lucide-react";
import "../UI/EditProduct.css";

const LANGUAGES = ["uz", "ru", "en", "hi", "ur"];

const LANG_LABELS = { uz: "UZ", ru: "RU", en: "EN", hi: "HI", ur: "UR" };

const DEFAULT_FEATURES = [
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
    hi: "चार्जर",
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
];

const numOnly = (val) => val.replace(/[^0-9.,]/g, "");

/* ─── Sub-components ─── */

const CardSection = ({ icon: Icon, title, children }) => (
  <div className="ep-card">
    <div className="ep-card-head">
      <Icon size={15} className="ep-card-icon" />
      <span className="ep-card-title">{title}</span>
    </div>
    <div className="ep-card-body">{children}</div>
  </div>
);

const Field = ({ label, children, full }) => (
  <div className={`ep-field${full ? " ep-field--full" : ""}`}>
    <label className="ep-label">{label}</label>
    {children}
  </div>
);

const LangTabs = ({ active, onChange }) => (
  <div className="ep-lang-tabs">
    {LANGUAGES.map((l) => (
      <button
        key={l}
        type="button"
        className={`ep-lang-tab${active === l ? " ep-lang-tab--active" : ""}`}
        onClick={() => onChange(l)}
      >
        {LANG_LABELS[l]}
      </button>
    ))}
  </div>
);

/* ─── Main Component ─── */

const EditProduct = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const currentCat = searchParams.get("cat") || "scooters";
  const isEdit = id && id !== "undefined";

  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [descLang, setDescLang] = useState("uz");
  const [featLang, setFeatLang] = useState("uz");

  const [formData, setFormData] = useState({
    title: "",
    category: currentCat,
    price: "",
    price_period: "kun",
    images: [],
    battery: "",
    speed: "",
    deposit: "",
    description: { uz: "", ru: "", en: "", hi: "", ur: "" },
    features: DEFAULT_FEATURES,
  });

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const all = await productService.getAll();
      const data = all.find((p) => p.id === parseInt(id));
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
          features: data.features || DEFAULT_FEATURES,
          price_period: data.price_period || "kun",
          images: data.images || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const set = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const hasTechSpecs =
    formData.category === "scooters" || formData.category === "drongo";

  /* Images */
  const addImgUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    if (formData.images.length >= 4) return alert("Максимум 4 фотографии");
    set({ images: [...formData.images, imageUrlInput.trim()] });
    setImageUrlInput("");
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 4) {
      alert("Максимум 4 фотографии");
      e.target.value = "";
      return;
    }
    const toBase64 = (f) =>
      new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
    try {
      const b64s = await Promise.all(files.map(toBase64));
      set({ images: [...formData.images, ...b64s] });
    } catch {
      alert("Не удалось загрузить файлы");
    }
    e.target.value = "";
  };

  const removeImg = (i) =>
    set({ images: formData.images.filter((_, idx) => idx !== i) });

  /* Features */
  const updateFeature = (idx, lang, val) => {
    const next = formData.features.map((f, i) =>
      i === idx ? { ...f, [lang]: val } : f,
    );
    set({ features: next });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveState("saving");
    const { id: _, created_at: __, ...cleanData } = formData;
    try {
      if (isEdit) await productService.update(parseInt(id), cleanData);
      else await productService.create(cleanData);
      setSaveState("saved");
      setTimeout(() => navigate(-1), 900);
    } catch (err) {
      alert("Ошибка: " + err.message);
      setSaveState("idle");
    }
  };

  if (loading) {
    return (
      <div className="ep-loader">
        <Loader2 size={28} className="ep-loader-spin" />
      </div>
    );
  }

  return (
    <div className="ep-root">
      {/* Header */}
      <div className="ep-header">
        <button type="button" className="ep-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="ep-heading">
          {isEdit ? "Редактировать товар" : "Новый товар"}
        </h1>
        <span className="ep-badge">{isEdit ? "EDIT" : "NEW"}</span>
      </div>

      <form onSubmit={handleSubmit} className="ep-form" noValidate>
        {/* ── Основная информация ── */}
        <CardSection icon={Info} title="Основная информация">
          <div className="ep-row-2">
            <Field label="Название модели">
              <input
                className="ep-input"
                value={formData.title}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="Например: Xiaomi Pro 2"
                required
              />
            </Field>
            <Field label="Категория">
              <select
                className="ep-input ep-select"
                value={formData.category}
                onChange={(e) => set({ category: e.target.value })}
              >
                <option value="scooters">Scooters</option>
                <option value="velo">Bicycles</option>
                <option value="bags">Bags</option>
                <option value="drongo">Drongo</option>
              </select>
            </Field>
          </div>

          <div className="ep-row-2">
            <Field label="Цена">
              <div className="ep-price-row">
                <div className="ep-input-wrap">
                  <input
                    className="ep-input ep-input--unit"
                    value={formData.price}
                    onChange={(e) => set({ price: numOnly(e.target.value) })}
                    placeholder="25000"
                    inputMode="numeric"
                  />
                  <span className="ep-unit">UZS</span>
                </div>
                <select
                  className="ep-input ep-select ep-select--period"
                  value={formData.price_period}
                  onChange={(e) => set({ price_period: e.target.value })}
                >
                  <option value="kun">/ день</option>
                  <option value="oy">/ месяц</option>
                  <option value="yil">/ год</option>
                </select>
              </div>
            </Field>
            <Field label="Условия залога">
              <input
                className="ep-input"
                value={formData.deposit}
                onChange={(e) => set({ deposit: e.target.value })}
                placeholder="Напр: 100$ без паспорта"
              />
            </Field>
          </div>

          {hasTechSpecs && (
            <div className="ep-row-2">
              <Field label="Скорость">
                <div className="ep-input-wrap">
                  <input
                    className="ep-input ep-input--unit"
                    value={formData.speed}
                    onChange={(e) => set({ speed: numOnly(e.target.value) })}
                    placeholder="25"
                    inputMode="numeric"
                  />
                  <span className="ep-unit">км/ч</span>
                </div>
              </Field>
              <Field label="Батарея / Запас хода">
                <div className="ep-input-wrap">
                  <input
                    className="ep-input ep-input--unit"
                    value={formData.battery}
                    onChange={(e) => set({ battery: numOnly(e.target.value) })}
                    placeholder="40"
                    inputMode="numeric"
                  />
                  <span className="ep-unit">км</span>
                </div>
              </Field>
            </div>
          )}
        </CardSection>

        {/* ── Описание ── */}
        <CardSection icon={Languages} title="Описание по языкам">
          <LangTabs active={descLang} onChange={setDescLang} />
          {LANGUAGES.map((lang) => (
            <div
              key={lang}
              className={`ep-lang-panel${descLang === lang ? " ep-lang-panel--show" : ""}`}
            >
              <textarea
                className="ep-input ep-textarea"
                value={formData.description[lang] || ""}
                onChange={(e) =>
                  set({
                    description: {
                      ...formData.description,
                      [lang]: e.target.value,
                    },
                  })
                }
                placeholder={`Описание на ${LANG_LABELS[lang]}...`}
                dir={lang === "ur" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </CardSection>

        {/* ── Фотографии ── */}
        <CardSection icon={Image} title="Фотографии товара">
          <div className="ep-url-row">
            <input
              className="ep-input"
              type="text"
              placeholder="Вставьте ссылку https://..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
            <button
              type="button"
              className="ep-btn-outline"
              onClick={addImgUrl}
            >
              <Link size={15} /> Ссылка
            </button>
            <button
              type="button"
              className="ep-btn-green"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> С ПК
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="ep-hidden"
            onChange={handleFiles}
          />

          <div className="ep-imgs-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ep-img-slot">
                {formData.images[i] ? (
                  <>
                    <img
                      src={formData.images[i]}
                      alt={`preview-${i}`}
                      className="ep-img-preview"
                    />
                    <button
                      type="button"
                      className="ep-img-del"
                      onClick={() => removeImg(i)}
                    >
                      <X size={13} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="ep-img-empty"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus size={20} />
                    <span>Фото {i + 1}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardSection>

        {/* ── Преимущества ── */}
        <CardSection icon={Star} title="Преимущества при аренде">
          <LangTabs active={featLang} onChange={setFeatLang} />
          {LANGUAGES.map((lang) => (
            <div
              key={lang}
              className={`ep-lang-panel${featLang === lang ? " ep-lang-panel--show" : ""}`}
            >
              <div className="ep-feat-grid">
                {formData.features.map((feat, idx) => (
                  <div key={feat.id} className="ep-feat-item">
                    <span className="ep-feat-num">{idx + 1}</span>
                    <input
                      className="ep-input"
                      value={feat[lang] || ""}
                      onChange={(e) => updateFeature(idx, lang, e.target.value)}
                      placeholder={`Текст на ${LANG_LABELS[lang]}...`}
                      dir={lang === "ur" ? "rtl" : "ltr"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardSection>

        {/* ── Save ── */}
        <button
          type="submit"
          className={`ep-save-btn ep-save-btn--${saveState}`}
          disabled={saveState !== "idle"}
        >
          {saveState === "saving" && (
            <Loader2 size={18} className="ep-loader-spin" />
          )}
          {saveState === "saved" && <Check size={18} />}
          {saveState === "idle" && <Save size={18} />}
          {saveState === "saving"
            ? "Сохранение..."
            : saveState === "saved"
              ? "Сохранено!"
              : "Сохранить всё"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
