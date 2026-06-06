const API_URL = "/api/products";

export const productService = {
  async getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка при загрузке товаров");
    return await response.json();
  },

  async create(productData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при добавлении товара");
    return await response.json();
  },

  async update(id, productData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при изменении товара");
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ошибка при удалении товара");
    return await response.json();
  },
};
