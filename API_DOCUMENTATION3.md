# Postman API Documentation

Complete API documentation for Trial IQ Backend with all endpoints, request/response formats, and authentication requirements.

## 📥 Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Trial_IQ_Backend.postman_collection.json`
4. The collection will be imported with all endpoints ready to use

## 🔧 Setup Environment Variables

Create a Postman Environment with these variables:

- `base_url`: `http://localhost:4000` (or your server URL)
- `access_token`: (will be auto-populated after login)

## 🔐 Authentication

Most endpoints require authentication via JWT Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

**Getting an Access Token:**
1. Login using `/api/auth/login` endpoint
2. Copy the `accessToken` from the response
3. Set it in your Postman environment variable `access_token`
4. The collection will automatically use this token for protected endpoints

---

## 📡 API Endpoints

### Health Check

#### GET `/health`

Check if the server is running (Public endpoint).

**Headers:** None required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔑 Authentication Endpoints

### Register User

#### POST `/api/auth/register`

Register a new user account (Public endpoint).

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

**Note:** At least one of `email` or `phone` must be provided. Both are optional individually but at least one is required.

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "phone": "+1234567890",
      "role_id": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": [...]
  }
}
```

---

### Login User

#### POST `/api/auth/login`

Login with email/phone/identifier and password. Returns access token and sets refresh token in HTTP-only cookie (Public endpoint).

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - Option 1 (Using identifier):**
```json
{
  "identifier": "user@test.com",
  "password": "user123"
}
```

**Body (JSON) - Option 2 (Using email):**
```json
{
  "email": "user@test.com",
  "password": "user123"
}
```

**Body (JSON) - Option 3 (Using phone):**
```json
{
  "phone": "+1234567890",
  "password": "user123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@test.com",
      "phone": "+1234567890",
      "role_id": "uuid",
      "role": {
        "id": "uuid",
        "name": "super_admin",
        "permissions": [...]
      },
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** The `refreshToken` is automatically set as an HTTP-only cookie. Save the `accessToken` for subsequent requests.

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email/phone or password"
  }
}
```

---

### Refresh Token

#### POST `/api/auth/refresh`

Refresh the access token using the refresh token from cookie (Public endpoint).

**Headers:** None required (uses HTTP-only cookie)

**Note:** You must have logged in first to set the refresh token cookie.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Refresh token not provided"
  }
}
```

---

### Logout User

#### POST `/api/auth/logout`

Logout user by clearing the refresh token cookie (Public endpoint).

**Headers:** None required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 User Endpoints (Protected)

### Business Rules

The Users Module enforces the following business rules:

1. **Role Assignment**: 
   - If you are `super_admin` or `app_manager`, you can assign any role
   - Otherwise, you can only assign roles that you created
2. **Permission Assignment**: 
   - You can only assign permissions for modules that you have access to
   - You cannot assign higher permissions than you currently hold
   - Permissions are defined per module with format: `{module_name, can_view, can_edit, can_update, can_create, can_delete}`
3. **User Access**: You can only view/update/delete users whose roles were created by you
4. **System Roles**: Users with `super_admin` or `app_manager` roles can access all users and assign any roles/permissions

---

### Get Current User

#### GET `/api/users/me`

Get information about the currently authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** None required (authenticated users only)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@test.com",
      "phone": "+1234567890",
      "role_id": "uuid",
      "role": {...},
      "organization": {...},
      "sponsor": {...},
      "site": {...},
      "provider": {...},
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Create User

#### POST `/api/users`

Create a new user with role and permissions.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `users:create`

**Body (JSON):**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "role_id": "uuid",
  "permissions": [
    {
      "module_name": "Users",
      "can_view": true,
      "can_create": false,
      "can_edit": false,
      "can_update": false,
      "can_delete": false
    },
    {
      "module_name": "Roles",
      "can_view": true,
      "can_create": true,
      "can_edit": true,
      "can_update": true,
      "can_delete": false
    }
  ]
}
```

**Note:** 
- `email` and `phone` are optional, but at least one must be provided
- `password` is required (minimum 6 characters)
- `role_id` is required
- `permissions` is optional. If provided, it will update the role's permissions for the specified modules
- `can_update` maps to `can_edit` internally (both are supported for API compatibility)
- If you are `super_admin` or `app_manager`, you can assign any role; otherwise, you can only assign roles you created
- You can only assign permissions for modules you have access to
- You cannot assign higher permissions than you currently hold

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "phone": "+1234567890",
      "role_id": "uuid",
      "role": {
        "id": "uuid",
        "name": "custom-role",
        "permissions": [...]
      },
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "You can only assign roles that you created"
  }
}
```

**Note:** `super_admin` and `app_manager` users will not receive this error as they can assign any role.

---

### Get All Users

#### GET `/api/users`

Get all users in the system. Returns only users whose roles were created by you (unless you are `super_admin` or `app_manager`).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `users:view`

**Note:** 
- Regular users can only see users whose roles they created
- `super_admin` and `app_manager` can see all users

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "phone": "+1234567890",
        "role_id": "uuid",
        "role": {...},
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get User by ID

#### GET `/api/users/:id`

Get a specific user by ID. You can only access users whose roles were created by you (unless you are `super_admin` or `app_manager`).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `users:view`

**Note:** Returns 404 if the user doesn't exist or you don't have permission to access them.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+1234567890",
      "role_id": "uuid",
      "role": {...},
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "User not found or you do not have permission to access this user"
  }
}
```

---

### Update User

#### PUT `/api/users/:id`

Update user information. You can only update users whose roles were created by you (unless you are `super_admin` or `app_manager`).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `users:edit`

**Body (JSON):**
```json
{
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "role_id": "uuid",
  "permissions": [
    {
      "module_name": "Users",
      "can_view": true,
      "can_create": true,
      "can_edit": true,
      "can_update": true,
      "can_delete": false
    }
  ]
}
```

**Note:** 
- All fields are optional
- If `role_id` is provided: if you are `super_admin` or `app_manager`, you can assign any role; otherwise, you can only assign roles you created
- If `permissions` is provided, it will update the role's permissions for the specified modules
- You can only assign permissions for modules you have access to
- You cannot assign higher permissions than you currently hold
- You can only update users whose roles you created

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {...}
  }
}
```

**Error Response (400/404):**
```json
{
  "success": false,
  "error": {
    "message": "You cannot assign higher permissions than you currently hold"
  }
}
```

---

### Delete User

#### DELETE `/api/users/:id`

Delete a user from the system. You can only delete users whose roles were created by you (unless you are `super_admin` or `app_manager`).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `users:delete`

**Note:** Returns 404 if the user doesn't exist or you don't have permission to delete them.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "User not found or you do not have permission to delete this user"
  }
}
```

---

## 📦 Module Endpoints (Protected)

### Get All Modules

#### GET `/api/modules`

Get all modules in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `modules:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "id": "uuid",
        "name": "users",
        "description": "User management module",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Module by ID

#### GET `/api/modules/:id`

Get a specific module by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `modules:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "module": {...}
  }
}
```

---

### Create Module

#### POST `/api/modules`

Create a new module.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `modules:create` or `super_admin`

**Body (JSON):**
```json
{
  "name": "module_name",
  "description": "Module description"
}
```

**Note:** `description` is optional.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "module": {...}
  }
}
```

---

### Update Module

#### PUT `/api/modules/:id`

Update a module.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `modules:edit` or `super_admin`

**Body (JSON):**
```json
{
  "name": "updated_name",
  "description": "Updated description"
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Module updated successfully",
  "data": {
    "module": {...}
  }
}
```

---

### Delete Module

#### DELETE `/api/modules/:id`

Delete a module.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `modules:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

---

## 🎭 Role Endpoints (Protected)

### Get All Roles

#### GET `/api/roles`

Get all roles in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `entity_type` (optional): Filter by entity type (`none`, `organization`, `sponsor`, `site`, `provider`)
- `entity_id` (optional): Filter by entity ID

**Permission:** `roles:view`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "uuid",
        "name": "super_admin",
        "description": "Super administrator role",
        "entity_type": "none",
        "entity_id": null,
        "permissions": [...],
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Role by ID

#### GET `/api/roles/:id`

Get a specific role by ID with permissions.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `roles:view`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "role": {
      "id": "uuid",
      "name": "custom-role",
      "description": "Custom role description",
      "entity_type": "organization",
      "entity_id": "uuid",
      "permissions": [
        {
          "id": "uuid",
          "module_id": "uuid",
          "module": {
            "id": "uuid",
            "name": "users",
            "description": "User management module"
          },
          "can_view": true,
          "can_create": true,
          "can_edit": true,
          "can_delete": false
        }
      ],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Create Role

#### POST `/api/roles`

Create a new role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `roles:create`

**Body (JSON):**
```json
{
  "name": "custom-role",
  "description": "Custom role description",
  "entity_type": "none",
  "entity_id": "uuid",
  "permissions": [
    {
      "module_id": "uuid",
      "can_view": true,
      "can_create": false,
      "can_edit": false,
      "can_delete": false
    }
  ]
}
```

**Note:** 
- `description`, `entity_id`, and `permissions` are optional
- `entity_type` defaults to `"none"` if not provided
- Valid `entity_type` values: `"none"`, `"organization"`, `"sponsor"`, `"site"`, `"provider"`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role": {...}
  }
}
```

---

### Update Role

#### PUT `/api/roles/:id`

Update a role (name, description, entity_type, entity_id).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `roles:edit`

**Body (JSON):**
```json
{
  "name": "updated-role-name",
  "description": "Updated description",
  "entity_type": "organization",
  "entity_id": "uuid"
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "role": {...}
  }
}
```

---

### Update Role Permissions

#### PUT `/api/roles/:id/permissions`

Update permissions for a role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `roles:edit`

**Body (JSON):**
```json
{
  "permissions": [
    {
      "module_id": "uuid",
      "can_view": true,
      "can_create": true,
      "can_edit": true,
      "can_delete": false
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role permissions updated successfully",
  "data": {
    "role": {...}
  }
}
```

---

### Delete Role

#### DELETE `/api/roles/:id`

Delete a role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `roles:delete`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

---

## 🏢 Organization Endpoints (Protected)

### Get All Organizations

#### GET `/api/organizations`

Get all organizations in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "address": "123 Corp St",
        "description": "An organization",
        "contact_person_name": "John Doe",
        "contact_person_phone": "555-1234",
        "contact_person_email": "john.doe@org.com",
        "is_active": true,
        "user": {},
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Organization by ID

#### GET `/api/organizations/:id`

Get a specific organization by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "organization": {
        "id": "uuid",
        "user_id": "uuid",
        "address": "123 Corp St",
        "description": "An organization",
        "contact_person_name": "John Doe",
        "contact_person_phone": "555-1234",
        "contact_person_email": "john.doe@org.com",
        "is_active": true,
        "user": {},
        "documents": [],
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Create Organization

#### POST `/api/organizations`

Create a new organization. This will automatically create a user with `organization_admin` role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `organizations:create` or `super_admin`

**Body (JSON):**
```json
{
  "name": "New Org",
  "email": "org@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Corp St",
  "description": "An organization",
  "contact_person_name": "John Doe",
  "contact_person_phone": "555-1234",
  "contact_person_email": "john.doe@org.com",
  "is_active": true
}
```

**Note:** `name`, `email`, and `password` are required. All other fields are optional.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization": {
      "id": "uuid",
      "user_id": "uuid",
      "user": {
        "id": "uuid",
        "name": "New Org",
        "email": "org@example.com",
        "phone": "+1234567890",
        "role": {
          "name": "organization_admin"
        }
      }
    }
  }
}
```

---

### Update Organization

#### PUT `/api/organizations/:id`

Update an organization's details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `organizations:edit` or `super_admin`

**Body (JSON):**
```json
{
  "name": "Updated Org Name",
  "phone": "+1112223333",
  "address": "456 Updated Street",
  "description": "An updated organization description",
  "contact_person_name": "Jane Doe",
  "contact_person_phone": "555-5678",
  "contact_person_email": "jane.doe@org.com",
  "is_active": false
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "organization": {}
  }
}
```

---

### Delete Organization

#### DELETE `/api/organizations/:id`

Delete an organization.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

---

### Organization Documents

---

**Body (Multipart/Form-Data):**
- `documents`: The file(s) to upload (PDF, DOC, DOCX, JPG, PNG, max 50MB).
- `document_names`: (array of strings, required) The names of the documents. Must be in the same order as the files.
- `document_tags`: (array of strings, optional) Comma-separated tags for each document. Must be in the same order as the files.

**Note:** The `documents`, `document_names`, and `document_tags` arrays must have the same length. A `document_name` is required for every entry you want to create, even if no file is uploaded for that entry. If no file is provided for a given entry, a document record will be created with just the name and tags.


**Success Response (201):**
```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "document_name": "My Document",
  "document_type": "PDF",
  "document_tags": "report, quarterly",
  "document_url": "uploads/document-167... .pdf",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/api/organizations/:organizationId/documents`

Get all documents for an organization.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:view` or `super_admin`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "organization_id": "uuid",
    "document_name": "My Document",
    "document_type": "PDF",
    "document_tags": "report, quarterly",
    "document_url": "uploads/document-167... .pdf",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/organizations/:organizationId/documents/:id`

Get a specific document by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:view` or `super_admin`

**Success Response (200):**
```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "document_name": "My Document",
  "document_type": "PDF",
  "document_tags": "report, quarterly",
  "document_url": "uploads/document-167... .pdf",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

#### PUT `/api/organizations/:organizationId/documents/:id`

Update a document's details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `organizations:edit` or `super_admin`

**Body (JSON):**
```json
{
  "document_name": "Updated Document Name",
  "document_tags": "new, tags"
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "document_name": "Updated Document Name",
  "document_tags": "new, tags"
}
```

---

#### DELETE `/api/organizations/:organizationId/documents/:id`

Delete a document. This also deletes the file from the server.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `organizations:delete` or `super_admin`

**Success Response (204):** No content.


---

## 💼 Sponsor Endpoints (Protected)

### Get All Sponsors

#### GET `/api/sponsors`

Get all sponsors in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "sponsors": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "address": "123 Sponsor St",
        "is_active": true,
        "user": {},
        "documents": [],
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Sponsor by ID

#### GET `/api/sponsors/:id`

Get a specific sponsor by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "sponsor": {
      "id": "uuid",
      "user_id": "uuid",
      "address": "123 Sponsor St",
      "is_active": true,
      "user": {},
      "documents": [],
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Create Sponsor

#### POST `/api/sponsors`

Create a new sponsor. This will automatically create a user with `sponsor_admin` role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `sponsors:create` or `super_admin`

**Body (JSON):**
```json
{
  "email": "sponsor@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Sponsor St",
  "is_active": true
}
```

**Note:** `phone`, `address`, and `is_active` are optional. The system will create a user with `sponsor_admin` role automatically.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sponsor created successfully",
  "data": {
    "sponsor": {
      "id": "uuid",
      "user_id": "uuid",
      "user": {
        "id": "uuid",
        "email": "sponsor@example.com",
        "phone": "+1234567890",
        "role": {
          "name": "sponsor_admin",
          ...
        }
      },
      ...
    }
  }
}
```

---

### Update Sponsor

#### PATCH `/api/sponsors/:id` it is PUT not PATCH

Update a sponsor's details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `sponsors:edit` or `super_admin`

**Body (JSON):**
```json
{
  "address": "456 Updated Street",
  "is_active": false
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sponsor updated successfully",
  "data": {
    "sponsor": {}
  }
}
```

---

### Delete Sponsor

#### DELETE `/api/sponsors/:id`

Delete a sponsor.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sponsor deleted successfully"
}
```

---

### Sponsor Documents

---

#### POST `/api/sponsors/:sponsorId/documents`

Upload a document for a sponsor.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body (Multipart/Form-Data):**
- `documents`: The file(s) to upload (PDF, DOC, DOCX, JPG, PNG, max 50MB).
- `document_names`: (array of strings, required) The names of the documents. Must be in the same order as the files.
- `document_tags`: (array of strings, optional) Comma-separated tags for each document. Must be in the same order as the files.

**Note:** The `documents`, `document_names`, and `document_tags` arrays must have the same length. A `document_name` is required for every entry you want to create, even if no file is uploaded for that entry. If no file is provided for a given entry, a document record will be created with just the name and tags.

**Permission:** `sponsors:edit` or `super_admin`

**Success Response (201):**
```json
{
  "id": "uuid",
  "sponsor_id": "uuid",
  "document_name": "My Document",
  "document_type": "PDF",
  "document_tags": "report, quarterly",
  "document_url": "uploads/document-167... .pdf",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/api/sponsors/:sponsorId/documents`

Get all documents for a sponsor.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:view` or `super_admin`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "sponsor_id": "uuid",
    "document_name": "My Document",
    "document_type": "PDF",
    "document_tags": "report, quarterly",
    "document_url": "uploads/document-167... .pdf",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/sponsors/:sponsorId/documents/:id`

Get a specific document by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:view` or `super_admin`

**Success Response (200):**
```json
{
  "id": "uuid",
  "sponsor_id": "uuid",
  "document_name": "My Document",
  "document_type": "PDF",
  "document_tags": "report, quarterly",
  "document_url": "uploads/document-167... .pdf",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

#### PUT `/api/sponsors/:sponsorId/documents/:id`

Update a document's details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `sponsors:edit` or `super_admin`

**Body (JSON):**
```json
{
  "document_name": "Updated Document Name",
  "document_tags": "new, tags"
}
```

**Note:** All fields are optional.

**Success Response (200):**
```json
{
  "id": "uuid",
  "sponsor_id": "uuid",
  "document_name": "Updated Document Name",
  "document_tags": "new, tags"
}
```

---

#### DELETE `/api/sponsors/:sponsorId/documents/:id`

Delete a document. This also deletes the file from the server.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sponsors:delete` or `super_admin`

**Success Response (204):** No content.


---

## 🏥 Site Endpoints (Protected)

### Get All Sites

#### GET `/api/sites`

Get all sites in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `organization_id` (optional): Filter sites by organization ID

**Permission:** `sites:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "sites": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "user": {...},
        "organization_id": "uuid",
        "organization": {...},
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Site by ID

#### GET `/api/sites/:id`

Get a specific site by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sites:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "site": {...}
  }
}
```

---

### Create Site

#### POST `/api/sites`

Create a new site. This will automatically create a user with `site_manager` role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `sites:create` or `super_admin`

**Body (JSON):**
```json
{
  "email": "site@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "organization_id": "uuid",
  "address": "123 Clinical Trial Lane",
  "contact_person_name": "Dr. Smith",
  "contact_person_phone": "+0987654321",
  "contact_person_email": "dr.smith@example.com",
  "contact_person_location": "Building C, Suite 100",
  "is_active": true
}
```

**Note:** `phone`, `organization_id`, and all contact/address fields are optional. The system will create a user with `site_manager` role automatically.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Site created successfully",
  "data": {
    "site": {...}
  }
}
```

---

### Update Site

#### PUT `/api/sites/:id`

Update a site. You can update the user's email/phone and the site's organization.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `sites:edit` or `super_admin`

**Body (JSON):**
```json
{
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "organization_id": "uuid",
  "address": "456 Research Parkway",
  "contact_person_name": "Dr. Jones",
  "contact_person_phone": "+1122334455",
  "contact_person_email": "dr.jones@example.com",
  "contact_person_location": "Main Campus, West Wing",
  "is_active": false
}
```

**Note:** All fields are optional. You can update the user's email/phone along with the site's organization and contact details.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Site updated successfully",
  "data": {
    "site": {
      "id": "uuid",
      "user": {
        "email": "newemail@example.com",
        "phone": "+1234567890",
        ...
      },
      "organization_id": "uuid",
      ...
    }
  }
}
```

---

### Delete Site

#### DELETE `/api/sites/:id`

Delete a site.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `sites:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Site deleted successfully"
}
```

---

## 👨‍⚕️ Provider Endpoints (Protected)

### Get All Providers

#### GET `/api/providers`

Get all providers in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `site_id` (optional): Filter providers by site ID

**Permission:** `providers:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "user": {...},
        "site_id": "uuid",
        "site": {...},
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Provider by ID

#### GET `/api/providers/:id`

Get a specific provider by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `providers:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "provider": {...}
  }
}
```

---

### Create Provider

#### POST `/api/providers`

Create a new provider. This will automatically create a user with `provider` role.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `providers:create` or `super_admin`

**Body (JSON):**
```json
{
  "email": "provider@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "site_id": "uuid",
  "speciality": "Cardiology",
  "is_active": true
}
```

**Note:** `phone`, `site_id`, `speciality`, and `is_active` are optional. The system will create a user with `provider` role automatically.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Provider created successfully",
  "data": {
    "provider": {...}
  }
}
```

---

### Update Provider

#### PUT `/api/providers/:id`

Update a provider. You can update the user's email/phone and the provider's site.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `providers:edit` or `super_admin`

**Body (JSON):**
```json
{
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "site_id": "uuid",
  "speciality": "Neurology",
  "is_active": false
}
```

**Note:** All fields are optional. You can update the user's email/phone along with the provider's site, speciality and status.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Provider updated successfully",
  "data": {
    "provider": {
      "id": "uuid",
        "user": {
          "email": "newemail@example.com",
          "phone": "+1234567890",
          ...
        },
      "site_id": "uuid",
      ...
    }
  }
}
```

---

### Delete Provider

#### DELETE `/api/providers/:id`

Delete a provider.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `providers:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Provider deleted successfully"
}
```

---

## 🤕 Patient Endpoints (Protected)

### Business Rules

The Patients Module enforces the following business rules:

1.  **Patient Access**:
    -   `super_admin` and `app_manager` can access all patients.
    -   Users can only access patients they created.
    -   Users can access patients belonging to sites that are part of their entity relations (e.g., an organization can access patients from its sites).
2.  **Site ID Assignment**:
    -   When creating or updating a patient, users can only assign a `site_id` that belongs to their entity relations.
    -   `super_admin` and `app_manager` can assign any `site_id`.

---

### Get All Patients

#### GET `/api/patients`

Get all patients based on user's access level.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Permission:** `patients:view`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "patient_id": "PID12345",
        "first_name": "John",
        "last_name": "Doe",
        "dob": "1990-01-01T00:00:00.000Z",
        "gender": "Male",
        "site_id": "uuid",
        "enrollment_date": "2024-01-01T00:00:00.000Z",
        "status": "Active",
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Patient by ID

#### GET `/api/patients/:id`

Get a specific patient by ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Permission:** `patients:view`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "uuid",
      "patient_id": "PID12345",
      "first_name": "John",
      "last_name": "Doe",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "Male",
      "site_id": "uuid",
      "enrollment_date": "2024-01-01T00:00:00.000Z",
      "status": "Active",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Patient not found or you do not have permission to access this patient"
  }
}
```

---

### Create Patient

#### POST `/api/patients`

Create a new patient.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `patients:create`

**Body (JSON):**

```json
{
  "patient_id": "PID12345",
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1990-01-01",
  "gender": "Male",
  "site_id": "uuid",
  "enrollment_date": "2024-01-01",
  "status": "Active"
}
```

**Note:**

-   `patient_id`, `first_name`, `last_name` are required.
-   `gender` can be `Male`, `Female`, or `Other`.
-   `status` can be `Active`, `Inactive`, or `Completed`.
-   `site_id` is optional, but if provided, it must be a site the user has access to.

**Success Response (201):**

```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "patient": {
      "id": "uuid",
      "patient_id": "PID12345",
      "first_name": "John",
      "last_name": "Doe",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "Male",
      "site_id": "uuid",
      "enrollment_date": "2024-01-01T00:00:00.000Z",
      "status": "Active",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Patient

#### PUT `/api/patients/:id`

Update a patient's information.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `patients:edit`

**Body (JSON):**

```json
{
  "first_name": "Johnathan",
  "status": "Inactive",
  "site_id": "new_site_uuid"
}
```

**Note:**

-   All fields are optional.
-   If `site_id` is provided, it must be a site the user has access to.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "patient": {
      "id": "uuid",
      "first_name": "Johnathan",
      "status": "Inactive",
      "site_id": "new_site_uuid",
      ...
    }
  }
}
```

---

### Delete Patient

#### DELETE `/api/patients/:id`

Delete a patient.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Permission:** `patients:delete`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

---

## 🔬 Trial Endpoints (Protected)

### Get All Trials

#### GET `/api/trials`

Get all trials in the system.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `trials:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "trials": [
      {
        "id": "uuid",
        "name": "Trial 1",
        "description": "This is the first trial",
        "start_date": "2024-01-01T00:00:00.000Z",
        "end_date": "2024-01-01T00:00:00.000Z",
        "status": "Active",
        "created_by": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "sponsors": [
            {
                "trial_id": "uuid",
                "sponsor_id": "uuid",
                "can_edit": true,
                "sponsor": {
                    "id": "uuid",
                    "user_id": "uuid",
                    "user": {
                        "id": "uuid",
                        "name": "Sponsor Admin",
                        "email": "sponsor@test.com"
                    }
                }
            }
        ],
        "sites": [
            {
                "id": "uuid",
                "user_id": "uuid",
                "name": "Site 1",
                "user": {
                    "id": "uuid",
                    "name": "Site Manager",
                    "email": "site@test.com"
                }
            }
        ]
      }
    ]
  }
}
```

---

### Get Trial by ID

#### GET `/api/trials/:id`

Get a specific trial by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `trials:view` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "trial": {
      "id": "uuid",
      "name": "Trial 1",
      "description": "This is the first trial",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-01-01T00:00:00.000Z",
      "status": "Active",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "sponsors": [],
      "sites": []
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Trial not found"
  }
}
```

---

### Create Trial

#### POST `/api/trials`

Create a new trial.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `trials:create` or `super_admin`

**Body (JSON):**
```json
{
  "name": "New Trial",
  "description": "This is a new trial",
  "start_date": "2024-01-01",
  "end_date": "2025-01-01",
  "status": "Active"
}
```

**Note:**
- `name` is required.
- `status` can be `Active`, `Completed`, or `Paused`.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Trial created successfully",
  "data": {
    "trial": {
      "id": "uuid",
      "name": "New Trial",
      "description": "This is a new trial",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2025-01-01T00:00:00.000Z",
      "status": "Active",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Trial

#### PUT `/api/trials/:id`

Update a trial's information.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `trials:edit` or `super_admin`

**Body (JSON):**
```json
{
  "name": "Updated Trial Name",
  "status": "Completed"
}
```

**Note:**
- All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trial updated successfully",
  "data": {
    "trial": {
      "id": "uuid",
      "name": "Updated Trial Name",
      "status": "Completed",
      ...
    }
  }
}
```

---

### Delete Trial

#### DELETE `/api/trials/:id`

Delete a trial.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission:** `trials:delete` or `super_admin`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trial deleted successfully"
}
```

---

### Assign Sponsor to Trial

#### POST `/api/trials/:id/sponsors`

Assign a sponsor to a trial.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `trials:edit` or `super_admin`

**Body (JSON):**
```json
{
  "sponsor_id": "uuid",
  "can_edit": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sponsor assigned to trial successfully",
  "data": {
    "trialSponsor": {
        "trial_id": "uuid",
        "sponsor_id": "uuid",
        "can_edit": true
    }
  }
}
```

---

### Assign Site to Trial

#### POST `/api/trials/:id/sites`

Assign a site to a trial.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Permission:** `trials:edit` or `super_admin`

**Body (JSON):**
```json
{
  "site_id": "uuid"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Site assigned to trial successfully",
  "data": {
    "trial": {
      ...
    }
  }
}
```

---

## 🧪 Test Users

Use these pre-seeded test users (after running `npm run seed`):

| Email | Password | Role |
|--------------------------|-----------|--------------------|
| admin@test.com | admin123 | super_admin |
| organization@test.com | org123 | organization_admin |
| sponsor@test.com | sponsor123 | sponsor_admin |
| site@test.com | site123 | site_manager |
| provider@test.com | provider123 | provider |
| user@test.com | user123 | user |
| john.doe@example.com | password123 | user |

---

## ⚙️ Database Management (For Developers)

For developers running the project locally, here are some useful Prisma commands for managing the database. These are typically run from the project's root directory.

### Available Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations for development
- `npm run prisma:deploy` - Run database migrations in production
- `npm run prisma:push` - Push schema to database (dev only, no migrations)
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run prisma:reset` - Reset database, re-run migrations and seed
- `npm run prisma:format` - Format the `schema.prisma` file
- `npm run seed` - Seed database with test users

### Resetting the Database

To completely reset your local database, drop all tables, and re-run all migrations and the seed script:

```bash
npm run prisma:reset
```

This is extremely useful during development when you need a clean slate.

### Consolidating Migrations

If your `prisma/migrations` folder becomes cluttered, you can consolidate all existing migrations into a single file. **Warning:** This is a destructive operation and should only be done in a development environment.

1.  **Delete the `prisma/migrations` folder.**
2.  **Reset the database** to ensure it's empty: `npm run prisma:reset`
3.  **Create a new initial migration**: `npm run prisma:migrate -- --name init`

---

## 🔄 Testing Workflow

1. **Health Check** - Verify server is running
2. **Register** - Create a new user (optional, test users already exist)
3. **Login** - Login with test credentials
   - Copy the `accessToken` from response
   - Set it in Postman environment variable `access_token`
4. **Get Current User** - Test protected route with access token
5. **Test Entity Endpoints** - Test modules, roles, organizations, sponsors, sites, providers
6. **Refresh Token** - Get new access token (requires login cookie)
7. **Logout** - Clear refresh token cookie

---

## ⚙️ Postman Tips

1. **Auto-save Token**: The collection includes test scripts that automatically save the access token to the environment variable after login.

2. **Cookie Management**: 
   - For refresh token endpoint, ensure cookies are enabled in Postman settings
   - Go to Settings → General → Enable "Automatically follow redirects" and "Send cookies"

3. **Environment Variables**:
   - Create a Postman Environment
   - Set `base_url` to your server URL
   - `access_token` will be auto-populated after login

4. **Rate Limiting**: 
   - Auth endpoints: 5 requests per 15 minutes
   - General API: 100 requests per 15 minutes
   - If you hit the limit, wait 15 minutes or restart the server

5. **Permissions**: 
   - Most endpoints require specific permissions
   - super_admin users have access to all endpoints
   - Check the permission requirements for each endpoint

---

## 📝 Example Request Flow

### Register → Login → Get User Info

1. **Register**:
   ```json
   POST /api/auth/register
   {
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

2. **Login** (copy accessToken):
   ```json
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

3. **Get User Info** (use accessToken from step 2):
   ```
   GET /api/users/me
   Authorization: Bearer <accessToken>
   ```

---

## 🔒 Security Notes

- Access tokens expire after **15 minutes**
- Refresh tokens expire after **7 days**
- Refresh tokens are stored in HTTP-only cookies (secure)
- All passwords are hashed with Argon2
- Rate limiting is enabled on all endpoints
- CORS is configured for your frontend domain
- Role-based access control (RBAC) is enforced on all protected endpoints
- Permission checks are performed for each protected endpoint

---

## ❌ Error Responses

All endpoints follow a consistent error response format:

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["field_name"],
        "message": "Required"
      }
    ]
  }
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token"
  }
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": {
    "message": "Resource not found"
  }
}
```

**Conflict (409):**
```json
{
  "success": false,
  "error": {
    "message": "Resource already exists"
  }
}
```

**Internal Server Error (500):**
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```
