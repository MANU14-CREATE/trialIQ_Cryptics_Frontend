# Trial IQ - Setup Guide

## Overview
This is a frontend-only clinical trial management system built with React, TypeScript, and Tailwind CSS. All backend calls are currently mocked, making it easy to integrate with any backend of your choice.

## Prerequisites
- Node.js 18+ or Bun
- A backend API (optional for development)

## Local Setup

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Optional: Your backend API URL
VITE_API_URL=http://localhost:3000/api

# Add any other environment variables your backend requires
```

### 3. Run Development Server
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, cards, etc.)
│   ├── dashboards/  # Dashboard modules
│   └── ...          # Feature components
├── pages/           # Page components
├── services/        # Backend integration layer
│   ├── api.ts       # API service (currently mocked)
│   ├── auth.ts      # Authentication service (currently mocked)
│   └── mockData.ts  # Mock data for development
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## Integrating Your Backend

### Authentication Service (`src/services/auth.ts`)

Replace the mock authentication with your backend:

```typescript
async signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    return { user: null, error: 'Invalid credentials' };
  }
  
  const data = await response.json();
  this.currentUser = data.user;
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  
  return { user: data.user, error: null };
}
```

### API Service (`src/services/api.ts`)

Replace the mock API calls with real HTTP requests:

```typescript
private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

## Backend API Requirements

Your backend should implement the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/reset-password` - Password reset

### Resources
Each resource (organizations, sponsors, sites, trials, providers, patients, users) should support:
- `GET /{resource}` - List all
- `GET /{resource}/:id` - Get one
- `POST /{resource}` - Create
- `PUT /{resource}/:id` - Update
- `DELETE /{resource}/:id` - Delete

### User Roles
The system supports these roles:
- `super-admin` - Full system access
- `multi-site-management` - Multi-site management
- `sponsor` - Sponsor management
- `site` - Site administration
- `provider` - Healthcare provider

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  role: 'super-admin' | 'multi-site-management' | 'sponsor' | 'site' | 'provider';
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
}
```

### Sponsor
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
}
```

### Site
```typescript
{
  id: string;
  name: string;
  entity_id: string;
  owner_email: string;
}
```

### Trial
```typescript
{
  id: string;
  name: string;
  nct_id: string;
  status: string;
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
  status: string;
}
```

## Building for Production

```bash
npm run build
# or
bun run build
```

The build output will be in the `dist/` directory.

## Deployment

You can deploy the built application to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## Environment Variables for Production

Set these in your hosting platform:
```env
VITE_API_URL=https://your-api.com/api
```

## Support

For questions or issues, please refer to the project documentation or contact the development team.
