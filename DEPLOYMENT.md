# 🚀 Rush Delivery - Deployment Guide

This guide covers deployment to multiple platforms: **Hostinger**, **Netlify**, **Render**, and **Independent Hosting**.

## 📋 Prerequisites

### 1. Environment Variables Setup
Copy the appropriate environment files and configure them:

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.development
cp frontend/.env.example frontend/.env.production
```

**Backend:**
```bash
cp backend/.env.example backend/.env.development
cp backend/.env.example backend/.env.production
```

### 2. Required Environment Variables

#### Frontend Variables
- `VITE_API_URL` - Your backend API URL
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_GA_ID` - Google Analytics ID (optional)

#### Backend Variables
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase service account JSON
- `JWT_SECRET` - JWT signing secret
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

## 🏗️ Platform-Specific Deployment

### Option 1: Netlify (Frontend Only)

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/your-username/rush-delivery.git
   cd rush-delivery
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables: Set your production variables

3. **Backend Setup**
   - Deploy backend separately to Render or another platform
   - Update `VITE_API_URL` in Netlify environment variables

### Option 2: Render (Full-Stack)

1. **Deploy Backend First**
   ```bash
   # Connect backend folder to Render
   # Use render.yaml configuration
   ```

2. **Deploy Frontend**
   ```bash
   # Connect frontend folder to Render
   # Use render.yaml configuration
   ```

3. **Environment Variables**
   - Backend: Set Firebase credentials and JWT secret
   - Frontend: API URL will be auto-configured via service discovery

### Option 3: Hostinger (Traditional Hosting)

1. **Backend Setup**
   ```bash
   # Upload backend files to Hostinger
   # Install Python dependencies
   pip install -r requirements.txt

   # Configure environment variables
   # Start with: uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**
   ```bash
   # Build frontend
   npm run build

   # Upload dist folder to Hostinger public_html
   # Configure web server to serve index.html for SPA routing
   ```

### Option 4: Independent Setup (Development)

1. **Start Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔧 Configuration Files

### Netlify Configuration (`frontend/netlify.toml`)
- SPA routing redirects
- Security headers
- Cache optimization
- Environment setup

### Render Configuration (`render.yaml`)
- Separate frontend/backend services
- Environment variable management
- Service discovery

### Vite Configuration (`frontend/vite.config.js`)
- Build optimization
- Environment variable handling
- Asset management

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)

2. **DNS Configuration**
   ```
   A Record: @ -> Your server IP
   CNAME: www -> your-domain.com
   ```

3. **SSL Certificate**
   - Enable HTTPS in your hosting platform
   - Most platforms provide free SSL certificates

4. **Update Environment Variables**
   ```env
   VITE_API_URL=https://your-api-domain.com
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in backend
   - Verify frontend URL in environment variables

2. **API Connection Issues**
   - Verify `VITE_API_URL` points to correct backend
   - Check if backend is running and accessible

3. **Build Failures**
   - Ensure all environment variables are set
   - Check Node.js version compatibility
   - Verify Firebase configuration

4. **Routing Issues**
   - Ensure SPA routing is configured in hosting platform
   - Check `_redirects` file for Netlify

### Health Checks

1. **Frontend Health**
   - Visit your site URL
   - Check browser console for errors
   - Verify all pages load correctly

2. **Backend Health**
   - Test API endpoints with curl:
     ```bash
     curl https://your-api-domain.com/docs
     ```
   - Check CORS headers:
     ```bash
     curl -I -H "Origin: https://your-frontend-domain.com" https://your-api-domain.com/
     ```

## 📊 Monitoring & Analytics

### Performance Monitoring
- Use Google Analytics (already configured)
- Monitor Core Web Vitals
- Set up error tracking (Sentry, LogRocket)

### API Monitoring
- Monitor response times
- Track error rates
- Set up alerting for downtime

## 🔒 Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set secure headers (CSP, HSTS)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] API rate limiting
- [ ] Input validation and sanitization

## 📞 Support

For deployment issues:
1. Check this documentation first
2. Review platform-specific documentation
3. Check application logs
4. Contact platform support if needed

## 🚀 Quick Start Commands

### Development
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && pip install -r requirements.txt
```

---

**Last Updated**: $(date)
**Version**: 1.0.0
