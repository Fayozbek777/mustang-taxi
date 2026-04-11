import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
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
      let query = supabase.from("products").select("*");
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (window.confirm("Удалить этот товар?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) fetchProducts();
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
                      src={p.images?.[0]}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{p.title}</td>
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
