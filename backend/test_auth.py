#!/usr/bin/env python3
"""
Test script for Rush Delivery authentication endpoints
Run this script to verify that login and registration are working correctly
"""

import requests
import json

# Backend URL - adjust if running on different port
BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("Testing user registration...")

    payload = {
        "email": "test@example.com",
        "password": "test123",
        "role": "client"
    }

    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Registration successful!")
            return True
        else:
            print("❌ Registration failed!")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting user login...")

    payload = {
        "email": "test@example.com",
        "password": "test123"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json().get('token')
        else:
            print("❌ Login failed!")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_admin_login():
    """Test admin login"""
    print("\nTesting admin login...")

    payload = {
        "email": "admin@rushdelivery.com",
        "password": "admin123"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Admin login successful!")
            return response.json().get('token')
        else:
            print("❌ Admin login failed!")
            return None
    except Exception as e:
        print(f"❌ Admin login error: {e}")
        return None

def test_demo_login():
    """Test demo user login"""
    print("\nTesting demo user login...")

    payload = {
        "email": "demo@rushdelivery.com",
        "password": "demo123"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Demo login successful!")
            return response.json().get('token')
        else:
            print("❌ Demo login failed!")
            return None
    except Exception as e:
        print(f"❌ Demo login error: {e}")
        return None

def test_parcel_tracking(token):
    """Test parcel tracking with authentication"""
    print("\nTesting parcel tracking...")

    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(f"{BASE_URL}/parcels/RD001234", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Parcel tracking successful!")
            return True
        else:
            print("❌ Parcel tracking failed!")
            return False
    except Exception as e:
        print(f"❌ Parcel tracking error: {e}")
        return False

def main():
    print("🚀 Rush Delivery Authentication Test Suite")
    print("=" * 50)

    # Test registration
    test_register()

    # Test logins
    admin_token = test_admin_login()
    demo_token = test_demo_login()

    # Test parcel tracking with admin token
    if admin_token:
        test_parcel_tracking(admin_token)

    print("\n" + "=" * 50)
    print("✅ Test suite completed!")
    print("\n📋 Available test accounts:")
    print("   Admin: admin@rushdelivery.com / admin123")
    print("   Demo:  demo@rushdelivery.com / demo123")

if __name__ == "__main__":
    main()
