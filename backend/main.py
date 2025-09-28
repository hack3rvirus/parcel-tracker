from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
from firebase_config import initialize_firebase, verify_firebase_token
import os
from typing import List, Dict, Optional

# WebSocket connections list - defined early for use in endpoints
active_connections: List[WebSocket] = []
import uuid
import datetime
import json
import random
import string
from pathlib import Path
import asyncio

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-that-should-be-longer-in-production")
JWT_ALGORITHM = "HS256"

# Initialize Firebase
try:
    initialize_firebase()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")

# Enhanced in-memory storage for demo purposes
# In production, this would be replaced with Firebase
data_store = {
    'users': {},
    'parcels': {},
    'drivers': {},
    'activities': [],
    'alerts': []
}

app = FastAPI(title="Rush Delivery API", version="2.0.0")

# CORS middleware for frontend communication
allowed_origins = os.getenv('ALLOWED_ORIGINS', '').split(',') if os.getenv('ALLOWED_ORIGINS') else []

# Add common development and production origins
default_origins = [
    "http://localhost:3000",      # Vite dev server
    "http://localhost:5173",      # Alternative dev port
    "http://localhost:8000",      # Backend dev server
    "http://127.0.0.1:3000",     # Alternative localhost
    "http://127.0.0.1:5173",     # Alternative localhost
    "https://rushdelivery.netlify.app",  # Netlify deployment
    "https://parcel-track-ih59.onrender.com",  # Render deployment
]

# Combine environment origins with defaults, removing empty strings
all_origins = list(set(allowed_origins + default_origins))
all_origins = [origin.strip() for origin in all_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Static file serving removed for production - frontend deployed separately on Netlify

security = HTTPBearer()

# Password hashing - moved to global scope
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    email: str
    password: str
    role: str = 'client'

class Parcel(BaseModel):
    id: str = str(uuid.uuid4())
    tracking_id: Optional[str] = None
    status: str
    location: Dict[str, float]
    estimated_delivery: str
    sender: str
    receiver: str
    driver_id: Optional[str] = None
    updates: List[Dict] = []
    origin: Optional[str] = None
    destination: Optional[str] = None

class Driver(BaseModel):
    id: str = str(uuid.uuid4())
    name: str
    phone: str
    vehicle_type: str
    current_location: Dict[str, float]
    status: str = 'available'

class DashboardStats(BaseModel):
    total_shipments: int
    active_drivers: int
    revenue_today: float
    on_time_delivery: float

def generate_tracking_id():
    """Generate a unique 16-character base36 tracking ID."""
    while True:
        # Generate 16-character random string using base36 (0-9, A-Z)
        chars = string.ascii_uppercase + string.digits
        tracking_id = ''.join(random.choices(chars, k=16))
        # Check uniqueness against existing parcels
        existing_ids = [p.get('tracking_id') for p in data_store['parcels'].values()]
        if tracking_id not in existing_ids:
            return tracking_id

# Initialize with sample data
def initialize_sample_data():
    # Create sample admin user
    admin_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash("admin123")
    data_store['users'][admin_id] = {
        'email': 'admin@rushdelivery.com',
        'password': hashed_password,
        'role': 'admin',
        'uid': admin_id
    }

    # Create sample demo user
    demo_id = str(uuid.uuid4())
    hashed_demo_password = pwd_context.hash("demo123")
    data_store['users'][demo_id] = {
        'email': 'demo@rushdelivery.com',
        'password': hashed_demo_password,
        'role': 'client',
        'uid': demo_id
    }

    # Create sample drivers
    drivers = [
        Driver(name="John Smith", phone="+1-555-0101", vehicle_type="Van", current_location={"lat": 40.7128, "lng": -74.0060}, status="active"),
        Driver(name="Sarah Johnson", phone="+1-555-0102", vehicle_type="Truck", current_location={"lat": 40.7589, "lng": -73.9851}, status="active"),
        Driver(name="Mike Davis", phone="+1-555-0103", vehicle_type="Van", current_location={"lat": 40.7505, "lng": -73.9934}, status="busy"),
        Driver(name="Lisa Brown", phone="+1-555-0104", vehicle_type="Truck", current_location={"lat": 40.7282, "lng": -73.7949}, status="available"),
        Driver(name="David Wilson", phone="+1-555-0105", vehicle_type="Van", current_location={"lat": 40.7831, "lng": -73.9712}, status="active")
    ]

    for driver in drivers:
        data_store['drivers'][driver.id] = driver.dict()

    # Create sample parcels - only after drivers are added
    driver_ids = list(data_store['drivers'].keys())
    if driver_ids:  # Only create parcels if drivers exist
        sample_parcels = [
            Parcel(
                status="In Transit",
                location={"lat": 40.7589, "lng": -73.9851},
                estimated_delivery=(datetime.datetime.now() + datetime.timedelta(days=2)).isoformat(),
                sender="Tech Corp Inc",
                receiver="Global Solutions LLC",
                driver_id=driver_ids[0]
            ),
            Parcel(
                status="Out for Delivery",
                location={"lat": 40.7505, "lng": -73.9934},
                estimated_delivery=(datetime.datetime.now() + datetime.timedelta(hours=4)).isoformat(),
                sender="Fashion Retail",
                receiver="Sarah Martinez",
                driver_id=driver_ids[1] if len(driver_ids) > 1 else driver_ids[0]
            ),
            Parcel(
                status="Processing",
                location={"lat": 40.7128, "lng": -74.0060},
                estimated_delivery=(datetime.datetime.now() + datetime.timedelta(days=1)).isoformat(),
                sender="Online Store",
                receiver="Michael Chen",
                driver_id=driver_ids[2] if len(driver_ids) > 2 else driver_ids[0]
            ),
            Parcel(
                status="Delivered",
                location={"lat": 40.7282, "lng": -73.7949},
                estimated_delivery=(datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat(),
                sender="Book World",
                receiver="Emily Davis",
                driver_id=driver_ids[3] if len(driver_ids) > 3 else driver_ids[0]
            ),
            Parcel(
                status="In Transit",
                location={"lat": 40.7831, "lng": -73.9712},
                estimated_delivery=(datetime.datetime.now() + datetime.timedelta(days=3)).isoformat(),
                sender="Electronics Plus",
                receiver="David Wilson",
                driver_id=driver_ids[4] if len(driver_ids) > 4 else driver_ids[0]
            )
        ]

        for parcel in sample_parcels:
            # Generate tracking_id for sample parcels
            parcel.tracking_id = generate_tracking_id()
            data_store['parcels'][parcel.id] = parcel.dict()

    # Initialize sample activities and alerts
    data_store['activities'] = [
        {"title": "New shipment RD001238 created", "time": "5 minutes ago", "status": "Success", "type": "success"},
        {"title": "Driver John Smith location updated", "time": "8 minutes ago", "status": "Info", "type": "info"},
        {"title": "Payment processed for RD001237", "time": "12 minutes ago", "status": "Success", "type": "success"},
        {"title": "Customer support ticket resolved", "time": "15 minutes ago", "status": "Success", "type": "success"},
        {"title": "Fleet maintenance reminder", "time": "20 minutes ago", "status": "Warning", "type": "warning"}
    ]

    data_store['alerts'] = [
        {"type": "info", "message": "All systems operational", "time": "Real-time"},
        {"type": "success", "message": "Monthly delivery target achieved", "time": "1 hour ago"},
        {"type": "warning", "message": "2 packages delayed due to traffic", "time": "2 hours ago"}
    ]

# Initialize data on startup
initialize_sample_data()

# Auth Endpoints
@app.post("/register")
async def register(user: User):
    try:
        # Check if user already exists
        for uid, user_data in data_store['users'].items():
            if user_data['email'] == user.email:
                raise HTTPException(400, "User already exists")

        user_id = str(uuid.uuid4())
        hashed_password = pwd_context.hash(user.password)
        user_dict = user.dict()
        user_dict['password'] = hashed_password
        user_dict['uid'] = user_id

        # Store user in memory
        data_store['users'][user_id] = user_dict

        # Add to activities
        data_store['activities'].insert(0, {
            "title": f"New user registered: {user.email}",
            "time": "Just now",
            "status": "Success",
            "type": "success"
        })

        return {"message": "User registered successfully", "uid": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Registration failed: {str(e)}")

@app.post("/login")
async def login(user: User):
    try:
        # Find user by email
        for uid, user_data in data_store['users'].items():
            if user_data['email'] == user.email:
                if pwd_context.verify(user.password, user_data['password']):
                    token = jwt.encode({
                        "uid": uid,
                        "email": user.email,
                        "role": user_data['role']
                    }, JWT_SECRET, algorithm=JWT_ALGORITHM)

                    # Add to activities
                    data_store['activities'].insert(0, {
                        "title": f"User {user.email} logged in",
                        "time": "Just now",
                        "status": "Info",
                        "type": "info"
                    })

                    return {"token": token, "user": {"email": user.email, "role": user_data['role']}}
                break
        raise HTTPException(401, "Invalid credentials")
    except Exception as e:
        raise HTTPException(401, f"Login failed: {str(e)}")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload  # Contains 'uid', 'email', 'role'
    except JWTError:
        raise HTTPException(401, "Invalid token")

def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Check if it's an admin key
        if credentials.credentials == "985d638bafbb39fb":
            return {"role": "admin", "key": credentials.credentials}
        # Otherwise, try JWT token
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('role') != 'admin':
            raise HTTPException(403, "Admin access required")
        return payload  # Contains 'uid', 'email', 'role'
    except JWTError:
        raise HTTPException(401, "Invalid token")

from pydantic import BaseModel

class KeyRequest(BaseModel):
    key: str

@app.post("/admin/verify_key")
async def verify_admin_key(request: KeyRequest):
    if request.key == "985d638bafbb39fb":
        return {"valid": True, "role": "admin"}
    return {"valid": False}

# Dashboard Endpoints
@app.get("/dashboard/stats")
async def get_dashboard_stats(user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin access required")

    parcels = list(data_store['parcels'].values())
    drivers = list(data_store['drivers'].values())

    # Calculate stats
    total_shipments = len(parcels)
    active_drivers = len([d for d in drivers if d['status'] == 'active'])
    delivered_shipments = len([p for p in parcels if p['status'] == 'Delivered'])
    on_time_delivery = round((delivered_shipments / total_shipments) * 100, 1) if total_shipments > 0 else 0

    # Calculate revenue (mock calculation)
    revenue_today = total_shipments * 25 + delivered_shipments * 10

    return {
        "total_shipments": total_shipments,
        "active_drivers": active_drivers,
        "revenue_today": revenue_today,
        "on_time_delivery": on_time_delivery
    }

@app.get("/dashboard/activities")
async def get_recent_activities(user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin access required")

    return data_store['activities'][:10]  # Return last 10 activities

@app.get("/dashboard/alerts")
async def get_alerts(user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin access required")

    return data_store['alerts']

@app.get("/dashboard/shipments")
async def get_active_shipments(user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin access required")

    parcels = list(data_store['parcels'].values())
    active_shipments = [p for p in parcels if p['status'] != 'Delivered']

    # Add driver information
    for shipment in active_shipments:
        if shipment.get('driver_id') and shipment['driver_id'] in data_store['drivers']:
            driver = data_store['drivers'][shipment['driver_id']]
            shipment['driver'] = driver['name']

    return active_shipments[:10]  # Return first 10 active shipments

# Test endpoint for CORS
@app.get("/test")
async def test_cors():
    return {"message": "CORS test successful"}

# Parcel Endpoints
@app.post("/parcels")
async def create_parcel(parcel: Parcel):
    try:
        print(f"Received parcel data: {parcel.dict()}")
        # Allow anyone to create parcels (no authentication required)

        # Generate tracking_id if not provided
        if not parcel.tracking_id:
            parcel.tracking_id = generate_tracking_id()

        # Store parcel in memory
        data_store['parcels'][parcel.id] = parcel.dict()

        # Add to activities
        data_store['activities'].insert(0, {
            "title": f"New shipment {parcel.tracking_id} created",
            "time": "Just now",
            "status": "Success",
            "type": "success"
        })

        # Broadcast update to all connected WebSocket clients
        for conn in active_connections:
            await conn.send_json({
                "type": "new_parcel",
                "data": parcel.dict()
            })

        print(f"Parcel created successfully: {parcel.tracking_id}")
        return parcel
    except Exception as e:
        print(f"Error creating parcel: {str(e)}")
        raise HTTPException(500, f"Internal server error: {str(e)}")

@app.get("/parcels")
async def get_all_parcels(user: Dict = Depends(get_admin_user)):
    return list(data_store['parcels'].values())

@app.get("/parcels/{tracking_id}")
async def get_parcel(tracking_id: str):
    # Public endpoint - no authentication required for tracking
    for parcel_id, parcel_data in data_store['parcels'].items():
        if parcel_data['tracking_id'] == tracking_id:
            # Add driver information if available
            if parcel_data.get('driver_id') and parcel_data['driver_id'] in data_store['drivers']:
                parcel_data['driver'] = data_store['drivers'][parcel_data['driver_id']]['name']
            return parcel_data
    raise HTTPException(404, "Parcel not found")

@app.put("/parcels/{parcel_id}")
async def update_parcel(parcel_id: str, update: Dict, user: Dict = Depends(get_admin_user)):
    if parcel_id not in data_store['parcels']:
        raise HTTPException(404, "Parcel not found")

    # Update parcel data
    data_store['parcels'][parcel_id].update(update)
    updated = data_store['parcels'][parcel_id]

    # Add to activities if status changed
    if 'status' in update:
        data_store['activities'].insert(0, {
            "title": f"Shipment {updated['tracking_id']} status updated to {update['status']}",
            "time": "Just now",
            "status": "Info",
            "type": "info"
        })

    # Broadcast update to all connected WebSocket clients
    for conn in active_connections:
        await conn.send_json({
            "type": "parcel_update",
            "data": updated
        })

    return updated

# Driver Endpoints
@app.get("/drivers")
async def get_drivers(user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin only")
    return list(data_store['drivers'].values())

@app.put("/drivers/{driver_id}")
async def update_driver(driver_id: str, update: Dict, user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin only")
    if driver_id not in data_store['drivers']:
        raise HTTPException(404, "Driver not found")

    # Update driver data
    data_store['drivers'][driver_id].update(update)
    updated = data_store['drivers'][driver_id]

    # Add to activities
    data_store['activities'].insert(0, {
        "title": f"Driver {updated['name']} status updated to {update.get('status', 'unknown')}",
        "time": "Just now",
        "status": "Info",
        "type": "info"
    })

    return updated

# Push notifications - admin-only test endpoint
class PushRequest(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    url: Optional[str] = None

@app.post("/push/test")
async def push_test(req: PushRequest, user: Dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(403, "Admin only")

    # Add to alerts
    data_store['alerts'].insert(0, {
        "type": "info",
        "message": req.body or "Test notification sent",
        "time": "Just now"
    })

    return {
        "message": "Push notification test sent",
        "title": req.title or "Rush Delivery",
        "body": req.body or "This is a test notification.",
        "url": req.url or "/notifications"
    }

# WebSocket connections list - defined early for use in endpoints
from typing import List
active_connections: List[WebSocket] = []

@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    try:
        while True:
            # Send periodic updates to connected clients
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.datetime.now().isoformat(),
                "active_connections": len(active_connections)
            })

            # Send random parcel status updates to simulate real-time activity
            if random.random() < 0.3:  # 30% chance every 10 seconds
                parcels = list(data_store['parcels'].values())
                if parcels:
                    random_parcel = random.choice(parcels)
                    if random_parcel['status'] != 'Delivered':
                        old_status = random_parcel['status']
                        new_status = random.choice(['Processing', 'In Transit', 'Out for Delivery'])
                        if old_status != new_status:
                            random_parcel['status'] = new_status
                            data_store['activities'].insert(0, {
                                "title": f"Shipment {random_parcel['tracking_id']} status updated to {new_status}",
                                "time": "Just now",
                                "status": "Info",
                                "type": "info"
                            })

                            await websocket.send_json({
                                "type": "parcel_update",
                                "data": random_parcel
                            })

            await asyncio.sleep(10)  # Send updates every 10 seconds

    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)

@app.websocket("/ws/{tracking_id}")
async def websocket_endpoint(websocket: WebSocket, tracking_id: str):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming if needed
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# Profile Endpoints
@app.get("/profile")
async def get_profile(user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    user_data = data_store['users'][user_id]
    return {
        'name': user_data.get('name', ''),
        'addresses': user_data.get('addresses', []),
        'default_address_index': user_data.get('default_address_index', 0),
        'prefs': user_data.get('prefs', {'email': True, 'push': False, 'sms': False})
    }

@app.put("/profile")
async def update_profile(update: Dict, user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    # Update user data
    data_store['users'][user_id].update(update)
    updated = data_store['users'][user_id]

    return updated

@app.put("/profile/password")
async def update_password(password_data: Dict, user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    if 'password' not in password_data:
        raise HTTPException(400, "Password is required")

    # Hash the new password
    hashed_password = pwd_context.hash(password_data['password'])
    data_store['users'][user_id]['password'] = hashed_password

    return {"message": "Password updated successfully"}

@app.put("/profile/preferences")
async def update_preferences(prefs_data: Dict, user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    if 'prefs' not in prefs_data:
        raise HTTPException(400, "Preferences are required")

    # Update user preferences
    data_store['users'][user_id]['prefs'] = prefs_data['prefs']

    return {"message": "Preferences updated successfully"}

# Notifications Endpoints
@app.post("/notifications/subscribe")
async def subscribe_notifications(subscription_data: Dict, user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    subscription = subscription_data.get('subscription')
    if not subscription:
        raise HTTPException(400, "Subscription data is required")

    # Store the push subscription
    if 'push_subscriptions' not in data_store['users'][user_id]:
        data_store['users'][user_id]['push_subscriptions'] = []

    data_store['users'][user_id]['push_subscriptions'].append(subscription)

    return {"message": "Successfully subscribed to notifications"}

@app.get("/notifications")
async def get_notifications(user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    # Get user's notifications
    user_notifications = data_store.get('notifications', {}).get(user_id, [])

    return user_notifications

@app.put("/notifications/{notification_id}")
async def update_notification(notification_id: str, update_data: Dict, user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    # Find and update the notification
    if 'notifications' not in data_store:
        data_store['notifications'] = {}

    if user_id not in data_store['notifications']:
        data_store['notifications'][user_id] = []

    for notification in data_store['notifications'][user_id]:
        if notification.get('id') == notification_id:
            notification.update(update_data)
            break

    return {"message": "Notification updated successfully"}

@app.put("/notifications/mark-all-read")
async def mark_all_notifications_read(user: Dict = Depends(get_current_user)):
    user_id = user['uid']
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    # Mark all user's notifications as read
    if 'notifications' not in data_store:
        data_store['notifications'] = {}

    if user_id not in data_store['notifications']:
        data_store['notifications'][user_id] = []

    for notification in data_store['notifications'][user_id]:
        notification['read'] = True

    return {"message": "All notifications marked as read"}

# Admin Endpoints
@app.get("/admin/users")
async def get_all_users(user: Dict = Depends(get_admin_user)):
    # Return all users with their roles and push subscription counts
    users = []
    for user_id, user_data in data_store['users'].items():
        users.append({
            'id': user_id,
            'email': user_data.get('email', ''),
            'role': user_data.get('role', 'client'),
            'tokens': len(user_data.get('push_subscriptions', []))
        })

    return users

@app.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role_data: Dict, user: Dict = Depends(get_admin_user)):
    if user_id not in data_store['users']:
        raise HTTPException(404, "User not found")

    if 'role' not in role_data:
        raise HTTPException(400, "Role is required")

    data_store['users'][user_id]['role'] = role_data['role']

    return {"message": "User role updated successfully"}

@app.post("/push/test")
async def send_test_push(push_data: Dict, user: Dict = Depends(get_admin_user)):
    # Send test push notification to specified user or all users
    target_uid = push_data.get('uid')
    title = push_data.get('title', 'Test Notification')
    body = push_data.get('body', 'This is a test notification')
    url = push_data.get('url', '/notifications')

    sent_count = 0
    total_tokens = 0

    if target_uid:
        # Send to specific user
        if target_uid in data_store['users']:
            user_data = data_store['users'][target_uid]
            subscriptions = user_data.get('push_subscriptions', [])
            total_tokens = len(subscriptions)
            # In a real implementation, you would send push notifications here
            sent_count = total_tokens
    else:
        # Send to all users
        for user_id, user_data in data_store['users'].items():
            subscriptions = user_data.get('push_subscriptions', [])
            total_tokens += len(subscriptions)
            # In a real implementation, you would send push notifications here
            sent_count += len(subscriptions)

    return {
        "message": "Test push notification sent",
        "sent": sent_count,
        "tokens": total_tokens
    }
