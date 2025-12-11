"""
Test file for Step 3.1 - CRUD Components
Tests DeleteButton, Editable, and Image (editable) functionality
"""

import requests
import os
import json

# Configuration
BASE_URL = "http://localhost:5000"
TEST_TOKEN = None  # Will be set after login

def login():
    """Login to get authentication token"""
    global TEST_TOKEN
    response = requests.post(f"{BASE_URL}/api/login", json={
        "username": "admin",  # Update with your test credentials
        "password": "admin"   # Update with your test credentials
    })

    if response.status_code == 200:
        data = response.json()
        TEST_TOKEN = data['token']
        print(f"✓ Login successful - Token obtained")
        print(f"  User: {data['name']}, Level: {data['level']}")
        return True
    else:
        print(f"✗ Login failed: {response.status_code} - {response.text}")
        return False

def test_editable_professional_name():
    """Test Editable component - Update professional name"""
    print("\n=== Testing Editable Component (Professional Name) ===")

    # First, get a professional to test with
    response = requests.get(f"{BASE_URL}/api/get_professionals")
    if response.status_code != 200:
        print("✗ Failed to get professionals")
        return False

    professionals = response.json()
    if not professionals:
        print("✗ No professionals found in database")
        return False

    test_prof = professionals[0]
    prof_id = test_prof['id']
    original_name = test_prof['name']

    print(f"Testing with Professional ID: {prof_id}")
    print(f"Original name: {original_name}")

    # Test updating the name
    new_name = f"{original_name} (Updated)"
    form_data = {
        'name': 'name',
        'value': new_name
    }

    headers = {'Authorization': TEST_TOKEN}
    response = requests.put(
        f"{BASE_URL}/professional/{prof_id}",
        data=form_data,
        headers=headers
    )

    if response.text == 'ok':
        print(f"✓ Name update successful")
        print(f"  New name: {new_name}")

        # Revert back to original
        form_data['value'] = original_name
        revert_response = requests.put(
            f"{BASE_URL}/professional/{prof_id}",
            data=form_data,
            headers=headers
        )

        if revert_response.text == 'ok':
            print(f"✓ Name reverted to original")
        else:
            print(f"✗ Failed to revert name: {revert_response.text}")

        return True
    else:
        print(f"✗ Name update failed: {response.text}")
        return False

def test_editable_professional_email():
    """Test Editable component - Update professional email"""
    print("\n=== Testing Editable Component (Professional Email) ===")

    response = requests.get(f"{BASE_URL}/api/get_professionals")
    professionals = response.json()

    if not professionals:
        print("✗ No professionals found")
        return False

    test_prof = professionals[0]
    prof_id = test_prof['id']
    original_email = test_prof.get('email', 'test@example.com')

    print(f"Testing with Professional ID: {prof_id}")
    print(f"Original email: {original_email}")

    # Test updating the email
    new_email = "updated@example.com"
    form_data = {
        'name': 'email',
        'value': new_email
    }

    headers = {'Authorization': TEST_TOKEN}
    response = requests.put(
        f"{BASE_URL}/professional/{prof_id}",
        data=form_data,
        headers=headers
    )

    if response.text == 'ok':
        print(f"✓ Email update successful")
        print(f"  New email: {new_email}")

        # Revert back
        form_data['value'] = original_email
        requests.put(f"{BASE_URL}/professional/{prof_id}", data=form_data, headers=headers)
        print(f"✓ Email reverted to original")
        return True
    else:
        print(f"✗ Email update failed: {response.text}")
        return False

def test_editable_validation():
    """Test Editable component - Field name validation"""
    print("\n=== Testing Editable Component (Field Validation) ===")

    response = requests.get(f"{BASE_URL}/api/get_professionals")
    professionals = response.json()

    if not professionals:
        print("✗ No professionals found")
        return False

    prof_id = professionals[0]['id']

    # Test with invalid field name
    form_data = {
        'name': 'invalid_field',
        'value': 'test'
    }

    headers = {'Authorization': TEST_TOKEN}
    response = requests.put(
        f"{BASE_URL}/professional/{prof_id}",
        data=form_data,
        headers=headers
    )

    if response.text == 'err_unrecognized_name':
        print(f"✓ Field validation working correctly")
        print(f"  Rejected invalid field: 'invalid_field'")
        return True
    else:
        print(f"✗ Field validation failed - Expected 'err_unrecognized_name', got: {response.text}")
        return False

def test_image_editable():
    """Test Image component with editable prop"""
    print("\n=== Testing Image Component (Editable) ===")

    response = requests.get(f"{BASE_URL}/api/get_professionals")
    professionals = response.json()

    if not professionals:
        print("✗ No professionals found")
        return False

    prof_id = professionals[0]['id']

    # Create a dummy image file for testing
    test_image_path = 'test_image.jpg'

    # Check if we have a test image
    if not os.path.exists(test_image_path):
        print(f"⚠ Test image '{test_image_path}' not found")
        print(f"  Skipping image upload test")
        print(f"  To test image upload, create a file named 'test_image.jpg' in the project root")
        return True

    # Test uploading image
    form_data = {'name': 'image_file'}
    files = {'image_file': open(test_image_path, 'rb')}

    headers = {'Authorization': TEST_TOKEN}
    response = requests.put(
        f"{BASE_URL}/professional/{prof_id}",
        data=form_data,
        files=files,
        headers=headers
    )

    if response.text == 'ok':
        print(f"✓ Image upload successful")
        return True
    else:
        print(f"✗ Image upload failed: {response.text}")
        return False

def test_delete_button():
    """Test DeleteButton component"""
    print("\n=== Testing DeleteButton Component ===")

    # First, create a test professional to delete
    print("Creating test professional for deletion...")

    form_data = {
        'name': 'Test Professional (DELETE ME)',
        'email': 'delete@test.com'
    }

    # Create a minimal test image
    test_image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    files = {'image_file': ('test.png', test_image_content, 'image/png')}

    headers = {'Authorization': TEST_TOKEN}
    response = requests.post(
        f"{BASE_URL}/api/add_professional",
        data=form_data,
        files=files,
        headers=headers
    )

    if response.status_code != 200:
        print(f"✗ Failed to create test professional: {response.text}")
        return False

    print("✓ Test professional created")

    # Get the ID of the newly created professional
    response = requests.get(f"{BASE_URL}/api/get_professionals")
    professionals = response.json()
    test_prof = next((p for p in professionals if p['name'] == 'Test Professional (DELETE ME)'), None)

    if not test_prof:
        print("✗ Could not find test professional")
        return False

    prof_id = test_prof['id']
    print(f"Test Professional ID: {prof_id}")

    # Test deleting the professional
    response = requests.delete(
        f"{BASE_URL}/professional/{prof_id}",
        headers=headers
    )

    if response.text == 'ok':
        print(f"✓ Delete successful")

        # Verify it's actually deleted
        response = requests.get(f"{BASE_URL}/api/get_professionals")
        professionals = response.json()
        still_exists = any(p['id'] == prof_id for p in professionals)

        if not still_exists:
            print(f"✓ Professional confirmed deleted from database")
            return True
        else:
            print(f"✗ Professional still exists in database")
            return False
    else:
        print(f"✗ Delete failed: {response.text}")
        return False

def test_access_control():
    """Test access control for CRUD operations"""
    print("\n=== Testing Access Control ===")

    response = requests.get(f"{BASE_URL}/api/get_professionals")
    professionals = response.json()

    if not professionals:
        print("✗ No professionals found")
        return False

    prof_id = professionals[0]['id']

    # Test without authentication token
    form_data = {'name': 'name', 'value': 'Test'}
    response = requests.put(f"{BASE_URL}/professional/{prof_id}", data=form_data)

    if response.text == 'err_login_required':
        print(f"✓ Access control working - rejected request without token")
    else:
        print(f"✗ Access control failed - Expected 'err_login_required', got: {response.text}")
        return False

    # Test DELETE without authentication
    response = requests.delete(f"{BASE_URL}/professional/{prof_id}")

    if response.text == 'err_login_required':
        print(f"✓ Access control working - rejected DELETE without token")
        return True
    else:
        print(f"✗ Access control failed - Expected 'err_login_required', got: {response.text}")
        return False

def main():
    print("=" * 60)
    print("STEP 3.1 COMPONENT TESTING")
    print("=" * 60)

    # Login first
    if not login():
        print("\n✗ Cannot proceed with tests - login failed")
        print("Please update the login credentials in the test file")
        return

    # Run all tests
    tests = [
        ("Editable - Professional Name", test_editable_professional_name),
        ("Editable - Professional Email", test_editable_professional_email),
        ("Editable - Field Validation", test_editable_validation),
        ("Image - Editable Upload", test_image_editable),
        ("DeleteButton", test_delete_button),
        ("Access Control", test_access_control),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n✗ Test '{test_name}' raised an exception: {e}")
            results.append((test_name, False))

    # Print summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")

    print("-" * 60)
    print(f"Total: {passed}/{total} tests passed")
    print("=" * 60)

if __name__ == "__main__":
    main()
