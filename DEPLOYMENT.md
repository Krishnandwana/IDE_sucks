# CipherStudio Deployment Guide

This guide covers deploying CipherStudio to production using free-tier services.

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment Testing](#post-deployment-testing)

---

## Frontend Deployment (Vercel)

Vercel is the recommended platform for deploying Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `frontend` directory as the root

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

---

## Backend Deployment (Render)

Render offers free-tier hosting for backend services.

### Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))

### Steps

1. **Push code to GitHub** (if not already done)

2. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   - Name: `cipherstudio-backend`
   - Root Directory: `backend`
   - Environment: Node
   - Region: Choose closest to your users
   - Branch: `main`

   **Build Command:**
   ```bash
   npm install && npm run build
   ```

   **Start Command:**
   ```bash
   npm start
   ```

4. **Add Environment Variables**

   Go to "Environment" tab and add:

   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<generate-a-secure-secret>
   ```

   To generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your API will be live at `https://your-service.onrender.com`

### Alternative: Railway

Railway is another excellent option:

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository
4. Add environment variables
5. Set root directory to `backend`
6. Deploy

---

## Database Setup (MongoDB Atlas)

MongoDB Atlas provides a free tier (512MB storage).

### Steps

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0 Sandbox)
   - Select cloud provider (AWS recommended)
   - Choose region closest to your backend
   - Cluster name: `CipherStudio`

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `cipherstudio_user`
   - Password: Generate secure password (save this!)
   - User Privileges: Atlas admin or Read/Write to any database

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Allow access from anywhere: `0.0.0.0/0` (for development)
   - Or add Render's IP addresses for production

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority
   ```
   - Replace `<username>` and `<password>` with your credentials

6. **Test Connection**
   ```bash
   # In your backend directory
   echo "MONGODB_URI=<your-connection-string>" > .env
   npm run dev
   ```

---

## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

Update in Vercel:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_API_URL`

### Backend Environment Variables

Create `backend/.env` (for local development):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
JWT_SECRET=your-generated-secret-key
```

Add to Render/Railway:
- Same variables as above
- Set `NODE_ENV=production`

---

## Connecting Frontend to Backend

Update `frontend/app/page.tsx` to use backend API:

```typescript
// Add API client
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Update saveProject function
const saveProject = async () => {
  try {
    const projectData = {
      name: currentProject?.name || `Project ${generateId().slice(0, 8)}`,
      files,
      isPublic: false
    }

    // Save to backend
    if (currentProject?.id) {
      await axios.put(`${API_URL}/projects/${currentProject.id}`, projectData)
    } else {
      const response = await axios.post(`${API_URL}/projects`, projectData)
      setCurrentProject(response.data)
    }

    // Also save to localStorage as backup
    localStorage.setItem(`project_${projectData.id}`, JSON.stringify(projectData))

    alert('Project saved successfully!')
  } catch (error) {
    console.error('Save failed:', error)
    alert('Failed to save project to server, saved locally instead')
    // Fallback to localStorage only
  }
}
```

---

## CORS Configuration

Ensure backend allows requests from your frontend domain:

```typescript
// backend/src/server.ts
import cors from 'cors'

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.vercel.app',
  'https://your-custom-domain.com'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

---

## Post-Deployment Testing

### 1. Test Frontend
- Visit your Vercel URL
- Create a new file
- Write some React code
- Verify live preview works
- Test theme switching

### 2. Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Create project
curl -X POST https://your-backend.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "files": {
      "/App.js": {
        "code": "export default function App() { return <div>Hello</div> }"
      }
    }
  }'
```

### 3. Test Database
- Go to MongoDB Atlas
- Browse Collections
- Verify projects are being saved

### 4. Test Full Flow
1. Create new project in frontend
2. Add files
3. Save project
4. Check MongoDB Atlas - verify project exists
5. Reload page
6. Load project - verify files are restored

---

## Monitoring & Maintenance

### Vercel
- Monitor builds: Dashboard → Deployments
- View logs: Click on deployment → View Logs
- Analytics: Dashboard → Analytics

### Render/Railway
- View logs: Dashboard → Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts for downtime

### MongoDB Atlas
- Monitor cluster: Dashboard → Metrics
- View logs: Dashboard → Logs
- Set up alerts: Dashboard → Alerts

---

## Troubleshooting

### Frontend Issues

**Build fails on Vercel:**
- Check build logs for errors
- Verify all dependencies are in `package.json`
- Ensure TypeScript errors are fixed

**API calls fail:**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify CORS is configured on backend
- Check browser console for errors

### Backend Issues

**Server won't start:**
- Check environment variables are set
- Verify MongoDB connection string
- Check logs for errors

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist
- Check username/password in connection string
- Ensure cluster is running

**CORS errors:**
- Add frontend domain to allowed origins
- Check CORS middleware is configured

---

## Cost Optimization

All services have free tiers:

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Vercel | Free | 100GB bandwidth/month |
| Render | Free | 750 hours/month |
| Railway | Free | $5 credit/month |
| MongoDB Atlas | Free | 512MB storage |

**Tips:**
- Use localStorage as primary storage to reduce database calls
- Implement request caching
- Optimize bundle size
- Enable Vercel Edge Functions for faster response

---

## Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Environment variables set (not in code)
- [ ] CORS configured with specific origins
- [ ] MongoDB IP whitelist configured
- [ ] JWT secret is strong and secure
- [ ] Rate limiting enabled (future)
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info

---

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Render/Railway
1. Go to Deployments
2. Find previous working deployment
3. Click "Rollback"

### Database
- Use MongoDB Atlas backups
- Go to Clusters → Backup
- Restore from backup

---

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Congratulations!** Your CipherStudio IDE is now live and accessible to users worldwide. 🎉
