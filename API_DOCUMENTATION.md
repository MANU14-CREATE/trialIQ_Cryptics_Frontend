# Clinical Trial Management System - REST API Documentation

## Base URL
```
https://nuefjfbeoeqzpnkqzhur.supabase.co/functions/v1
```

## Authentication
All API endpoints require authentication using JWT Bearer token.

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Getting JWT Token
Use Supabase authentication to get a JWT token:
```javascript
const { data } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
const token = data.session.access_token;
```

---

## Organizations API

### List All Organizations
```http
GET /api-organizations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Organization Name",
      "description": "Description",
      "contact_email": "contact@org.com",
      "contact_phone": "+1234567890",
      "address": "123 Main St",
      "entity_id": "org-12345",
      "entity_owner_email": "owner@org.com",
      "entity_primary_phone": "+1234567890",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Organization by ID
```http
GET /api-organizations?id={organization_id}
```

### Create Organization
```http
POST /api-organizations
Content-Type: application/json

{
  "name": "New Organization",
  "description": "Organization description",
  "contact_email": "contact@org.com",
  "contact_phone": "+1234567890",
  "address": "123 Main St",
  "entity_owner_email": "owner@org.com",
  "entity_primary_phone": "+1234567890"
}
```

### Update Organization
```http
PUT /api-organizations?id={organization_id}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "contact_email": "updated@org.com",
  "contact_phone": "+1234567890",
  "address": "456 New St",
  "entity_owner_email": "owner@org.com",
  "entity_primary_phone": "+1234567890"
}
```

### Delete Organization
```http
DELETE /api-organizations?id={organization_id}
```

---

## Sites API

### List All Sites
```http
GET /api-sites
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Site Name",
      "location": "City, State",
      "contact_person": "John Doe",
      "contact_email": "site@example.com",
      "contact_phone": "+1234567890",
      "address": "789 Site St",
      "owner_email": "owner@site.com",
      "primary_phone": "+1234567890",
      "entity_id": "practice-12345",
      "organization_id": "uuid",
      "organizations": {
        "name": "Parent Organization"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Site by ID
```http
GET /api-sites?id={site_id}
```

### Create Site
```http
POST /api-sites
Content-Type: application/json

{
  "name": "New Site",
  "location": "City, State",
  "contact_person": "Jane Smith",
  "contact_email": "site@example.com",
  "contact_phone": "+1234567890",
  "address": "789 Site St",
  "owner_email": "owner@site.com",
  "primary_phone": "+1234567890",
  "organization_id": "uuid"
}
```

### Update Site
```http
PUT /api-sites?id={site_id}
Content-Type: application/json

{
  "name": "Updated Site Name",
  "location": "Updated City",
  "contact_person": "Updated Contact",
  "contact_email": "updated@site.com",
  "contact_phone": "+1234567890",
  "address": "Updated Address",
  "owner_email": "owner@site.com",
  "primary_phone": "+1234567890",
  "organization_id": "uuid"
}
```

### Delete Site
```http
DELETE /api-sites?id={site_id}
```

---

## Sponsors API

### List All Sponsors
```http
GET /api-sponsors
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sponsor Name",
      "contact_person": "Contact Person",
      "contact_email": "sponsor@example.com",
      "contact_phone": "+1234567890",
      "address": "Sponsor Address",
      "owner_email": "owner@sponsor.com",
      "primary_phone": "+1234567890",
      "entity_id": "sponsor-12345",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Sponsor by ID
```http
GET /api-sponsors?id={sponsor_id}
```

### Create Sponsor
```http
POST /api-sponsors
Content-Type: application/json

{
  "name": "New Sponsor",
  "contact_person": "John Doe",
  "contact_email": "sponsor@example.com",
  "contact_phone": "+1234567890",
  "address": "123 Sponsor St",
  "owner_email": "owner@sponsor.com",
  "primary_phone": "+1234567890"
}
```

### Update Sponsor
```http
PUT /api-sponsors?id={sponsor_id}
Content-Type: application/json

{
  "name": "Updated Sponsor",
  "contact_person": "Jane Smith",
  "contact_email": "updated@sponsor.com",
  "contact_phone": "+1234567890",
  "address": "456 Updated St",
  "owner_email": "owner@sponsor.com",
  "primary_phone": "+1234567890"
}
```

### Delete Sponsor
```http
DELETE /api-sponsors?id={sponsor_id}
```

---

## Trials API

### List All Trials
```http
GET /api-trials
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Trial Name",
      "description": "Trial description",
      "nct_id": "NCT12345678",
      "status": "active",
      "start_date": "2025-01-01",
      "end_date": "2026-01-01",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Trial by ID
```http
GET /api-trials?id={trial_id}
```

### Create Trial
```http
POST /api-trials
Content-Type: application/json

{
  "name": "New Clinical Trial",
  "description": "Trial description",
  "nct_id": "NCT12345678",
  "status": "active",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

### Update Trial
```http
PUT /api-trials?id={trial_id}
Content-Type: application/json

{
  "name": "Updated Trial Name",
  "description": "Updated description",
  "nct_id": "NCT12345678",
  "status": "completed",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

### Delete Trial
```http
DELETE /api-trials?id={trial_id}
```

---

## Patients API

### List All Patients
```http
GET /api-patients
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patient_id": "PAT-12345",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-01-01",
      "gender": "male",
      "site_id": "uuid",
      "enrollment_date": "2025-01-01",
      "status": "active",
      "sites": {
        "name": "Site Name"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Patient by ID
```http
GET /api-patients?id={patient_id}
```

### Create Patient
```http
POST /api-patients
Content-Type: application/json

{
  "patient_id": "PAT-12345",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1980-01-01",
  "gender": "male",
  "site_id": "uuid",
  "enrollment_date": "2025-01-01",
  "status": "active"
}
```

### Update Patient
```http
PUT /api-patients?id={patient_id}
Content-Type: application/json

{
  "patient_id": "PAT-12345",
  "first_name": "John",
  "last_name": "Smith",
  "date_of_birth": "1980-01-01",
  "gender": "male",
  "site_id": "uuid",
  "enrollment_date": "2025-01-01",
  "status": "completed"
}
```

### Delete Patient
```http
DELETE /api-patients?id={patient_id}
```

---

## Providers API

### List All Providers
```http
GET /api-providers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "first_name": "Dr. Jane",
      "last_name": "Smith",
      "email": "doctor@example.com",
      "phone": "+1234567890",
      "specialty": "Cardiology",
      "site_id": "uuid",
      "sites": {
        "name": "Site Name"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Provider by ID
```http
GET /api-providers?id={provider_id}
```

### Create Provider
```http
POST /api-providers
Content-Type: application/json

{
  "first_name": "Dr. Jane",
  "last_name": "Smith",
  "email": "doctor@example.com",
  "phone": "+1234567890",
  "specialty": "Cardiology",
  "site_id": "uuid"
}
```

### Update Provider
```http
PUT /api-providers?id={provider_id}
Content-Type: application/json

{
  "first_name": "Dr. Jane",
  "last_name": "Doe",
  "email": "updated@example.com",
  "phone": "+1234567890",
  "specialty": "Neurology",
  "site_id": "uuid"
}
```

### Delete Provider
```http
DELETE /api-providers?id={provider_id}
```

---

## User Management API

**Note:** User management requires super-admin privileges. The API uses the `manage-users` edge function.

### List All Users
```http
POST /manage-users
Content-Type: application/json

{
  "action": "list"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+1234567890",
      "created_at": "2025-01-01T00:00:00Z",
      "role": "multi-site-management",
      "entity_id": "uuid",
      "entity_type": "organization",
      "entity_name": "Organization Name"
    }
  ]
}
```

### Create User
```http
POST /manage-users
Content-Type: application/json

{
  "action": "create",
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "multi-site-management",
  "entity_type": "organization",
  "entity_id": "uuid",
  "module_permissions": [
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

**Available Roles:**
- `super-admin` - Full system access
- `multi-site-management` - Organization-level access
- `sponsor` - Sponsor-level access
- `site` - Site-level access
- `provider` - Provider-level access

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "newuser@example.com"
  }
}
```

### Delete User
```http
POST /manage-users
Content-Type: application/json

{
  "action": "delete",
  "user_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Update User Password (by User ID)
```http
POST /manage-users
Content-Type: application/json

{
  "action": "update-password",
  "user_id": "uuid",
  "new_password": "NewSecurePassword123!"
}
```

### Update User Password (by Email)
```http
POST /manage-users
Content-Type: application/json

{
  "action": "update-password",
  "email": "user@example.com",
  "new_password": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## Role Management API

### List Custom Roles

Custom roles are retrieved directly from the database using the Supabase client:

```javascript
const { data, error } = await supabase
  .from('custom_roles')
  .select('*')
  .order('created_at', { ascending: false });
```

**Response Structure:**
```json
[
  {
    "id": "uuid",
    "name": "Data Entry Specialist",
    "description": "Can enter and view patient data",
    "entity_type": "site",
    "entity_id": "uuid",
    "permissions": ["view_patients", "create_patients", "edit_patients"],
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

### Create Custom Role

```javascript
const { data, error } = await supabase
  .from('custom_roles')
  .insert({
    name: "Data Entry Specialist",
    description: "Can enter and view patient data",
    entity_type: "site",
    entity_id: "site-uuid",
    permissions: ["view_patients", "create_patients", "edit_patients"]
  })
  .select()
  .single();
```

### Update Custom Role

```javascript
const { data, error } = await supabase
  .from('custom_roles')
  .update({
    name: "Updated Role Name",
    description: "Updated description",
    permissions: ["view_patients", "create_patients"]
  })
  .eq('id', 'role-uuid')
  .select()
  .single();
```

### Delete Custom Role

```javascript
const { error } = await supabase
  .from('custom_roles')
  .delete()
  .eq('id', 'role-uuid');
```

### Available Entity Types
- `organization` - Organization-level roles
- `sponsor` - Sponsor-level roles
- `site` - Site-level roles
- `provider` - Provider-level roles

### Common Permissions
- `view_patients` - View patient records
- `create_patients` - Create new patients
- `edit_patients` - Edit patient information
- `delete_patients` - Delete patient records
- `view_trials` - View trial information
- `manage_trials` - Full trial management
- `view_providers` - View provider information
- `manage_providers` - Full provider management
- `view_reports` - View reports and analytics
- `export_data` - Export system data

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `500 Internal Server Error` - Server error

---

## Code Examples

### JavaScript/TypeScript (Fetch API)
```javascript
// Get JWT token from Supabase
const { data } = await supabase.auth.getSession();
const token = data.session.access_token;

// List all organizations
const response = await fetch('https://nuefjfbeoeqzpnkqzhur.supabase.co/functions/v1/api-organizations', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const result = await response.json();
console.log(result.data);
```

### cURL
```bash
# List all organizations
curl -X GET \
  https://nuefjfbeoeqzpnkqzhur.supabase.co/functions/v1/api-organizations \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json'

# Create a new site
curl -X POST \
  https://nuefjfbeoeqzpnkqzhur.supabase.co/functions/v1/api-sites \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New Site",
    "location": "City, State",
    "contact_person": "Jane Smith",
    "contact_email": "site@example.com",
    "organization_id": "your-org-uuid"
  }'
```

### Python (Requests)
```python
import requests

# Get JWT token (using supabase-py)
session = supabase.auth.get_session()
token = session.access_token

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# List all trials
response = requests.get(
    'https://nuefjfbeoeqzpnkqzhur.supabase.co/functions/v1/api-trials',
    headers=headers
)
data = response.json()
print(data['data'])
```

---

## Rate Limiting & Best Practices

1. **Authentication**: Always include valid JWT token in Authorization header
2. **Error Handling**: Check `success` field in response before processing data
3. **Idempotency**: PUT and DELETE operations are idempotent
4. **Validation**: Validate all input data before sending requests
5. **Pagination**: For large datasets, consider implementing pagination (future enhancement)

---

## Support & Contact

For API support, please contact your system administrator or refer to the main application documentation.

**API Version**: 1.1  
**Last Updated**: 2025-11-04
