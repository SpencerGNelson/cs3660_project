import sqlite3
import json
from collections import defaultdict

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

def add_professional(name, email, image_filename):
    query = """
        INSERT INTO professionals (name, email, image_filename)
        VALUES (?, ?, ?)
        """ 
    
    values = (name, email, image_filename)
    
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

def add_category(name, image_filename):
    query = """
        INSERT INTO categories (name, image_filename)
        VALUES (?, ?)
        """ 
    
    values = (name, image_filename)
    
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