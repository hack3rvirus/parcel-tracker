# Fix 404 Errors on Render Deployment

If you're getting `404 (Not Found)` errors when accessing your Render deployment, follow this troubleshooting guide:

## 🔍 Common Causes & Solutions

### 1. **Service Not Deployed or Not Running**
**Check**: Go to your Render dashboard and verify:
- ✅ Service status shows "Live"
- ✅ Build completed successfully
- ✅ No error messages in logs

**Fix**: If service is not live:
1. Trigger a new deployment
2. Check build logs for errors
3. Verify all environment variables are set

### 2. **Build Command Issues**
**Problem**: Frontend build might be failing silently

**Check**: In Render dashboard:
1. Go to your frontend service
2. Check "Build Logs" tab
3. Look for errors during `npm install` or `npm run build`

**Fix**: Update your `render.yaml` build command:
```yaml
buildCommand: cd frontend && npm ci && npm run build
```

### 3. **Single Service Configuration (Recommended)**
**Problem**: Separate frontend/backend services causing routing issues

**Solution**: Use a single Python service that serves both the React app and API:

**Update `backend/main.py`:**
```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Serve static files from React build
app.mount("/static", StaticFiles(directory="frontend/dist/static"), name="static")

# Serve favicon
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("frontend/dist/favicon.ico")

# Serve index.html for all other routes (SPA support)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Skip API routes
    if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json"]:
        raise HTTPException(status_code=404, detail="Not Found")
    return FileResponse("frontend/dist/index.html")
```

**Update `render.yaml`:**
```yaml
services:
  - type: web
    name: parcel-tracker
    env: python
    plan: free
    buildCommand: cd frontend && npm ci && npm run build && cd ../backend && pip install -r requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: VITE_API_URL
        value: https://parcel-trackerr.onrender.com
      # ... other env vars
```

**Alternative**: If you prefer separate services, use the static site configuration with proper SPA routing.

### 4. **Missing Environment Variables**
**Problem**: Frontend can't load without Firebase config

**Check**: Ensure these are set in Render dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### 5. **Service Discovery Issues**
**Problem**: Frontend can't find backend API

**Check**: In your `render.yaml`:
```yaml
envVars:
  - key: VITE_API_URL
    fromService:
      type: web
      name: delivery-backend
      property: host
```

## 🛠️ Quick Fix Steps

### Step 1: Check Service Status
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Find your services (should be `delivery-frontend` and `delivery-backend`)
3. Check if both show "Live" status

### Step 2: Redeploy Services
1. For each service, click "Manual Deploy" → "Deploy latest commit"
2. Wait for deployment to complete
3. Check the live URL

### Step 3: Verify Build Logs
1. Click on your frontend service
2. Go to "Logs" tab
3. Look for any error messages during build

### Step 4: Test Backend First
1. Try accessing your backend URL directly
2. Should show FastAPI docs at `/docs`
3. If backend works, the issue is with frontend

### Step 5: Check Environment Variables
1. In Render dashboard, go to your frontend service
2. Click "Environment" tab
3. Verify all Firebase variables are set

## 🔧 Manual Testing Commands

Test your deployment locally first:

```bash
# Test frontend build
cd frontend
npm install
npm run build

# Test backend
cd backend
pip install -r requirements.txt
python3 -c "from main import app; print('Backend OK')"
```

## 📊 Debug Your Live Site

1. **Check if service is responding**:
   ```bash
   curl -I https://your-service-name.onrender.com
   ```

2. **Check backend health**:
   ```bash
   curl https://your-backend-service.onrender.com/docs
   ```

3. **Check frontend files**:
   ```bash
   curl https://your-frontend-service.onrender.com/logo.png
   ```

## 🚨 If Still Not Working

### Option 1: Recreate Services
1. Delete both services in Render dashboard
2. Push your code to GitHub again
3. Create new services using the updated `render.yaml`

### Option 2: Check for Typos
- Verify service names in `render.yaml` match exactly
- Check environment variable names for typos
- Ensure Firebase config values are correct

### Option 3: Contact Render Support
- Check [Render Status Page](https://status.render.com)
- Contact Render support if issue persists

## 📝 Prevention Tips

1. **Always test locally first** using `./deploy-check.sh`
2. **Use environment-specific configs** for different deployment stages
3. **Monitor your services** in Render dashboard regularly
4. **Set up alerts** for service downtime

## 🎯 Expected Result

After fixing, you should see:
- ✅ Frontend: `https://your-frontend-service.onrender.com` loads your app
- ✅ Backend: `https://your-backend-service.onrender.com/docs` shows API docs
- ✅ No 404 errors in browser console
