from flask import Flask, redirect, render_template, send_file, request, jsonify
from models import get_professionals, get_services, get_categories, add_service, add_professional, add_category, add_user, email_form
import os

app = Flask(__name__)

@app.route("/")
def root():
    return redirect("home")

@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/contact", methods=["POST"])
def contact_submit():
    name = request.form.get("name")
    phone = request.form.get("phone")
    email = request.form.get("email")
    subject =request.form.get("subject")
    message = request.form.get("message")
    
    if not name or not phone or not email or not subject or not message:
        return render_template("contact.html", error="Please fill in all required fields.")

    try:
        result = email_form(name, phone, email, subject, message)
        if result:
            return render_template("contact.html", success="Message sent successfully!")
        else:
            return render_template("contact.html", error="Failed to send email. Please try again later.")
    except Exception as e:
        print(f"Email error: {e}")
        return render_template("contact.html", error="Failed to send email. Please try again later.")

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

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/register", methods=["POST"])
def register_submit():
    name = request.form.get("name")
    username = request.form.get("username")
    password = request.form.get("password")
    confirmation = request.form.get("confirmation")

    if not name or not username or not password or not confirmation:
        return render_template("register.html", error="Please fill in all required fields.")

    if password != confirmation:
        return render_template("register.html", error="Passwords do not match.")

    try:
        add_user(username, name, "user", password)
        return redirect("/login")
    except Exception as e:
        print(f"Registration error: {e}")
        return render_template("register.html", error="Registration failed. Username may already exist.")

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
        return render_template("add_professional.html",
                             professionals=get_professionals(),
                             error="Please fill in all required fields.")

    if "image_file" not in request.files:
        return render_template("add_professional.html",
                             professionals=get_professionals(),
                             error="Please upload an image file.")

    image_file = request.files["image_file"]

    if image_file.filename == "":
        return render_template("add_professional.html",
                             professionals=get_professionals(),
                             error="Please select an image file.")

    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_professional(name, email, ext)
    except Exception as e:
        print(f"Database error: {e}")
        return render_template("add_professional.html",
                             professionals=get_professionals(),
                             error="Database error occurred. Please try again.")

    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/professional{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return render_template("add_professional.html",
                             professionals=get_professionals(),
                             error="Failed to save image file. Please try again.")

    return render_template("add_professional.html",
                         professionals=get_professionals(),
                         success="Professional added successfully!")

@app.route("/add_category")
def add_category_page():
    categories = get_categories()
    return render_template("add_category.html", categories=categories)

@app.route("/add_category_submit", methods=["POST"])
def add_category_submit():
    name = request.form.get("name")

    if not name:
        return render_template("add_category.html",
                             categories=get_categories(),
                             error="Please fill in all required fields.")

    if "image_file" not in request.files:
        return render_template("add_category.html",
                             categories=get_categories(),
                             error="Please upload an image file.")

    image_file = request.files["image_file"]

    if image_file.filename == "":
        return render_template("add_category.html",
                             categories=get_categories(),
                             error="Please select an image file.")

    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    try:
        id = add_category(name, ext)
    except Exception as e:
        print(f"Database error: {e}")
        return render_template("add_category.html",
                             categories=get_categories(),
                             error="Database error occurred. Please try again.")

    try:
        os.makedirs("static/images", exist_ok=True)
        image_file.save(f"static/images/category{id}.{ext}")
    except Exception as e:
        print(f"File save error: {e}")
        return render_template("add_category.html",
                             categories=get_categories(),
                             error="Failed to save image file. Please try again.")

    return render_template("add_category.html",
                         categories=get_categories(),
                         success="Category added successfully!")

@app.route("/add_service")
def add_service_page():
    services = get_services()
    return render_template("add_service.html", services=services)

@app.route("/add_service_submit", methods=["POST"])
def add_service_submit():
    servicename = request.form.get("servicename")
    category_name = request.form.get("category_name")

    if not servicename or not category_name:
        return render_template("add_service.html",
                             services=get_services(),
                             error="Please fill in all required fields.")

    try:
        categories = get_categories()
        categoryid = None
        for cat in categories:
            if cat['name'] == category_name:
                categoryid = cat['id']
                break

        if categoryid is None:
            return render_template("add_service.html",
                                 services=get_services(),
                                 error="Invalid category selected. Please try again.")

        add_service(categoryid, servicename)
        return render_template("add_service.html",
                             services=get_services(),
                             success="Service added successfully!")

    except Exception as e:
        print(f"Database error: {e}")
        return render_template("add_service.html",
                             services=get_services(),
                             error="Database error occurred. Please try again.")
    
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