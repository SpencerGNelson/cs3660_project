import sqlite3
import json
from collections import defaultdict
from email.message import EmailMessage
import smtplib
import getpass
from flask import render_template, request
import os
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import functools

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'company.db')

JWT_SECRET_KEY = 'your-secret-key-change-this-in-production'
JWT_ALGORITHM = 'HS256'

def email_form(name, phone, email, subject, message):
    username = getpass.getuser()
    email_to = '10654678@uvu.edu'
    email_from = f"{username}@host71.registrar-serviers.com"
    email_subject = f"Contact Form: {subject}"
    email_message = render_template("contact_email.html",
                                    name = name,
                                    phone = phone,
                                    email = email,
                                    subject = subject,
                                    message = message)
    
    msg = EmailMessage()
    msg.set_content(email_message, subtype='html')
    msg['Subject'] = email_subject
    msg['From'] = email_from
    msg['To'] = email_to
    try:
        s = smtplib.SMTP('localhost')
        s.send_message(msg)
        s.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def get_professionals():
    conn = None

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        query = """
        SELECT * FROM professionals
        """
        cur.execute(query)
        rows = cur.fetchall()  
        conn.close()      
        return rows

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def get_categories():
    conn = None

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        query = """
        SELECT * FROM categories
        """
        cur.execute(query)
        rows = cur.fetchall()  
        conn.close()      
        return rows

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()


def get_services():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id   INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
    """)

    cur.execute("SELECT id, name FROM categories ORDER BY id")
    categories = [dict(row) for row in cur.fetchall()]

   
    cur.execute("SELECT categoryid, servicename FROM services ORDER BY id")
    flat_services = [dict(row) for row in cur.fetchall()]

    conn.close()
   
    grouped = defaultdict(list)
    for s in flat_services:
        grouped[s['categoryid']].append(s['servicename'])

    result = []
    for cat in categories:
        cat_id = cat['id']
        result.append({
            'id': cat_id,
            'name': cat['name'],
            'services': grouped[cat_id]
        })

    return result

def add_user(username, name, level, password):
    account = username
    password_hash = generate_password_hash(password)

    query = """
        INSERT INTO users (account, name, username, level, password_hash)
        VALUES (?, ?, ?, ?, ?)
        """

    values = (account, name, username, level, password_hash)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def check_login(username, password):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        query = "SELECT id, username, name, level, password_hash FROM users WHERE username = ?"
        cur.execute(query, (username,))
        row = cur.fetchone()

        if row is None:
            return None

        stored_hash = row['password_hash']
        if check_password_hash(stored_hash, password):
            # Return user info if password matches
            return {
                'id': row['id'],
                'username': row['username'],
                'name': row['name'],
                'level': row['level']
            }
        else:
            return None

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def create_login_token(user_info):
    # Set expiration to 30 minutes from now
    expiration = datetime.utcnow() + timedelta(minutes=30)

    # Create JWT payload with user information
    payload = {
        'id': user_info['id'],
        'username': user_info['username'],
        'name': user_info['name'],
        'level': user_info['level'],
        'exp': expiration
    }

    # Encode the token
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def get_loggedin_user(token):
    try:
        # Decode the token
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])

        # Return user info from token (no database query needed)
        return {
            'id': payload['id'],
            'username': payload['username'],
            'name': payload['name'],
            'level': payload['level']
        }
    except jwt.ExpiredSignatureError:
        # Token has expired
        raise Exception("err_login_expired")
    except jwt.InvalidTokenError:
        # Token is invalid
        raise Exception("err_login_invalid")

def access_required(level):
    def decorator(f):
        @functools.wraps(f)  # preserves important metadata
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return "err_login_required"
            try:
                user = get_loggedin_user(token)
            except Exception as e:
                return str(e)
            if not user:
                return "err_login_required"
            if user["level"] < level:
                return "err_access_denied"
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def add_professional(name, email, ext):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        query = """
            INSERT INTO professionals (name, email, image_filename)
            VALUES (?, ?, ?)
        """
        cur.execute(query, (name, email, ''))
        professional_id = cur.lastrowid

        full_filename = f"professional{professional_id}.{ext}"
        update_query = "UPDATE professionals SET image_filename = ? WHERE id = ?"
        cur.execute(update_query, (full_filename, professional_id))

        conn.commit()
        return professional_id

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def add_category(name, ext):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        query = """
            INSERT INTO categories (name, image_filename)
            VALUES (?, ?)
        """
        cur.execute(query, (name, ''))
        category_id = cur.lastrowid

        full_filename = f"category{category_id}.{ext}"
        update_query = "UPDATE categories SET image_filename = ? WHERE id = ?"
        cur.execute(update_query, (full_filename, category_id))

        conn.commit()
        return category_id

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def add_service(categoryid, servicename):
    query = """
        INSERT INTO services (categoryid, servicename)
        VALUES (?, ?)
        """ 
    
    values = (categoryid, servicename)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid          
    
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_professional_name(professional_id, new_name):
    query = """
        UPDATE professionals
        SET name = ?
        WHERE  id = ?
        """
    values = (new_name, professional_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid
    
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_professional_email(professional_id, new_email):
    query = """
        UPDATE professionals
        SET email = ?
        WHERE  id = ?
        """
    values = (new_email, professional_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid
    
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_professional_image(professional_id, ext):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        
        cur.execute("SELECT image_filename FROM professionals WHERE id = ?", (professional_id,))
        row = cur.fetchone()
        if row and row[0]:
            old_filepath = os.path.join(BASE_DIR, 'static', 'images', row[0])
            if os.path.exists(old_filepath):
                os.remove(old_filepath)  
        
        full_filename = f"professional{professional_id}.{ext}"
        cur.execute("UPDATE professionals SET image_filename = ? WHERE id = ?",
                   (full_filename, professional_id))
        conn.commit()

        return full_filename

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def delete_professional(professional_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT image_filename FROM professionals WHERE id = ?", (professional_id,))
        row = cur.fetchone()

        if row and row[0]:
            filepath = os.path.join(BASE_DIR, 'static', 'images', row[0])
            if os.path.exists(filepath):
                os.remove(filepath)

        cur.execute("DELETE FROM professionals WHERE id = ?", (professional_id,))
        conn.commit()

        return True

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_category_name(category_id, new_name):
    query = """
        UPDATE categories
        SET name = ?
        WHERE id = ?
    """
    values = (new_name, category_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_category_image(category_id, ext):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT image_filename FROM categories WHERE id = ?", (category_id,))
        row = cur.fetchone()
        if row and row[0]:
            old_filepath = os.path.join(BASE_DIR, 'static', 'images', row[0])
            if os.path.exists(old_filepath):
                os.remove(old_filepath)

        full_filename = f"category{category_id}.{ext}"
        cur.execute("UPDATE categories SET image_filename = ? WHERE id = ?",
                   (full_filename, category_id))
        conn.commit()

        return full_filename

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def delete_category(category_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT image_filename FROM categories WHERE id = ?", (category_id,))
        row = cur.fetchone()

        cur.execute("DELETE FROM services WHERE categoryid = ?", (category_id,))

        cur.execute("DELETE FROM categories WHERE id = ?", (category_id,))

        if row and row[0]:
            filepath = os.path.join(BASE_DIR, 'static', 'images', row[0])
            if os.path.exists(filepath):
                os.remove(filepath)

        conn.commit()
        return True

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_service_name(service_id, new_servicename):
    query = """
        UPDATE services
        SET servicename = ?
        WHERE id = ?
    """
    values = (new_servicename, service_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_service_category(service_id, new_categoryid):
    query = """
        UPDATE services
        SET categoryid = ?
        WHERE id = ?
    """
    values = (new_categoryid, service_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def delete_service(service_id):
    query = "DELETE FROM services WHERE id = ?"

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, (service_id,))
        conn.commit()
        return True

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_user_name(user_id, new_name):
    query = """
        UPDATE users
        SET name = ?
        WHERE id = ?
    """
    values = (new_name, user_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_user_level(user_id, new_level):
    query = """
        UPDATE users
        SET level = ?
        WHERE id = ?
    """
    values = (new_level, user_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_user_password(user_id, new_password):
    password_hash = generate_password_hash(new_password)

    query = """
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
    """
    values = (password_hash, user_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def update_user_username(user_id, new_username):
    query = """
        UPDATE users
        SET username = ?
        WHERE id = ?
"""
    values = (new_username, user_id)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        return cur.lastrowid
    
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close() 

def delete_user(user_id):
    query = "DELETE FROM users WHERE id = ?"

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(query, (user_id,))
        conn.commit()
        return True

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()