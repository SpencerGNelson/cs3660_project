from flask import Flask, request, jsonify
from flask_cors import CORS
from models import get_professionals, get_services, get_categories, add_service, add_professional, add_category, add_user, email_form
import os

app = Flask(__name__)
CORS(app)

# JSON API routes for React frontend
@app.route("/api/get_professionals")
def api_get_professionals():
    professionals = get_professionals()
    return jsonify([dict(row) for row in professionals])

@app.route("/api/get_services")
def api_get_services():
    services = get_services()
    return jsonify(services)

@app.route("/api/get_categories")
def api_get_categories():
    categories = get_categories()
    return jsonify([dict(row) for row in categories])

# API routes for form submissions
@app.route("/api/contact", methods=["POST"])
def api_contact():
    data = request.get_json()
    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    if not name or not phone or not email or not subject or not message:
        return jsonify({"error": "Please fill in all required fields."}), 400

    try:
        result = email_form(name, phone, email, subject, message)
        if result:
            return jsonify({"success": "Message sent successfully!"})
        else:
            return jsonify({"error": "Failed to send email. Please try again later."}), 500
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({"error": "Failed to send email. Please try again later."}), 500

@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json()
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    confirmation = data.get("confirmation")

    if not name or not username or not password or not confirmation:
        return jsonify({"error": "Please fill in all required fields."}), 400

    if password != confirmation:
        return jsonify({"error": "Passwords do not match."}), 400

    try:
        add_user(username, name, "user", password)
        return jsonify({"success": "Registration successful!"})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Username may already exist."}), 500

@app.route("/api/add_professional", methods=["POST"])
def api_add_professional():
    name = request.form.get("name")
    email = request.form.get("email")

    if not name or not email:
        return jsonify({"error": "Please fill in all required fields."}), 400

    if "image_file" not in request.files:
        return jsonify({"error": "Please upload an image file."}), 400

    image_file = request.files["image_file"]

    if image_file.filename == "":
        return jsonify({"error": "Please select an image file."}), 400

    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_professional(name, email, ext)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred. Please try again."}), 500

    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/professional{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return jsonify({"error": "Failed to save image file. Please try again."}), 500

    return jsonify({"success": "Professional added successfully!"})

@app.route("/api/add_category", methods=["POST"])
def api_add_category():
    name = request.form.get("name")

    if not name:
        return jsonify({"error": "Please fill in all required fields."}), 400

    if "image_file" not in request.files:
        return jsonify({"error": "Please upload an image file."}), 400

    image_file = request.files["image_file"]

    if image_file.filename == "":
        return jsonify({"error": "Please select an image file."}), 400

    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_category(name, ext)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred. Please try again."}), 500

    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/category{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return jsonify({"error": "Failed to save image file. Please try again."}), 500

    return jsonify({"success": "Category added successfully!"})

@app.route("/api/add_service", methods=["POST"])
def api_add_service():
    data = request.get_json()
    servicename = data.get("servicename")
    category_name = data.get("category_name")

    if not servicename or not category_name:
        return jsonify({"error": "Please fill in all required fields."}), 400

    try:
        categories = get_categories()
        categoryid = None
        for cat in categories:
            if cat['name'] == category_name:
                categoryid = cat['id']
                break

        if categoryid is None:
            return jsonify({"error": "Invalid category selected. Please try again."}), 400

        add_service(categoryid, servicename)
        return jsonify({"success": "Service added successfully!"})

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred. Please try again."}), 500

if __name__ == "__main__":
    app.run(debug=True)
