# CipherStudio - Quick Start Guide

Get up and running with CipherStudio in under 5 minutes!

## For Windows Users (Easiest)

### Step 1: Install Dependencies
Double-click `install.bat` or run in terminal:
```bash
install.bat
```

This will install all required packages for both frontend and backend.

### Step 2: Start the Application
Double-click `start.bat` or run:
```bash
start.bat
```

This will start both frontend and backend servers in separate windows.

### Step 3: Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

That's it! You're ready to start coding.

---

## Alternative: Manual Start

### Frontend Only (No Backend Required)
```bash
start-frontend.bat
```

The IDE will work fully with localStorage (no database needed).

### Backend Only
```bash
start-backend.bat
```

Note: You need to create `backend\.env` file first (see below).

---

## Backend Configuration (Optional)

CipherStudio works perfectly with localStorage alone. Backend is optional for cloud persistence.

If you want to enable backend features:

### 1. Create Environment File

Copy the example file:
```bash
cd backend
copy .env.example .env
```

### 2. Update MongoDB URI

Edit `backend\.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Get MongoDB Connection String

**Option A: MongoDB Atlas (Free Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster (M0)
4. Get connection string
5. Replace `<username>` and `<password>`

**Option B: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/cipherstudio
```

---

## Building for Production

```bash
build.bat
```

This creates production builds in:
- `frontend\.next`
- `backend\dist`

---

## Available Commands

| Command | Description |
|---------|-------------|
| `install.bat` | Install all dependencies |
| `start.bat` | Start both frontend and backend |
| `start-frontend.bat` | Start frontend only |
| `start-backend.bat` | Start backend only |
| `build.bat` | Build for production |

---

## Manual Installation (All Platforms)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

---

## First Steps After Starting

1. **Create Your First File**
   - Click the "+" icon in the Files sidebar
   - Name it `HelloWorld.js`

2. **Write Some Code**
   ```jsx
   export default function HelloWorld() {
     return <h1>Hello from CipherStudio!</h1>
   }
   ```

3. **See Live Preview**
   - Changes appear instantly in the preview pane

4. **Save Your Project**
   - Click "Save" in the header
   - Project is saved to localStorage

5. **Load Your Project**
   - Click "Load" to see all saved projects
   - Click any project to open it

---

## Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org/ (LTS version recommended)

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in frontend/package.json:
"dev": "next dev -p 3001"
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Backend connection issues
- Check MongoDB URI in `backend\.env`
- Ensure MongoDB is running (if local)
- Check firewall/network settings

---

## Next Steps

- Read the [README.md](README.md) for full documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

## Features at a Glance

- ✅ Create/Delete/Rename files
- ✅ Live React preview
- ✅ Dark/Light theme
- ✅ Auto-save toggle
- ✅ Project management
- ✅ Works offline (localStorage)
- ✅ Optional cloud sync (MongoDB)

---

**Happy Coding!** 🚀
