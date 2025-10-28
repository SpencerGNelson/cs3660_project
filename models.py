import sqlite3

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

        professionals = [dict(row) for row in cur.fetchall()]
        return professionals

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def get_services():
    conn = None

    try:
        conn = sqlite3.connect('company.db')
        conn.row_factory = sqlite3.Row

        cur = conn.cursor()

        query = """
        SELECT * FROM services
        """

        cur.execute(query)

        services = [dict(row) for row in cur.fetchall()]
        return services

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

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