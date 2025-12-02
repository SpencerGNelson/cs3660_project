import sqlite3
import json
from collections import defaultdict
from email.message import EmailMessage
import smtplib
import getpass
from flask import render_template

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
        conn = sqlite3.connect('company.db')
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
        conn = sqlite3.connect('company.db')
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
    conn = sqlite3.connect('company.db')
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

    query = """
        INSERT INTO users (account, name, username, level, password_hash)
        VALUES (?, ?, ?, ?, ?)
        """ 
    
    values = (account, username, name, level, password)
    
    conn = None
    try:
        conn = sqlite3.connect('company.db')
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

def add_professional(name, email, ext):
    conn = None
    try:
        conn = sqlite3.connect('company.db')
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
        conn = sqlite3.connect('company.db')
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
        conn = sqlite3.connect('company.db')
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