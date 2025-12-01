# Vercel Serverless vs Traditional Server

## The "Route not found" Issue - SOLVED ✅

If you're seeing `{"message":"Route not found"}` on Vercel, it's because Vercel uses **serverless functions**, not traditional servers.

---

## Key Differences

### Traditional Server (server.js)
```javascript
const app = express();
// ... routes and middleware ...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
- ✅ Works locally
- ❌ Doesn't work on Vercel (serverless)

### Vercel Serverless (api/index.js)
```javascript
const app = express();
// ... routes and middleware ...

module.exports = app;  // Export instead of listen!
```
- ✅ Works on Vercel
- ✅ Also works locally with proper setup

---

## Your Project Structure

```
backend/
├── server.js           # For local development (uses app.listen)
├── api/
│   └── index.js       # For Vercel deployment (exports app)
├── vercel.json        # Points to api/index.js
├── routes/
├── models/
└── config/
```

---

## How It Works

### Local Development
```bash
cd backend
npm start  # Runs server.js with app.listen()
```

### Vercel Deployment
1. Vercel reads `vercel.json`
2. Finds entry point: `api/index.js`
3. Imports the exported Express app
4. Wraps it as a serverless function
5. Handles requests automatically

---

## What We Fixed

### Before (Broken on Vercel)
```json
// backend/vercel.json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }]
}
```
❌ Problem: `server.js` calls `app.listen()` which doesn't work in serverless

### After (Works on Vercel)
```json
// backend/vercel.json
{
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/api/index.js" }]
}
```
✅ Solution: `api/index.js` exports the app, Vercel handles execution

---

## Testing

### Test Locally (Optional)
You can test the serverless version locally:
```bash
npm install -g vercel
cd backend
vercel dev
```

### Test on Vercel
After deployment, test these endpoints:
```
https://your-backend.vercel.app/api/health
https://your-backend.vercel.app/api/products
https://your-backend.vercel.app/api/debug/cors
```

---

## Important Notes

1. **Both files exist**: Keep both `server.js` (local) and `api/index.js` (Vercel)
2. **Same code**: They have identical middleware and routes
3. **Only difference**: `server.js` has `app.listen()`, `api/index.js` has `module.exports = app`
4. **Vercel uses**: Only `api/index.js` when deployed

---

## Summary

✅ **Fixed**: Created `backend/api/index.js` that exports Express app  
✅ **Updated**: `backend/vercel.json` to use `api/index.js` as entry point  
✅ **Result**: No more "Route not found" errors on Vercel  
✅ **Bonus**: Local development still works with `server.js`
