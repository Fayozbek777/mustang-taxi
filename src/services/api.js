const API_URL = "/api/products";

export const productService = {
  // Получить список всех товаров
  async getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка при загрузке товаров");
    return await response.json();
  },

  // Создать новый товар
  async create(productData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при добавлении товара");
    return await response.json();
  },

  // Обновить существующий товар по ID
  async update(id, productData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при изменении товара");
    return await response.json();
  },

  // Удалить товар по ID
  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ошибка при удалении товара");
    return await response.json();
  },
};
