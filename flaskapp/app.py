from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import get_professionals, get_services, get_categories, add_service, add_professional, add_category, add_user, email_form, check_login, create_login_token, access_required
import os

app = Flask(__name__)
CORS(app)

# Define paths for React app and images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REACT_DIST = os.path.abspath(os.path.join(BASE_DIR, '..', 'reactapp', 'dist'))
IMAGES_DIR = os.path.abspath(os.path.join(BASE_DIR, 'static', 'images'))

# Root route - serve React app at the correct path
@app.route("/cs3660_project/Project/flaskapp/")
def index():
    return send_from_directory(REACT_DIST, 'index.html')

# Serve React assets (JS, CSS)
@app.route("/cs3660_project/Project/flaskapp/assets/<path:filename>")
def serve_assets(filename):
    assets_dir = os.path.join(REACT_DIST, 'assets')
    file_path = os.path.join(assets_dir, filename)

    # Debug logging
    if not os.path.exists(file_path):
        print(f"Asset not found: {file_path}")
        print(f"REACT_DIST: {REACT_DIST}")
        print(f"Assets dir: {assets_dir}")
        print(f"File exists: {os.path.exists(file_path)}")
        return jsonify({"error": "Asset not found", "path": file_path}), 404

    # Set correct MIME type for JavaScript modules
    mimetype = None
    if filename.endswith('.js'):
        mimetype = 'application/javascript'
    elif filename.endswith('.css'):
        mimetype = 'text/css'

    return send_from_directory(assets_dir, filename, mimetype=mimetype)

# Serve public images from React dist/images (like logo)
@app.route("/cs3660_project/Project/flaskapp/images/<path:filename>")
def serve_public_images(filename):
    return send_from_directory(os.path.join(REACT_DIST, 'images'), filename)

# Serve images from flaskapp/static/images (professionals, categories)
@app.route("/cs3660_project/Project/flaskapp/static/images/<path:filename>")
def serve_images(filename):
    return send_from_directory(IMAGES_DIR, filename)

# JSON API routes for React frontend
@app.route("/cs3660_project/Project/flaskapp/api/get_professionals")
def api_get_professionals():
    professionals = get_professionals()
    return jsonify([dict(row) for row in professionals])

@app.route("/cs3660_project/Project/flaskapp/api/get_services")
def api_get_services():
    services = get_services()
    return jsonify(services)

@app.route("/cs3660_project/Project/flaskapp/api/get_categories")
def api_get_categories():
    categories = get_categories()
    return jsonify([dict(row) for row in categories])

# API routes for form submissions
@app.route("/cs3660_project/Project/flaskapp/api/contact", methods=["POST"])
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

@app.route("/cs3660_project/Project/flaskapp/api/register", methods=["POST"])
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
        add_user(username, name, 1, password)  # Level 1 for regular users
        return jsonify({"success": "Registration successful!"})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Username may already exist."}), 500

@app.route("/cs3660_project/Project/flaskapp/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return "err_login_failed", 401

    # Check credentials
    user_info = check_login(username, password)

    if user_info is None:
        return "err_login_failed", 401

    # Create JWT token
    token = create_login_token(user_info)

    # Return token and user info
    return jsonify({
        "token": token,
        "name": user_info['name'],
        "level": user_info['level']
    })

@app.route("/cs3660_project/Project/flaskapp/api/add_professional", methods=["POST"])
@access_required(level=2)
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

@app.route("/cs3660_project/Project/flaskapp/api/add_category", methods=["POST"])
@access_required(level=2)
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

@app.route("/cs3660_project/Project/flaskapp/api/add_service", methods=["POST"])
@access_required(level=2)
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

# Test routes for access_required decorator
@app.route("/cs3660_project/Project/flaskapp/api/test_public")
def test_public():
    return jsonify({"message": "This is a public route - no authentication required"})

@app.route("/cs3660_project/Project/flaskapp/api/test_user")
@access_required(level=1)
def test_user():
    return jsonify({"message": "Success! You have user-level access (level >= 1)"})

@app.route("/cs3660_project/Project/flaskapp/api/test_admin")
@access_required(level=10)
def test_admin():
    return jsonify({"message": "Success! You have admin-level access (level >= 10)"})

# Catch-all route for React Router (must be at the end)
@app.route('/cs3660_project/Project/flaskapp/<path:path>')
def catch_all(path):
    # If it's an API route, return 404
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
    # For all other routes, serve index.html to let React Router handle it
    return send_from_directory(REACT_DIST, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
