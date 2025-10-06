from flask import Flask, redirect, render_template, send_file

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
    return render_template("services.html")

@app.route("/professionals")
def professionals():
    return render_template("professionals.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/pay")
def pay():
    return render_template("pay.html")

@app.route("/common/nav.html")
def nav():
    return render_template("common/nav.html")

@app.route("/common/footer.html")
def footer():
    return render_template("common/footer.html")

@app.route("/images/<path:pathname")
def image(pathname):
    return send_file(f"/images/{pathname}")

@app.route("/index.css")
def css():
    return send_file("index.css")

@app.route("/index.js")
def js():
    return send_file("index.js")

if __name__ == "__main__":
    app.run(debug=True)