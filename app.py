from flask import Flask, redirect, render_template, send_file, request
from models import get_professionals, get_services, get_categories, add_service, add_professional, add_category

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
    image_file = request.files["image_file"]
    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    id = add_professional(name, email, ext)
    image_file.save(f"static/images/professional{id}.{ext}")
    return render_template("add_professional_submit.html")

@app.route("/add_category")
def add_category_page():
    categories = get_categories()
    return render_template("add_category.html", categories=categories)

@app.route("/add_category_submit", methods=["POST"])
def add_category_submit():
    name = request.form.get("name")
    image_file = request.files["image_file"]
    image_filename = image_file.filename
    ext = image_filename.rsplit(".", 1)[1]

    id = add_category(name, ext)
    image_file.save(f"static/images/categories{id}.{ext}")
    return render_template("add_category_submit.html")

@app.route("/add_service")
def add_service_page():
    services = get_services()
    return render_template("add_service.html", services=services)

@app.route("/add_service_submit", methods=["POST"])
def add_service_submit():
    servicename = request.form.get("servicename")
    category_name = request.form.get("category_name")
    
    # Validate servicename is provided
    if not servicename:
        return "Service name is required", 400
    
    # Validate categoryid is provided and is a valid integer
    if not category_name:
        return "Category is required", 400
    
    
    # Validate that the category exists in the database
    categories = get_categories()
    categoryid = None
    for cat in categories:
        if cat['name'] == category_name:
            categoryid = cat['id']
            break

    # Validate that the category exists
    if categoryid is None:
        return "Category does not exist", 400
    add_service(categoryid, servicename)
    
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