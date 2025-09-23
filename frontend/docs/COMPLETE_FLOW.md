# Rush Delivery - Complete User Flow Guide

## Overview
This guide explains the complete workflow for using the Rush Delivery platform, from scheduling a pickup to tracking delivery.

## 1. User Registration & Login

### Creating a New Account
1. **Navigate to Login Page**: Go to `/login`
2. **Click "Sign Up"**: Click "Don't have an account? Sign up"
3. **Fill Registration Form**:
   - Enter your email address
   - Create a secure password
   - Click "Create Account"
4. **Verification**: You'll receive a success message and be redirected to the home page

### Using Existing Accounts
- **Admin Account**: `admin@rushdelivery.com` / `admin123`
- **Demo Account**: `demo@rushdelivery.com` / `demo123`
- **New User**: Use your registered email and password

## 2. Scheduling a Pickup

### Step 1: Access Schedule Page
- Click "Schedule Pickup" from the navigation menu
- Or navigate directly to `/schedule`

### Step 2: Fill Contact Information
- **Required Fields** (marked with *):
  - First Name
  - Last Name
  - Email Address
  - Phone Number
- **Optional Fields**:
  - Company name

### Step 3: Enter Pickup Details
- **Pickup Address** (required)
- **City, State, ZIP** (required)
- **Preferred Date & Time** (optional)

### Step 4: Enter Delivery Details
- **Recipient Name** (required)
- **Delivery Address** (required)
- **City, State, ZIP** (required)
- **Recipient Phone** (optional)
- **Company** (optional)

### Step 5: Package Information
- **Package Type** (required): e.g., Documents, Electronics, Clothing
- **Weight** (required): Weight in kg
- **Dimensions** (optional): L x W x H format
- **Quantity** (required): Number of packages
- **Declared Value** (optional): Value in dollars
- **Description** (optional): Package contents

### Step 6: Select Service Type
Choose from:
- **Standard Delivery** (3-5 days) - From $25
- **Express Delivery** (1-2 days) - From $45
- **Urgent Delivery** (Same day) - From $75
- **International Shipping** - From $65

### Step 7: Special Instructions
- Add any special handling notes or instructions

### Step 8: Submit Request
- Click "Schedule Pickup"
- You'll receive a confirmation message
- A customer care representative will contact you within 24 hours

## 3. Tracking Your Package

### Getting Your Tracking ID
After scheduling a pickup, you'll receive:
- **Email confirmation** with tracking details
- **Tracking ID** (e.g., RD123456789)
- **Estimated delivery date**

### Using the Tracking System

#### Basic Tracking (`/tracking`)
1. **Enter Tracking ID**: Type your tracking number
2. **Click "Track Package"**: Get basic tracking information
3. **View Details**:
   - Current status
   - Origin and destination
   - Estimated delivery
   - Current location

#### Advanced Tracking (`/tracking-enhanced`)
1. **Same process as basic tracking**
2. **Additional Features**:
   - Live map with real-time location
   - Detailed tracking history
   - Offline data support
   - Refresh functionality

### Tracking Features

#### Real-time Updates
- Status changes automatically
- Location updates every few minutes
- Delivery notifications

#### Live Map Integration
- **Interactive Map**: Shows current package location
- **Route Visualization**: Displays delivery route
- **Real-time Position**: Updates as the driver moves
- **Offline Support**: Shows last known location when offline

#### Tracking History
- Complete timeline of package journey
- Status changes with timestamps
- Location updates
- Delivery milestones

## 4. Admin Dashboard (Admin Users Only)

### Accessing Admin Features
1. **Login with admin credentials**
2. **Automatic redirect** to `/admin`
3. **Dashboard Overview**:
   - Total shipments
   - Active drivers
   - Revenue today
   - On-time delivery rate

### Admin Capabilities
- **Manage Parcels**: Create, update, delete shipments
- **Driver Management**: Assign drivers, update status
- **Real-time Monitoring**: Live dashboard updates
- **Analytics**: Performance metrics and reports

## 5. Live Map Functionality

### How It Works
1. **GPS Integration**: Uses driver's device GPS
2. **Real-time Updates**: Position updates every 30 seconds
3. **Route Optimization**: Shows optimal delivery routes
4. **Status Integration**: Map reflects current delivery status

### Map Features
- **Current Location**: Blue dot showing exact position
- **Route Lines**: Shows path from pickup to delivery
- **Status Indicators**: Color-coded status markers
- **Zoom Controls**: Navigate and zoom the map
- **Street View**: Detailed street-level view (where available)

### Offline Mode
- **Cached Data**: Shows last known location when offline
- **Offline Indicator**: Clear notification when offline
- **Auto-sync**: Updates when connection is restored

## 6. Troubleshooting

### Common Issues

#### Login Problems
- **Wrong Credentials**: Check email and password
- **Account Not Found**: Register a new account
- **Server Issues**: Wait and try again

#### Tracking Issues
- **Invalid Tracking ID**: Verify the tracking number
- **No Data Found**: Contact support
- **Map Not Loading**: Check internet connection

#### Scheduling Issues
- **Form Validation**: Fill all required fields
- **Server Error**: Try again or contact support
- **No Confirmation**: Check email spam folder

### Getting Help
- **Phone Support**: +1-678-842-3655 (Mon-Fri 8AM-6PM EST)
- **Email Support**: support@rushdelivery.com (24/7)
- **Office Address**: 5955 Eden Drive, Haltom City, TX 76112

## 7. Technical Details

### System Architecture
- **Frontend**: React.js with Vite
- **Backend**: FastAPI with in-memory storage
- **Authentication**: Firebase Auth + JWT tokens
- **Real-time**: WebSocket connections
- **Maps**: Google Maps integration

### Data Security
- **Encrypted Storage**: All sensitive data encrypted
- **Secure Authentication**: JWT-based auth system
- **Data Privacy**: User data protected and compliant

### Performance
- **Fast Loading**: Optimized for quick page loads
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live data synchronization

---

**Need Help?** Contact our support team using the information above. We're here to ensure your delivery experience is smooth and efficient!
