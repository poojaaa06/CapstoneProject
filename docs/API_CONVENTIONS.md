# VR Project API Conventions

> Version 2.1 | Last Updated: June 2025 | Maintained by: Platform Engineering

---

## HTTP Requests

All API calls must go through the `useApiClient()` custom hook located at `src/hooks/useApiClient.ts`.

### Correct Usage

```typescript
// ✅ CORRECT
import { useApiClient } from '../../hooks/useApiClient';

export const UserProfile = () => {
  const { get, post, put, delete: destroy } = useApiClient();

  const fetchUser = async () => {
    const response = await get('/api/user/profile');
    return response.data;
  };

  const updateProfile = async (data) => {
    const response = await post('/api/user/profile', data);
    return response.data;
  };

  return <div>{/* Component JSX */}</div>;
};
```

### Incorrect Usage

```typescript
// ❌ WRONG - Never import axios directly
import axios from 'axios';

const response = await axios.get('/api/user/profile');

// ❌ WRONG - Never use fetch directly
const response = await fetch('/api/user/profile');
```

---

## API Client Configuration

The `useApiClient()` hook provides:

- **get(url, config?)** - GET request
- **post(url, data, config?)** - POST request
- **put(url, data, config?)** - PUT request
- **patch(url, data, config?)** - PATCH request
- **delete(url, config?)** - DELETE request

### Example Implementation

```typescript
// src/hooks/useApiClient.ts
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// Add auth token to every request
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('VR Project_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useApiClient = () => ({
  get: (url, config) => apiInstance.get(url, config),
  post: (url, data, config) => apiInstance.post(url, data, config),
  put: (url, data, config) => apiInstance.put(url, data, config),
  patch: (url, data, config) => apiInstance.patch(url, data, config),
  delete: (url, config) => apiInstance.delete(url, config),
});
```

---

## Authentication & Token Management

### Token Storage Rules

- **Storage Key:** `VR Project_auth_token`
- **Storage Type:** `localStorage` (NOT sessionStorage)
- **Format:** Bearer token string

### Setting Token

```typescript
// After successful login
const token = response.data.token;
localStorage.setItem('VR Project_auth_token', token);
```

### Retrieving Token

```typescript
// When making API requests
const token = localStorage.getItem('VR Project_auth_token');
if (token) {
  headers.Authorization = `Bearer ${token}`;
}
```

### Removing Token

```typescript
// On logout
localStorage.removeItem('VR Project_auth_token');
```

### Complete Auth Flow Example

```typescript
import { useApiClient } from '../../hooks/useApiClient';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

export const useLogin = () => {
  const { post } = useApiClient();
  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    try {
      const response = await post('/api/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      // Store token
      localStorage.setItem('VR Project_auth_token', token);

      // Update Redux state
      dispatch(setUser(user));

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};
```

---

## Error Handling

Always implement proper error handling in API calls:

```typescript
const fetchData = async () => {
  try {
    const { get } = useApiClient();
    const response = await get('/api/data');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('VR Project_auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden
      message.error('You do not have permission to access this resource');
    } else {
      // Handle other errors
      message.error('An error occurred. Please try again.');
    }
    throw error;
  }
};
```

---

## API Endpoint Structure

### Recommended Endpoint Patterns

```
GET    /api/users                 - List all users
POST   /api/users                 - Create user
GET    /api/users/:id             - Get user detail
PUT    /api/users/:id             - Update user
DELETE /api/users/:id             - Delete user

GET    /api/auth/login            - Login
POST   /api/auth/logout           - Logout
POST   /api/auth/refresh          - Refresh token
```

---

## Response Format

All API responses should follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User retrieved successfully"
}
```

### Error Response Example

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": {
    "email": "Email is already taken",
    "username": "Username must be unique"
  }
}
```

---

## Reference

- [axios Documentation](https://axios-http.com/docs/intro)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
