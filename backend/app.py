import os
import json
import base64
import requests
import traceback
import tinify
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
TINYPNG_API_KEY = os.environ.get("TINYPNG_API_KEY")

REPO_OWNER = "Fayozbek777"
REPO_NAME = "mustang-taxi"
FILE_PATH = "api/data/products.json"
LOCAL_FILE = os.path.join(os.path.dirname(__file__), "data", "products.json")

if TINYPNG_API_KEY:
    tinify.key = TINYPNG_API_KEY
    print("🔒 TinyPNG API: Авторизован.")
else:
    print("⚠️ TinyPNG API: КЛЮЧ НЕ НАЙДЕН в файле .env.")


def compress_base64_image(base64_string):
    """Сжимает Base64 изображение и возвращает WebP Base64 + лог"""
    if not TINYPNG_API_KEY:
        return base64_string, "Сжатие отключено (нет ключа)"

    if not base64_string.startswith("data:image"):
        return base64_string, "Пропущен локальный путь"

    try:
        if "," in base64_string:
            header, encoded_data = base64_string.split(",", 1)
        else:
            header, encoded_data = "", base64_string

        image_bytes = base64.b64decode(encoded_data)
        old_size = round(len(image_bytes) / 1024, 1)

        source = tinify.from_buffer(image_bytes)
        resized = source.resize(method="scale", width=800)
        converted = resized.convert(type=["image/webp"])
        compressed_bytes = converted.to_buffer()

        new_size = round(len(compressed_bytes) / 1024, 1)
        saved = round(((old_size - new_size) / old_size) * 100) if old_size > 0 else 0

        compressed_base64 = base64.b64encode(compressed_bytes).decode("utf-8")

        msg = f"Размер снижен на {saved}%! ({old_size} KB ➡️ {new_size} KB)"
        return f"data:image/webp;base64,{compressed_base64}", msg
    except Exception as e:
        print(f"❌ Ошибка сжатия TinyPNG: {str(e)}")
        return base64_string, f"Ошибка сжатия: {str(e)}"


def get_products_from_github():
    try:
        if not GITHUB_TOKEN:
            if os.path.exists(LOCAL_FILE):
                with open(LOCAL_FILE, "r", encoding="utf-8") as f:
                    return json.load(f), None
            return [], None

        url = f"https://github.com{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
        headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            file_data = res.json()
            content_b64 = file_data.get("content")
            sha = file_data.get("sha")
            content_str = (
                base64.b64decode(content_b64 + "==").decode("utf-8").lstrip("\ufeff")
            )
            return json.loads(content_str), sha
        else:
            if os.path.exists(LOCAL_FILE):
                with open(LOCAL_FILE, "r", encoding="utf-8") as f:
                    return json.load(f), None
            return [], None
    except Exception as e:
        traceback.print_exc()
        return [], None


def save_products(products, sha=None):
    content_bytes = json.dumps(products, ensure_ascii=False, indent=2).encode("utf-8")
    if not os.environ.get("VERCEL"):
        try:
            os.makedirs(os.path.dirname(LOCAL_FILE), exist_ok=True)
            with open(LOCAL_FILE, "w", encoding="utf-8") as f:
                f.write(json.dumps(products, ensure_ascii=False, indent=2))
        except Exception as local_err:
            print(local_err)

    if GITHUB_TOKEN:
        url = f"https://github.com{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
        headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }
        try:
            res_get = requests.get(url, headers=headers)
            if res_get.status_code == 200:
                sha = res_get.json().get("sha")
        except:
            pass

        payload = {
            "message": "⚡ Production Database Update via Admin Panel",
            "content": base64.b64encode(content_bytes).decode("utf-8"),
        }
        if sha:
            payload["sha"] = sha
        res = requests.put(url, headers=headers, json=payload)
        return res.status_code in [200, 201]
    return True


def process_product_images(data):
    """Вспомогательная функция для перехвата картинок в любых ключах (image или images)"""
    logs = []

    if "image" in data and data["image"] and data["image"].startswith("data:image"):
        data["image"], log_msg = compress_base64_image(data["image"])
        logs.append(log_msg)

    if "images" in data and isinstance(data["images"], list):
        compressed_list = []
        for img in data["images"]:
            if img.startswith("data:image"):
                compressed_img, log_msg = compress_base64_image(img)
                compressed_list.append(compressed_img)
                logs.append(log_msg)
            else:
                compressed_list.append(img)
        data["images"] = compressed_list

    return ", ".join(logs) if logs else "Товар успешно сохранен!"


@app.route("/", methods=["GET", "POST"])
@app.route("/api/products", methods=["GET", "POST"])
def handle_products():
    try:
        if request.method == "GET":
            products, _ = get_products_from_github()
            return jsonify(products)

        if request.method == "POST":
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data received"}), 400

            # 🔥 Перехватываем и пережимаем ВСЕ картинки из любых массивов/ключей
            toast_msg = process_product_images(data)

            products, sha = get_products_from_github()
            new_id = max([p.get("id", 0) for p in products], default=0) + 1
            data["id"] = new_id
            products.append(data)

            save_products(products, sha)
            return (
                jsonify({"success": True, "product": data, "toast_message": toast_msg}),
                201,
            )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/<int:product_id>", methods=["PUT", "DELETE"])
@app.route("/api/products/<int:product_id>", methods=["PUT", "DELETE"])
def handle_single_product(product_id):
    try:
        products, sha = get_products_from_github()
        target_id = int(product_id)
        product_index = None

        for index, p in enumerate(products):
            p_id = p.get("id")
            if p_id is not None and int(p_id) == target_id:
                product_index = index
                break

        if product_index is None:
            return jsonify({"error": f"Product {target_id} not found"}), 404

        if request.method == "PUT":
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data to update"}), 400

            # 🔥 Перехватываем картинки при редактировании
            toast_msg = process_product_images(data)

            data["id"] = target_id
            products[product_index] = data
            save_products(products, sha)
            return jsonify(
                {"success": True, "product": data, "toast_message": toast_msg}
            )

        if request.method == "DELETE":
            products.pop(product_index)
            save_products(products, sha)
            return jsonify({"success": True, "message": "Deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
handler = app
