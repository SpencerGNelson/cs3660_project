{%extends "layout.html" %}
{% block main %}
    <h2>Sign In</h2>
    <form >
        <div>
            <input autocomplete="off" type="text" name="username" placeholder="Username">
        </div>
         <div>
            <input autocomplete="off" type="password" name="password" placeholder="Password">
        </div>
         <div>
            <input type="submit">
        </div>
    </form>
{% endblock %}