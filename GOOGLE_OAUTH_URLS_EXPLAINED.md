# Understanding GOOGLE_CALLBACK_URL vs FRONTEND_URL

## Quick Answer

**NO, they should be DIFFERENT!**

- **`GOOGLE_CALLBACK_URL`** → Points to your **BACKEND** domain
- **`FRONTEND_URL`** → Points to your **FRONTEND** domain

---

## Detailed Explanation

### 1. GOOGLE_CALLBACK_URL (Backend)

```
GOOGLE_CALLBACK_URL=https://your-backend-domain.vercel.app/api/auth/google/callback
```

**Purpose:**
- This is where Google OAuth redirects users **after** they authenticate
- It points to your **backend API** endpoint that processes the OAuth response
- Must match exactly what you configure in Google Cloud Console

**Example:**
```
GOOGLE_CALLBACK_URL=https://gag-backend.vercel.app/api/auth/google/callback
```

---

### 2. FRONTEND_URL (Frontend)

```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Purpose:**
- This is your **frontend** application URL
- Used by backend for CORS configuration (allows requests from your frontend)
- Used to redirect users back to frontend after successful authentication

**Example:**
```
FRONTEND_URL=https://gag-store.vercel.app
```

---

## The OAuth Flow

Here's how these URLs work together:

```
1. User on FRONTEND clicks "Login with Google"
   └─> https://gag-store.vercel.app
   
2. Frontend redirects to Google OAuth
   └─> https://accounts.google.com/...
   
3. User authenticates with Google
   
4. Google redirects to BACKEND callback
   └─> https://mukthi-backend.vercel.app/api/auth/google/callback
   
5. Backend processes OAuth response
   
6. Backend redirects user back to FRONTEND
   └─> https://gag-store.vercel.app
```

---

## Real Example After Deployment

Let's say you deploy and get these domains:

| Service | Domain |
|---------|--------|
| Backend | `https://gag-backend.vercel.app` |
| Frontend | `https://gag-store.vercel.app` |

### Backend Environment Variables:
```env
GOOGLE_CALLBACK_URL=https://gag-backend.vercel.app/api/auth/google/callback
FRONTEND_URL=https://gag-store.vercel.app
```

### Google Cloud Console (Authorized redirect URIs):
```
https://mukthi-backend.vercel.app/api/auth/google/callback
```

### Frontend Environment Variables:
```env
REACT_APP_API_URL=https://mukthi-backend.vercel.app
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Important Notes

✅ **GOOGLE_CALLBACK_URL** = Backend domain + `/api/auth/google/callback`  
✅ **FRONTEND_URL** = Frontend domain (no path)  
✅ These are **ALWAYS DIFFERENT** (separate deployments on Vercel)  
✅ Both must be HTTPS in production  

---

## Code Update

I've updated `backend/config/passport.js` to use the `GOOGLE_CALLBACK_URL` environment variable instead of the hardcoded Render URL. This makes it flexible for any deployment platform (Vercel, Render, or local development).

**Before:**
```javascript
const backendURL = process.env.NODE_ENV === 'production' 
  ? 'https://mukthi-backend.onrender.com'  // ❌ Hardcoded
  : 'http://localhost:5000';
```

**After:**
```javascript
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';
// ✅ Uses environment variable
```
