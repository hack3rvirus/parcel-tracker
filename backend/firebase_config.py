import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
def initialize_firebase():
    try:
        # Check if Firebase is already initialized
        firebase_admin.get_app()
    except ValueError:
        # Firebase not initialized, so initialize it
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # For development, you can use environment variables
            # In production, use service account key file
            firebase_admin.initialize_app()

def verify_firebase_token(token: str):
    """Verify Firebase ID token and return decoded token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid Firebase token: {str(e)}")

def create_custom_token(uid: str):
    """Create a custom token for a user"""
    try:
        custom_token = auth.create_custom_token(uid)
        return custom_token
    except Exception as e:
        raise ValueError(f"Failed to create custom token: {str(e)}")
