{% extends "layout.html" %}
{% block main %}
    <h2>Contact Us</h2>

    {% if success %}
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ success }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    {% endif %}

    {% if error %}
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    {% endif %}

    <form method="POST" action="/contact">
        <div>
            <input autocomplete="off" type="text" name="name" placeholder="Your Name">
        </div>
         <div>
            <input autocomplete="off" type="text" name="phone" placeholder="Your Phone Number">
        </div>
        <div>
            <input autocomplete="off" type="email" name="email" placeholder="Your Email">
        </div>
        <div>
            <input autocomplete="off" type="text" name="subject" placeholder="Subject">
        </div>
        <div>
            <textarea autocomplete="off" name="message" placeholder="Your Message" rows="5"></textarea>
        </div>
         <div>
            <input type="submit">
        </div>
    </form>
{% endblock %}