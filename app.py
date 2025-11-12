from flask import Flask, redirect, render_template, send_file, request
from models import get_professionals, get_services

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
def add_professional():
    return render_template("add_professional.html")

@app.route("/add_professional_submit", methods=["POST"])
def add_professional_submit():
    name = request.form.get("name")
    email = request.form.get("email")
    image_file = request.files["image_file"]
    image_filename = image_file.filename
    ext = image_filename.rsplit(".")[1]
    return render_template("add_professional_submit.html")

@app.route("/add_category")
def add_category():
    return render_template("add_category.html")

@app.route("/add_service")
def add_service():
    return render_template("add_service.html")

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