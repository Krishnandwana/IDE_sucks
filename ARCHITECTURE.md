# CipherStudio Architecture Documentation

## High-Level Architecture

CipherStudio follows a modern full-stack architecture with clear separation between client and server:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │  │
│  │  │  Header  │  │ Sidebar  │  │  Editor (Sandpack)│    │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         State Management (React Hooks)          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────┐         ┌──────────────────────┐    │  │
│  │  │ localStorage│         │    API Client (Axios) │    │  │
│  │  └─────────────┘         └──────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      Express.js Backend                       │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    Middleware Layer                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │  │   CORS   │  │   JSON   │  │   Auth (JWT)     │    │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    Route Handlers                      │   │
│  │  ┌─────────────────┐  ┌─────────────────────────┐    │   │
│  │  │ Auth Routes     │  │  Project Routes         │    │   │
│  │  │ - Register      │  │  - CRUD Operations      │    │   │
│  │  │ - Login         │  │  - List/Filter          │    │   │
│  │  └─────────────────┘  └─────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                  Data Access Layer                     │   │
│  │  ┌─────────────────┐  ┌─────────────────────────┐    │   │
│  │  │  User Model     │  │  Project Model          │    │   │
│  │  │  (Mongoose)     │  │  (Mongoose)             │    │   │
│  │  └─────────────────┘  └─────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      MongoDB Atlas                             │
│  ┌────────────────────┐    ┌────────────────────────┐        │
│  │  Users Collection  │    │  Projects Collection   │        │
│  └────────────────────┘    └────────────────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Save Button
│   ├── Load Button
│   ├── New Project Button
│   ├── Auto-save Toggle
│   └── Theme Toggle
│
├── Sidebar
│   ├── File List
│   │   ├── File Item
│   │   │   ├── Rename Input
│   │   │   └── Delete Button
│   │   └── ...
│   └── New File Input
│
├── Editor (Sandpack)
│   ├── Code Editor Panel
│   └── Preview Panel
│
└── ProjectsModal (conditional)
    └── Project List
        ├── Project Item
        │   └── Delete Button
        └── ...
```

### State Management

CipherStudio uses React's built-in state management with hooks:

```typescript
// Main state in page.tsx
const [files, setFiles] = useState<FileStructure>()      // All project files
const [activeFile, setActiveFile] = useState<string>()   // Currently open file
const [theme, setTheme] = useState<'light' | 'dark'>()   // UI theme
const [currentProject, setCurrentProject] = useState()    // Loaded project
const [autoSave, setAutoSave] = useState<boolean>()      // Auto-save toggle
```

### Data Flow

1. **User Action** → Component Event Handler
2. **Event Handler** → Update State via setState
3. **State Update** → React Re-renders Affected Components
4. **Side Effects** → useEffect hooks trigger (auto-save, localStorage)

### Storage Strategy

**localStorage Structure:**
```
localStorage
├── lastProjectId: "abc123"
├── project_abc123: { id, name, files, createdAt, updatedAt }
├── project_def456: { ... }
└── projects: [{ id, name, files, createdAt, updatedAt }, ...]
```

## Backend Architecture

### Layer Separation

```
Request → Middleware → Routes → Controllers → Models → Database
```

### Request Flow

1. **Client sends HTTP request**
2. **CORS middleware** validates origin
3. **Body parser** parses JSON payload
4. **Auth middleware** (optional) validates JWT token
5. **Route handler** processes request
6. **Model** interacts with database
7. **Response** sent back to client

### Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │  Server  │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │  POST /register    │                     │
     ├───────────────────>│                     │
     │                    │  Hash Password      │
     │                    │                     │
     │                    │  Save User          │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │<────────────────────│
     │                    │  Generate JWT       │
     │  Token + User      │                     │
     │<───────────────────│                     │
     │                    │                     │
     │  Subsequent Requests                     │
     │  (with Authorization header)             │
     ├───────────────────>│                     │
     │                    │  Verify JWT         │
     │                    │  Extract userId     │
     │                    │                     │
```

## Sandpack Integration

Sandpack provides the code execution environment:

```typescript
<Sandpack
  template="react"           // Base React template
  theme={theme}              // Light/dark theme
  files={files}              // All project files
  options={{
    activeFile: activeFile,  // Currently visible file
    showTabs: true,          // File tabs
    showLineNumbers: true,   // Line numbers
    // ... more options
  }}
/>
```

### How Sandpack Works

1. **Bundling**: Sandpack uses a WebAssembly-based bundler to process files
2. **Transpilation**: JSX/ES6+ code is transpiled to browser-compatible JavaScript
3. **Module Resolution**: Imports are resolved (React, ReactDOM, etc.)
4. **Iframe Rendering**: Output is rendered in an isolated iframe
5. **Hot Reload**: Changes trigger automatic re-bundling and preview update

## Performance Optimizations

### Frontend

1. **Code Splitting**: Next.js automatically splits routes
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive renders (if needed)
4. **Debouncing**: Auto-save uses setTimeout to debounce changes
5. **Virtual Scrolling**: For large file lists (future enhancement)

### Backend

1. **Indexing**: MongoDB indexes on userId and updatedAt
2. **Pagination**: API supports limit/offset (future)
3. **Caching**: Could add Redis for frequently accessed projects
4. **Connection Pooling**: Mongoose handles connection pooling

## Security Considerations

### Frontend

1. **XSS Prevention**: React automatically escapes values
2. **HTTPS Only**: Enforce HTTPS in production
3. **Content Security Policy**: Sandpack iframes are sandboxed

### Backend

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Short expiration times (7 days)
3. **CORS**: Whitelist allowed origins
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Could add rate limiting middleware
6. **SQL/NoSQL Injection**: Mongoose sanitizes queries

## Scalability

### Current Architecture

- **Vertical Scaling**: Add more CPU/RAM to server
- **Horizontal Scaling**: Deploy multiple server instances
- **Load Balancing**: Use NGINX or cloud load balancer
- **Database Replication**: MongoDB replica sets

### Future Enhancements

1. **CDN**: Serve static assets via CDN
2. **Caching Layer**: Redis for session/project caching
3. **Message Queue**: For background jobs (e.g., file processing)
4. **Microservices**: Split auth, projects, etc. into separate services
5. **WebSocket**: For real-time collaboration

## Technology Choices Rationale

### Why Next.js?
- Server-side rendering capabilities (future)
- Excellent developer experience
- Built-in optimizations
- Large community and ecosystem

### Why Sandpack?
- Battle-tested by CodeSandbox
- Secure sandboxing
- Excellent React support
- Active maintenance

### Why MongoDB?
- Flexible schema for file structures
- Easy to scale
- Great developer experience with Mongoose
- Cloud-ready with Atlas

### Why TypeScript?
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Industry standard

## Error Handling

### Frontend

```typescript
try {
  await saveProject()
} catch (error) {
  console.error('Save failed:', error)
  alert('Failed to save project')
}
```

### Backend

```typescript
router.post('/projects', async (req, res) => {
  try {
    // Handle request
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
```

## Testing Strategy

### Frontend Testing
- Unit tests: Component logic (Jest)
- Integration tests: User flows (React Testing Library)
- E2E tests: Full user journeys (Playwright/Cypress)

### Backend Testing
- Unit tests: Route handlers (Jest)
- Integration tests: API endpoints (Supertest)
- Database tests: Model validation (Jest + MongoDB Memory Server)

## Deployment Architecture

```
┌──────────────┐
│   Vercel     │ ← Frontend (Next.js)
│   (CDN)      │
└──────┬───────┘
       │
       │ API Calls
       │
┌──────▼───────┐
│   Render/    │ ← Backend (Express.js)
│   Railway    │
└──────┬───────┘
       │
       │ MongoDB Driver
       │
┌──────▼───────┐
│  MongoDB     │ ← Database
│  Atlas       │
└──────────────┘
```

## Monitoring & Observability

### Metrics to Track
- Response times
- Error rates
- User activity
- Database query performance
- Storage usage

### Tools (Future)
- Sentry for error tracking
- LogRocket for user sessions
- Datadog/New Relic for APM
- MongoDB Atlas monitoring

---

This architecture is designed to be simple yet scalable, prioritizing developer experience while maintaining production-ready practices.
