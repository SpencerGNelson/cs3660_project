{% extends "layout.html" %}
{% block main %}
    <h2>Add Service</h2>

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

    {% if not services %}
        <p class="text-muted">No services found in the database.</p>
    {% else %}
        <div class="row g-4" id="servicesList">
            {% for cat in categories %}
            <div class="col-md-6 col-lg-4" data-category="{{ cat.name }}">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h3 class="h5 mb-0">{{ cat.name }}</h3>
                    </div>
                    <div class="card-body p-0">
                        {% if cat.services %}
                            <div class="list-group list-group-flush">
                                {% for svc in cat.services %}
                                    <div class="list-group-item">{{ svc }}</div>
                                {% endfor %}
                            </div>
                        {% else %}
                            <div class="list-group-item text-muted fst-italic">
                                No services listed
                            </div>
                        {% endif %}
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    {% endif %}
    <HR>
        Add a New Service Below
    <HR>
    <form method="POST" action="/add_service_submit">
        <div>
            Service Name<br>
            <input autocomplete="off" type="text" name="servicename" id="servicename" placeholder="Name">
        </div>
        <div>
            Category<br>
            <input autocomplete="off" type="text" name="category_name" id="category_name" placeholder="Name">
        </div>
        <div>
            <input type="submit">
        </div>
    </form>
{% endblock %}