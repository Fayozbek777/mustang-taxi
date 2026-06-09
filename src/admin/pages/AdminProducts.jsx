import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productService } from "../../services/api"; // Твой сервис API
import { Edit, Trash2, Plus, Package } from "lucide-react";
import { toast } from "react-hot-toast"; // Импортируем тосты

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("cat");
  const SECRET_PATH =
    import.meta.env.VITE_ADMIN_PATH || "dashboard-mustang-private";

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  async function fetchProducts() {
    try {
      setLoading(true);
      // Запрашиваем товары через наш сервис с кэшированием
      const data = await productService.getAll();

      // Фильтрация на фронтенде по категории
      if (categoryFilter) {
        const filtered = data.filter((p) => p.category === categoryFilter);
        setProducts(filtered);
      } else {
        setProducts(data || []);
      }
    } catch (e) {
      console.error("Ошибка при получении товаров:", e);
      toast.error("Не удалось загрузить список товаров");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

    // 1. Создаем уникальный тост-лоадер на время отправки запроса в GitHub
    const toastId = toast.loading("Синхронизация с репозиторием GitHub...");

    // 2. ОПТИМИСТИЧНЫЙ UI: Сохраняем копию данных и удаляем элемент со сцены мгновенно
    const previousProducts = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      // 3. Отправляем реальный запрос на удаление во Flask бэкенд
      await productService.delete(id);

      // Перезаписываем этот же тост на успешный
      toast.success("Товар успешно удален и стерт из базы Git!", {
        id: toastId,
      });
    } catch (e) {
      console.error("Ошибка при удалении товара на сервере:", e);

      // Перезаписываем тост на ошибку и возвращаем товар обратно в таблицу
      toast.error("Ошибка сервера. Не удалось удалить товар.", { id: toastId });
      setProducts(previousProducts);
    }
  }

  return (
    <div className="admin-products">
      <header className="admin-header">
        <div className="header-left">
          <Package className="icon-accent" />
          <h1>
            {categoryFilter ? categoryFilter.toUpperCase() : "Все товары"}
          </h1>
        </div>
        <Link
          to={`/${SECRET_PATH}/add?cat=${categoryFilter || "scooters"}`}
          className="btn-save"
        >
          <Plus size={20} /> Добавить
        </Link>
      </header>

      {loading ? (
        <p className="loading-text">Загрузка товаров...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          Товары в данной категории не найдены.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Категория</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.images?.[0] || p.image}
                      alt=""
                      loading="lazy" // Оптимизация ленивой загрузки изображений в браузере
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{p.title || p.name}</td>
                  <td>{p.price}</td>
                  <td>
                    <span className="badge">{p.category}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link
                        title="Редактировать"
                        to={`/${SECRET_PATH}/edit/${p.id}`}
                        className="edit-btn"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        title="Удалить"
                        onClick={() => deleteProduct(p.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
