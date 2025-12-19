# Authentication Flow: JWT + HttpOnly Cookies

This document outlines the secure authentication strategy for the Collaborative Task Manager.

## Overview
We use **JSON Web Tokens (JWT)** for stateless authentication, stored securely in **HttpOnly cookies** to prevent XSS attacks.

## 1. Registration / Login
1.  **Client** sends `POST /auth/login` or `POST /auth/register` with credentials.
2.  **Server** validates credentials (using Zod and bcrypt).
3.  **Server** generates a JWT containing the user's ID and email.
4.  **Server** sets the JWT in an `HttpOnly` cookie in the response.

### Cookie Configuration
```typescript
res.cookie('token', token, {
  httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'strict', // CSRF protection
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});
```

## 2. Authenticated Requests
1.  **Client** makes a request to a protected route (e.g., `POST /tasks`).
2.  **Browser** automatically attaches the `token` cookie to the request.
3.  **Server Middleware** intercepts the request.

### Middleware Logic
1.  Extract token from `req.cookies.token`.
2.  Verify token signature using `jsonwebtoken`.
3.  If valid, decode payload and attach user info to `req.user`.
4.  Call `next()`.
5.  If invalid/missing, return `401 Unauthorized`.

## 3. Logout
1.  **Client** sends `POST /auth/logout`.
2.  **Server** clears the cookie.

```typescript
res.clearCookie('token');
res.json({ message: 'Logged out' });
```

## Security Benefits
-   **XSS Protection**: `HttpOnly` flag prevents malicious scripts from stealing the token.
-   **CSRF Protection**: `SameSite` attribute reduces CSRF risks (though CSRF tokens can be added for extra security if needed).
-   **Stateless**: No server-side session storage required, easier to scale.
