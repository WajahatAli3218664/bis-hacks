# Backend Deployment Instructions

## Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to login with your account.

## Step 2: Deploy Backend
```bash
cd backend
vercel --prod
```

## Step 3: Update Frontend Environment
After deployment, copy the new backend URL and update frontend/.env.local:
```
NEXT_PUBLIC_API_URL=https://your-new-backend-url.vercel.app
```

## Step 4: Deploy Frontend
```bash
cd frontend
vercel --prod
```

## CORS Fix Applied
- Added manual CORS headers to chat endpoint
- Added OPTIONS handler for preflight requests
- Updated vercel.json with CORS headers

## Test Commands
```bash
# Test backend locally
cd backend
python deploy.py

# Test CORS manually
curl -X OPTIONS https://your-backend-url.vercel.app/chat \
  -H "Origin: https://your-frontend-url.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```