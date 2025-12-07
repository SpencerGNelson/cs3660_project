import sqlite3
import os

# Get the absolute path to the database file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'company.db')

def update_users_table():
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        # Drop the existing users table
        cur.execute("DROP TABLE IF EXISTS users")

        # Create new users table with UNIQUE constraint on username
        cur.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                account TEXT NOT NULL,
                name TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                level INTEGER,
                password_hash TEXT NOT NULL
            )
        """)

        conn.commit()
        print("Users table updated successfully!")
        print("- Added UNIQUE constraint on username column")
        print("- Table recreated with proper schema")

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    update_users_table()
