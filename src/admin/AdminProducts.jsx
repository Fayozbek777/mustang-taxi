import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productService } from "../services/api"; // Подключаем новый сервис вместо Supabase
import { Edit, Trash2, Plus, Package } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("cat");
  const SECRET_PATH = import.meta.env.VITE_ADMIN_PATH;

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  async function fetchProducts() {
    try {
      setLoading(true);
      // Запрашиваем все товары из нашего Python API (из файла products.json)
      const data = await productService.getAll();

      // Фильтруем по категории прямо на фронтенде, если фильтр выбран
      if (categoryFilter) {
        const filtered = data.filter((p) => p.category === categoryFilter);
        setProducts(filtered);
      } else {
        setProducts(data || []);
      }
    } catch (e) {
      console.error("Ошибка при получении товаров:", e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (window.confirm("Удалить этот товар?")) {
      try {
        // Отправляем DELETE запрос на Python бекенд
        await productService.delete(id);
        // Обновляем список на UI
        fetchProducts();
      } catch (e) {
        console.error("Ошибка при удалении товара:", e);
        alert("Не удалось удалить товар");
      }
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
        <p>Загрузка...</p>
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
