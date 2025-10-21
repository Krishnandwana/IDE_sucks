# CipherStudio - Browser-Based React IDE

A fully-featured browser-based React IDE that allows users to create, edit, and preview React projects in real-time. Built with Next.js, Sandpack, and Express.js.

![CipherStudio](https://img.shields.io/badge/CipherStudio-React_IDE-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## Features

### Core Features ✅

- **File Management**: Create, delete, rename, and organize project files with an intuitive sidebar
- **Rich Code Editor**: Powered by Sandpack (CodeSandbox), with syntax highlighting and IntelliSense
- **Live Preview**: Real-time React component rendering as you type
- **Project Persistence**: Save and load projects using localStorage and MongoDB backend
- **Clean UI/UX**: Modern, intuitive interface inspired by VS Code

### Bonus Features 🎁

- **Theme Switcher**: Toggle between light and dark modes
- **File Rename**: Rename files directly from the sidebar
- **Auto-save**: Toggle auto-save to automatically persist changes every 2 seconds
- **Responsive Design**: Works seamlessly on desktop and tablet screens
- **Projects Management**: View, load, and delete saved projects with metadata
- **Authentication System**: Optional user registration and login (backend ready)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Code Execution** | Sandpack (CodeSandbox) |
| **Editor** | Sandpack Editor with Monaco-like experience |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB (with Mongoose ODM) |
| **Storage** | localStorage (client-side), MongoDB (server-side) |
| **Icons** | Lucide React |

## Project Structure

```
WebBasedIDE/
├── frontend/                  # Next.js frontend application
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main IDE page
│   ├── components/
│   │   ├── Header.tsx        # Top navigation bar
│   │   ├── Sidebar.tsx       # File explorer
│   │   ├── Editor.tsx        # Sandpack editor wrapper
│   │   └── ProjectsModal.tsx # Load projects modal
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts        # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
└── backend/                   # Express.js backend API
    ├── src/
    │   ├── config/
    │   │   └── database.ts   # MongoDB connection
    │   ├── middleware/
    │   │   └── auth.ts       # JWT authentication
    │   ├── models/
    │   │   ├── User.ts       # User schema
    │   │   └── Project.ts    # Project schema
    │   ├── routes/
    │   │   ├── auth.ts       # Auth endpoints
    │   │   └── projects.ts   # Project CRUD endpoints
    │   └── server.ts         # Main server file
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd WebBasedIDE
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

#### 3. Backend Setup (Optional)

The application works fully with localStorage. Backend is optional for cloud persistence.

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
# JWT_SECRET=your-secret-key

npm run dev
```

The backend will run on [http://localhost:5000](http://localhost:5000)

#### 4. Environment Variables

**Backend (.env)**:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Usage Guide

### Creating a New Project

1. Click the **"New"** button in the header
2. Start with a default React template
3. Add files using the **"+"** icon in the sidebar

### Managing Files

- **Create**: Click the "+" icon in the Files section
- **Rename**: Click the edit icon next to any file
- **Delete**: Click the trash icon next to any file
- **Switch**: Click on any file to open it in the editor

### Saving & Loading

- **Save**: Click the "Save" button to persist to localStorage
- **Load**: Click the "Load" button to view all saved projects
- **Auto-save**: Toggle auto-save to automatically save every 2 seconds

### Theme Switching

Click the sun/moon icon in the header to toggle between light and dark modes.

## MongoDB Schema

### Project Schema

```typescript
{
  name: String,              // Project name
  files: {                   // File structure
    [filename: string]: {
      code: string          // File content
    }
  },
  userId: String,           // Optional: Owner ID
  isPublic: Boolean,        // Public/private flag
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema

```typescript
{
  email: String,            // Unique email
  password: String,         // Hashed password
  name: String,             // User name
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Projects

- `GET /api/projects` - Get all accessible projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/user/me` - Get user's projects (auth required)

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Key Design Decisions

### 1. **Sandpack for Code Execution**
- Chose Sandpack over building a custom compiler
- Provides secure, sandboxed React execution
- Built-in preview, hot-reloading, and error handling

### 2. **Dual Persistence Strategy**
- localStorage for instant, offline-first experience
- MongoDB backend for cloud sync and sharing (optional)
- Progressive enhancement approach

### 3. **Next.js App Router**
- Modern React 18 features
- Server components ready for future scaling
- Built-in optimization and routing

### 4. **TypeScript Throughout**
- Type safety for better development experience
- Fewer runtime errors
- Better IDE support

### 5. **Component-Based Architecture**
- Modular, reusable components
- Clear separation of concerns
- Easy to test and maintain

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build

# Deploy to Vercel
vercel deploy --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Backend (Render/Railway)

1. Create a new Web Service on Render or Railway
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables (MONGODB_URI, JWT_SECRET)

## Screenshots

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Light Mode
![Light Mode](screenshots/light-mode.png)

### Projects Modal
![Projects](screenshots/projects.png)

## Future Enhancements

- [ ] Real-time collaboration (WebSocket)
- [ ] Git integration
- [ ] NPM package installation
- [ ] Multiple file types (TypeScript, SCSS)
- [ ] Code formatting (Prettier)
- [ ] Terminal integration
- [ ] Deployment to Vercel/Netlify
- [ ] Templates library
- [ ] Code snippets
- [ ] GitHub import/export

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- [Sandpack](https://sandpack.codesandbox.io/) - For the amazing React execution environment
- [Next.js](https://nextjs.org/) - For the modern React framework
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Lucide](https://lucide.dev/) - For the beautiful icons

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for the coding community**
