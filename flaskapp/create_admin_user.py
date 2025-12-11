from models import create_admin_user

if __name__ == "__main__":
    username = "superadmin"
    name = "Super Administrator"
    password = "admin123"  # Change this to a secure password

    try:
        user_id = create_admin_user(username, name, password)
        print(f"✓ Successfully created level 3 admin user!")
        print(f"  Username: {username}")
        print(f"  Name: {name}")
        print(f"  Level: 3")
        print(f"  User ID: {user_id}")
        print(f"\nIMPORTANT: Change the password after first login!")
    except Exception as e:
        print(f"✗ Failed to create admin user: {e}")
        print(f"  This user may already exist.")

        #still working on step 3.4, admin login doesn't work
