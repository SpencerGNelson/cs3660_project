from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import *
import os

app = Flask(__name__)
CORS(app)

# Define paths for React app and images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REACT_DIST = os.path.abspath(os.path.join(BASE_DIR, '..', 'reactapp', 'dist'))
IMAGES_DIR = os.path.abspath(os.path.join(BASE_DIR, 'static', 'images'))

# Debug: Print paths on startup
print(f"BASE_DIR: {BASE_DIR}")
print(f"REACT_DIST: {REACT_DIST}")
print(f"REACT_DIST exists: {os.path.exists(REACT_DIST)}")
print(f"IMAGES_DIR: {IMAGES_DIR}")
if os.path.exists(REACT_DIST):
    print(f"Files in REACT_DIST: {os.listdir(REACT_DIST)}")

# Log all requests to debug routing issues
@app.before_request
def log_request():
    print(f"Request: {request.method} {request.path}")
    print(f"Full URL: {request.url}")
    print(f"Request path: {request.path}")

# Root route - serve React app
@app.route("/")
def index():
    try:
        return send_from_directory(REACT_DIST, 'index.html')
    except Exception as e:
        print(f"Error serving index.html: {e}")
        return f"Error: {e}", 500

# Serve React assets (JS, CSS)
@app.route("/assets/<path:filename>")
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
@app.route("/images/<path:filename>")
def serve_public_images(filename):
    return send_from_directory(os.path.join(REACT_DIST, 'images'), filename)

# Serve images from flaskapp/static/images (professionals, categories)
@app.route("/static/images/<path:filename>")
def serve_images(filename):
    return send_from_directory(IMAGES_DIR, filename)

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

@app.route("/api/get_users")
@access_required(level=3)
def api_get_users():
    users = get_users()
    return jsonify(users)

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
        add_user(username, name, 1, password)  # Level 1 for regular users
        return jsonify({"success": "Registration successful!"})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Username may already exist."}), 500

@app.route("/api/login", methods=["POST"])
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

@app.route("/api/add_professional", methods=["POST"])
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

@app.route("/api/add_category", methods=["POST"])
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

@app.route("/api/add_service", methods=["POST"])
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
@app.route("/api/test_public")
def test_public():
    return jsonify({"message": "This is a public route - no authentication required"})

@app.route("/api/test_user")
@access_required(level=1)
def test_user():
    return jsonify({"message": "Success! You have user-level access (level >= 1)"})

@app.route("/api/test_admin")
@access_required(level=10)
def test_admin():
    return jsonify({"message": "Success! You have admin-level access (level >= 10)"})

# DELETE routes for step 2.2
@app.route("/professional/<int:id>", methods=["DELETE"])
@access_required(level=2)
def delete_professional_route(id):
    try:
        delete_professional(id)
        return "ok"
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db"

# PUT routes for step 2.2
@app.route("/professional/<int:id>", methods=["PUT"])
@access_required(level=2)
def update_professional_route(id):
    name = request.form.get("name")

    if not name:
        return "err_db"

    # Step 2.3: Validate that name is an allowable field
    allowed_fields = ["name", "email", "image_file"]
    if name not in allowed_fields:
        return "err_unrecognized_name"

    try:
        if name == "image_file":
            # Handle image file update
            if "image_file" not in request.files:
                return "err_file"

            image_file = request.files["image_file"]
            if image_file.filename == "":
                return "err_file"

            # Check if file type is allowed
            if "." not in image_file.filename:
                return "err_file"

            ext = image_file.filename.rsplit(".", 1)[1]
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
            if ext.lower() not in allowed_extensions:
                return "err_file"

            # Update image filename in database
            update_professional_image(id, ext)

            # Save the file
            os.makedirs("static/images", exist_ok=True)
            image_file.save(f"static/images/professional{id}.{ext}")

        elif name == "name":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_professional_name(id, value)

        elif name == "email":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_professional_email(id, value)
        else:
            return "err_db"

        return "ok"

    except Exception as e:
        print(f"Error: {e}")
        return "err_db"

@app.route("/category/<int:id>", methods=["DELETE"])
@access_required(level=2)
def delete_category_route(id):
    try:
        delete_category(id)
        return "ok"
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db"

@app.route("/category/<int:id>", methods=["PUT"])
@access_required(level=2)
def update_category_route(id):
    name = request.form.get("name")

    if not name:
        return "err_db"

    # Step 2.3: Validate that name is an allowable field
    allowed_fields = ["name", "image_file"]
    if name not in allowed_fields:
        return "err_unrecognized_name"

    try:
        if name == "image_file":
            # Handle image file update
            if "image_file" not in request.files:
                return "err_file"

            image_file = request.files["image_file"]
            if image_file.filename == "":
                return "err_file"

            # Check if file type is allowed
            if "." not in image_file.filename:
                return "err_file"

            ext = image_file.filename.rsplit(".", 1)[1]
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
            if ext.lower() not in allowed_extensions:
                return "err_file"

            # Update image filename in database
            update_category_image(id, ext)

            # Save the file
            os.makedirs("static/images", exist_ok=True)
            image_file.save(f"static/images/category{id}.{ext}")

        elif name == "name":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_category_name(id, value)
        else:
            return "err_db"

        return "ok"

    except Exception as e:
        print(f"Error: {e}")
        return "err_db"

@app.route("/service/<int:id>", methods=["DELETE"])
@access_required(level=2)
def delete_service_route(id):
    try:
        delete_service(id)
        return "ok"
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db"

@app.route("/service/<int:id>", methods=["PUT"])
@access_required(level=2)
def update_service_route(id):
    name = request.form.get("name")

    if not name:
        return "err_db"

    # Step 2.3: Validate that name is an allowable field
    allowed_fields = ["servicename"]
    if name not in allowed_fields:
        return "err_unrecognized_name"

    try:
        if name == "servicename":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_service_name(id, value)

        elif name == "categoryid":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_service_category(id, int(value))
        else:
            return "err_db"

        return "ok"

    except Exception as e:
        print(f"Error: {e}")
        return "err_db"

@app.route("/user/<int:id>", methods=["DELETE"])
@access_required(level=2)
def delete_user_route(id):
    try:
        delete_user(id)
        return "ok"
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db"

@app.route("/user/<int:id>", methods=["PUT"])
@access_required(level=1)
def update_user_route(id):
    token = request.headers.get('Authorization')
    try:
        logged_in_user = get_loggedin_user(token)
    except Exception as e:
        return str(e)
    
    name = request.form.get("name")

    if not name:
        return "err_db"
    
    allowed_fields = ["name", "username", "level", "password"]
    if name not in allowed_fields:
        return "err_unrecognized_name"
    
    is_level_3 = logged_in_user['level'] >= 3
    is_own_profile = logged_in_user['id'] == id

    if not is_level_3 and not is_own_profile:
        return "err_access_denied"
    
    if name == "level" and not is_level_3:
        return "err_access_denied"
    
    try:
        if name == "password":
            old_password = request.form.get("old_password")
            value = request.form.get("value")
            confirmation = request.form.get("confirmation")

            if not value or not confirmation:
                return "err_db"

            # Level 3 users don't need old password when editing other users
            # But they do need it when editing their own profile
            if is_level_3 and not is_own_profile:
                # Level 3 editing someone else's password - no old password required
                pass
            else:
                # Either not level 3, or level 3 editing own password - old password required
                if not old_password:
                    return "err_db"
                if not verify_user_password(id, old_password):
                    return "err_wrong_password"

            if value != confirmation:
                return "err_password_mismatch"

            update_user_password(id, value)

        elif name == "name":
            value = request.form.get("value")
            if not value:
                return "err_db"
            
            update_user_name(id, value)

        elif name == "level":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_user_level(id, int(value))

        elif name == "username":
            value = request.form.get("value")
            if not value:
                return "err_db"
            update_user_username(id, value)
        else:
            return "err_db"
        
        return "ok"
    
    except Exception as e:
        print(f"Error: {e}")
        return "err_db"
    
# Catch-all route for React Router (must be at the end)
@app.route('/<path:path>')
def catch_all(path):
    # If it's an API route, return 404
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404

    # Try to serve the actual file if it exists in the dist folder
    file_path = os.path.join(REACT_DIST, path)
    if os.path.isfile(file_path):
        return send_from_directory(REACT_DIST, path)

    # For all other routes, serve index.html to let React Router handle it
    return send_from_directory(REACT_DIST, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
