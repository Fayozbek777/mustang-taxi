const BASE_URL = "http://localhost:5000/api";
const API_URL = `${BASE_URL}/products`;

let productsCache = null;

export const productService = {
  async getAll() {
    if (productsCache) {
      return productsCache;
    }

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка при загрузке товаров");

    const data = await response.json();
    productsCache = data;
    return data;
  },

  async create(productData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при добавлении товара");

    const newProduct = await response.json();
    if (productsCache) productsCache.push(newProduct);

    return newProduct;
  },

  async update(id, productData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Ошибка при изменении товара");

    const updatedProduct = await response.json();
    if (productsCache) {
      productsCache = productsCache.map((p) =>
        p.id === id ? updatedProduct : p,
      );
    }

    return updatedProduct;
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ошибка при удалении товара");

    const result = await response.json();
    if (productsCache) {
      productsCache = productsCache.filter((p) => p.id !== id);
    }

    return result;
  },

  clearCache() {
    productsCache = null;
  },
};
