# Backend Integration Guide

## Complete Backend Removal

All backend-specific code (Supabase, Edge Functions) has been removed. The application now uses a clean service layer architecture that can integrate with any backend.

## Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │
│   (Components/UI)   │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│  Service Layer      │
│  ┌────────────────┐ │
│  │ auth.ts        │ │  ← Authentication logic
│  ├────────────────┤ │
│  │ api.ts         │ │  ← API calls
│  ├────────────────┤ │
│  │ mockData.ts    │ │  ← Development data
│  └────────────────┘ │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Your Backend      │
│   (Any technology)  │
└─────────────────────┘
```

## Service Files

### 1. Authentication (`src/services/auth.ts`)

**Current State**: Mock implementation with localStorage
**To Implement**: Replace with your backend API calls

```typescript
// Example: Express.js backend
async signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('https://your-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    return { user: null, error: data.message };
  }
  
  // Store token for authenticated requests
  localStorage.setItem('auth_token', data.token);
  this.currentUser = data.user;
  
  return { user: data.user, error: null };
}
```

### 2. API Service (`src/services/api.ts`)

**Current State**: Returns mock data
**To Implement**: Make real HTTP requests

```typescript
class ApiService {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:3000/api';
  
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }
  
  // Use the request method for all endpoints
  async getOrganizations() {
    return this.request<Organization[]>('/organizations');
  }
  
  async createOrganization(data: CreateOrganizationDto) {
    return this.request<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

### 3. Mock Data (`src/services/mockData.ts`)

**Purpose**: Development data
**Usage**: Reference this file for data structure expectations

## Backend Requirements

Your backend should implement these endpoints:

### Authentication Endpoints

```
POST   /auth/register      - Create new user account
POST   /auth/login         - Authenticate user
POST   /auth/logout        - End user session
POST   /auth/refresh       - Refresh auth token
POST   /auth/reset-password - Send password reset email
```

**Request/Response Examples**:

```typescript
// POST /auth/login
Request: { email: string, password: string }
Response: {
  user: {
    id: string;
    email: string;
    role: 'super-admin' | 'multi-site-management' | 'sponsor' | 'site' | 'provider';
  };
  token: string;  // JWT or session token
}

// POST /auth/register
Request: {
  email: string;
  password: string;
  role: string;
}
Response: { user: User; token: string }
```

### Resource Endpoints

For each resource (organizations, sponsors, sites, trials, providers, patients):

```
GET    /{resource}          - List all (with pagination)
GET    /{resource}/:id      - Get single item
POST   /{resource}          - Create new
PUT    /{resource}/:id      - Update existing
DELETE /{resource}/:id      - Delete item
```

### Query Parameters

```
GET /organizations?page=1&limit=20&search=medical&sort=name
```

### Response Format

```typescript
// List endpoints
{
  data: Resource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

// Single resource
{
  data: Resource;
}

// Error response
{
  error: {
    message: string;
    code: string;
  }
}
```

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  role: 'super-admin' | 'multi-site-management' | 'sponsor' | 'site' | 'provider';
  created_at: string;
}
```

### Organization
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
  created_at: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}
```

### Sponsor
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
  created_at?: string;
}
```

### Site
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
  location?: string;
  specialty?: string[];
  created_at?: string;
}
```

### Trial
```typescript
{
  id: string;
  name: string;
  nct_id: string;
  status: 'active' | 'recruiting' | 'completed' | 'suspended';
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}
```

### Provider
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
  specialty: string;
  created_at?: string;
}
```

### Patient
```typescript
{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'eligible' | 'contacted' | 'screened' | 'enrolled' | 'completed';
  created_at?: string;
}
```

## Implementation Steps

### 1. Set Up Your Backend

Choose your stack:
- **Node.js**: Express, NestJS, Fastify
- **Python**: Django, FastAPI, Flask
- **Ruby**: Rails, Sinatra
- **Go**: Gin, Echo
- **Java**: Spring Boot
- **PHP**: Laravel, Symfony

### 2. Database Setup

Create tables for:
- users
- organizations
- sponsors
- sites
- trials
- providers
- patients
- user_roles
- user_entity_associations (for role-based access)

### 3. Implement Authentication

- JWT tokens (recommended)
- Session-based auth
- OAuth (Google, Microsoft, etc.)

### 4. Add Authorization

Role-based access control:
- Super Admin: Full access
- Multi-Site Management: Organization-level access
- Sponsor: Trial and site matching
- Site: Trial and patient management
- Provider: Patient care

### 5. Update Frontend Services

Replace mock implementations in:
- `src/services/auth.ts`
- `src/services/api.ts`

### 6. Configure Environment Variables

Create `.env.local`:
```env
VITE_API_URL=https://your-api.com/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_LOGGING=true
```

### 7. Test Integration

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Security Considerations

1. **Always use HTTPS** in production
2. **Validate JWT tokens** on every request
3. **Implement rate limiting** to prevent abuse
4. **Sanitize user inputs** to prevent SQL injection/XSS
5. **Use CORS properly** - whitelist your frontend domain
6. **Hash passwords** using bcrypt/argon2
7. **Implement CSRF protection** for sensitive operations
8. **Log security events** for audit trails

## CORS Configuration

Your backend must allow requests from your frontend:

```javascript
// Express.js example
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8080', 'https://your-domain.com'],
  credentials: true
}));
```

## Error Handling

Frontend expects this error format:

```typescript
{
  error: {
    message: string;
    code?: string;
    details?: any;
  }
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Testing Your Integration

1. **Test authentication flow**
   - Register new user
   - Login
   - Logout
   - Password reset

2. **Test resource CRUD**
   - Create
   - Read (list and single)
   - Update
   - Delete

3. **Test authorization**
   - Role-based access
   - User can only see their data

4. **Test error scenarios**
   - Invalid credentials
   - Expired tokens
   - Network errors
   - Rate limiting

## Support

See `SETUP.md` for local development setup.

For questions, refer to:
- API documentation
- Data models above
- Example implementations in service files
