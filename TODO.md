# Delivery Website Enhancement TODO

## 1. Enhanced Tracking ID Generation
- [x] Implement random 16-character base36 tracking ID generation in backend
- [x] Ensure each parcel gets unique tracking ID until delivered
- [x] Update Parcel model and create_parcel endpoint

## 2. Redesign Admin Dashboard for Real-time Functionality
- [x] Ensure parcel list updates immediately when new parcels are created
- [x] Implement status changes (pending, on the way, delivered, etc.) with real-time updates
- [x] Add parcel selection and status manipulation
- [x] Ensure location manipulation reflects on map and to users
- [x] Remove any non-essential features, keep core functionality only

## 3. Enhanced LiveMap Component
- [x] Add crosshair cursor visual feedback in edit mode
- [x] Ensure click-to-set location works perfectly
- [x] Real-time parcel position updates via WebSocket
- [x] Admin can manipulate parcel positions and it shows to users

## 4. Update Routing for Production
- [x] Configure SPA routing to prevent 404 errors
- [x] Update _redirects file for Netlify deployment
- [x] Ensure all routes work correctly

## 5. Testing & Verification
- [x] Test tracking ID generation and uniqueness
- [x] Verify real-time admin dashboard updates
- [x] Test live map editing and position manipulation
- [x] Confirm routing works in production
