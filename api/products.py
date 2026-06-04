import os
import json
import base64
import requests
import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_OWNER = "Fayozbek777"
REPO_NAME = "mustang-taxi"
FILE_PATH = "api/data/products.json"

LOCAL_FILE = os.path.join(os.path.dirname(__file__), "data", "products.json")


def get_products_from_github():
    try:
        if not GITHUB_TOKEN:
            if os.path.exists(LOCAL_FILE):
                with open(LOCAL_FILE, "r", encoding="utf-8") as f:
                    return json.load(f), None
            return [], None

        url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
        headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }
        res = requests.get(url, headers=headers)

        if res.status_code == 200:
            file_data = res.json()
            content_b64 = file_data.get("content")
            sha = file_data.get("sha")
            content_str = base64.b64decode(content_b64 + "==").decode("utf-8")
            return json.loads(content_str), sha
        else:
            print(f"GitHub Error: {res.status_code}")
            # Если на гитхабе файла еще нет, пробуем локальный
            if os.path.exists(LOCAL_FILE):
                with open(LOCAL_FILE, "r", encoding="utf-8") as f:
                    return json.load(f), None
            return [], None
    except Exception as e:
        print("Error in get_products_from_github:", str(e))
        traceback.print_exc()
        return [], None


def save_products(products, sha=None):
    """Универсальная функция сохранения (локально или в GitHub)"""
    content_bytes = json.dumps(products, ensure_ascii=False, indent=2).encode("utf-8")

    # 1. Всегда сохраняем локально для надежности
    os.makedirs(os.path.dirname(LOCAL_FILE), exist_ok=True)
    with open(LOCAL_FILE, "w", encoding="utf-8") as f:
        f.write(json.dumps(products, ensure_ascii=False, indent=2))

    # 2. Если есть токен, пушим коммит в GitHub Repository
    if GITHUB_TOKEN:
        url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
        headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }

        # Если SHA не пришел, попробуем его запросить, чтобы избежать 409 Conflict
        if not sha:
            _, fetched_sha = get_products_from_github()
            sha = fetched_sha

        payload = {
            "message": "Update products database via Admin Panel",
            "content": base64.b64encode(content_bytes).decode("utf-8"),
        }
        if sha:
            payload["sha"] = sha

        res = requests.put(url, headers=headers, json=payload)
        if res.status_code not in [200, 201]:
            print(f"Failed to save to GitHub: {res.status_code} - {res.text}")
            return False
    return True


@app.route("/", methods=["GET", "POST"])
@app.route("/api/products", methods=["GET", "POST"])  # Поддержка обоих вариантов урла
def handle_products():
    try:
        if request.method == "GET":
            products, _ = get_products_from_github()
            return jsonify(products)

        if request.method == "POST":
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data data received"}), 400

            products, sha = get_products_from_github()

            # Автоинкремент ID
            new_id = max([p.get("id", 0) for p in products], default=0) + 1
            data["id"] = new_id

            products.append(data)

            # Сохраняем изменения!
            save_products(products, sha)

            return jsonify({"success": True, "product": data}), 201

    except Exception as e:
        print("ERROR in handle_products:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/<int:product_id>", methods=["PUT", "DELETE"])
@app.route("/api/products/<int:product_id>", methods=["PUT", "DELETE"])
def handle_single_product(product_id):
    try:
        products, sha = get_products_from_github()

        # Ищем индекс продукта в списке
        product_index = next(
            (index for (index, d) in enumerate(products) if d.get("id") == product_id),
            None,
        )

        if product_index is None:
            return jsonify({"error": "Product not found"}), 404

        if request.method == "PUT":
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data to update"}), 400

            # Обновляем данные, сохраняя старый ID
            data["id"] = product_id
            products[product_index] = data

            save_products(products, sha)
            return jsonify({"success": True, "product": data})

        if request.method == "DELETE":
            # Удаляем продукт из массива
            products.pop(product_index)

            save_products(products, sha)
            return jsonify(
                {"success": True, "message": f"Product {product_id} deleted"}
            )

    except Exception as e:
        print(f"ERROR in handle_single_product for ID {product_id}:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Flask server running on https://localhost:5000")
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        ssl_context="adhoc",
    )

handler = app
