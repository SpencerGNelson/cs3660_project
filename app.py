from flask import Flask, redirect, render_template, send_file, request, jsonify
from models import get_professionals, get_services, get_categories, add_service, add_professional, add_category, add_user
import os

app = Flask(__name__)

@app.route("/")
def root():
    return redirect("home")

@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/contact", methods=["POST"])
def contact_submit():
    name = request.form.get("name")
    phone = request.form.get("phone")
    email = request.form.get("email")
    
    if not name or not phone or not email:
        return "err_missing", 400

@app.route("/services")
def services():
    categories = get_services()
    return render_template("services.html", categories=categories)

@app.route("/professionals")
def professionals():
    professionals = get_professionals()
    return render_template("professionals.html", professionals=professionals)

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    username = request.form.get("username")
    password = request.form.get("password")
    confirmation = request.form.get("confirmation")
    
    if not name or not username or not password or not confirmation:
        return "err_missing", 400
    
    if password != confirmation:
        return "err_mismatch", 400
    
    try:
        add_user(username, name, "user", password)
        return "ok", 200
    except Exception as e:
        print(f"Registration error: {e}")
        return "err_db", 500

@app.route("/pay")
def pay():
    return render_template("pay.html")

@app.route("/admin")
def adminroute():
    return render_template("admin.html")

@app.route("/add_professional")
def add_professional_page():
    professionals = get_professionals()
    return render_template("add_professional.html", professionals=professionals)

@app.route("/add_professional_submit", methods=["POST"])
def add_professional_submit():
    name = request.form.get("name")
    email = request.form.get("email")

    if not name or not email:
        return "err_missing", 400
    
    if "image_file" not in request.files:
        return "err_missing", 400
    
    image_file = request.files["image_file"]

    if image_file.filename == "":
        return "err_missing", 400
    
    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_professional(name, email, f"professional{id}.{ext}")
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db", 500
    
    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/professional{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return "err_filesave", 500
    
    return "ok", 200

@app.route("/add_category")
def add_category_page():
    categories = get_categories()
    return render_template("add_category.html", categories=categories)

@app.route("/add_category_submit", methods=["POST"])
def add_category_submit():
    name = request.form.get("name")
    
    if not name:
        return "err_missing", 400
    
    if "image_file" not in request.files:
        return "err_missing", 400
    
    image_file = request.files["image_file"]
    
    if image_file.filename == "":
        return "err_missing", 400
    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_category(name, f"categories{id}.{ext}")
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db", 500
    
    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/categories{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return "err_filesave", 500
    
    return "ok", 200

@app.route("/add_service")
def add_service_page():
    services = get_services()
    return render_template("add_service.html", services=services)

@app.route("/add_service_submit", methods=["POST"])
def add_service_submit():
    servicename = request.form.get("servicename")
    category_name = request.form.get("category_name")
    
    if not servicename or not category_name:
        return "err_missing", 400
    
    try:
        categories = get_categories()
        categoryid = None
        for cat in categories:
            if cat['name'] == category_name:
                categoryid = cat['id']
                break
        
        if categoryid is None:
            return "err_missing", 400
        
        add_service(categoryid, servicename)
        return "ok", 200
        
    except Exception as e:
        print(f"Database error: {e}")
        return "err_db", 500
    
    return render_template("add_service_submit.html")

@app.route("/common/nav.html")
def nav():
    return render_template("common/nav.html")

@app.route("/common/footer.html")
def footer():
    return render_template("common/footer.html")

@app.route("/images/<path:pathname>")
def image(pathname):
    return send_file(f"images/{pathname}")

@app.route("/index.css")
def css():
    return send_file("index.css")

if __name__ == "__main__":
    app.run(debug=True)