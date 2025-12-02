{% extends "layout.html" %}
{% block main %}
    <h2>Meet our Support Staff</h2>
    <div class="row">
        {% for pro in professionals %}
        <div class="col-md-4 text-center mb-4">
            <img src="{{ url_for('static', filename='images/' + pro['image_filename']) }}"
                 style="width: 225px; height: 225px; object-fit: cover; border-radius: 50%;"
                 alt="{{ pro['name'] }}"
                 class="img-fluid mb-3">
            <h3>{{ pro['name'] }}</h3>
            {% if pro['title'] %}
                <p class="text-muted">{{ pro['title'] }}</p>
            {% endif %}
        </div>
        {% endfor %}
    </div>
{% endblock %}