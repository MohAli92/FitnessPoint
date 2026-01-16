# Codespace Network Configuration Guide

## Automatic Configuration

The application is configured to automatically detect Codespaces and connect the frontend to the backend. No manual configuration needed!

## How It Works

1. **Backend Server**: Runs on port `5000`
2. **Frontend Server**: Runs on port `3000`
3. **Auto-Detection**: The frontend automatically detects if you're in Codespaces and connects to the correct backend URL

## Port Forwarding in Codespaces

When you run `npm start`, Codespaces should automatically detect and forward:
- **Port 3000** (Frontend - React app)
- **Port 5000** (Backend - API server)

### Manual Port Forwarding

If ports aren't automatically forwarded:

1. Go to the **"Ports"** tab in your Codespace
2. Click **"Forward a Port"**
3. Forward ports:
   - `3000` (make it public if you want external access)
   - `5000` (make it public if you want external access)

## Accessing Your Application

### In Codespaces Preview:
- Frontend: The preview URL will be shown in the terminal
- Backend API: Automatically accessible at the same domain on port 5000

### External Access:
- If you made ports public, you'll see public URLs in the Ports tab
- Use those URLs to access your application from outside Codespaces

## Troubleshooting

### Frontend can't connect to backend

1. **Check port forwarding**: Make sure port 5000 is forwarded
2. **Check backend is running**: Look for "Server is running on port 5000" in terminal
3. **Check browser console**: Open DevTools (F12) and check the Console tab for API URL
4. **Manual configuration**: If auto-detection fails, set `REACT_APP_API_URL` in `client/.env`:
   ```
   REACT_APP_API_URL=https://your-codespace-5000.preview.app.github.dev/api
   ```

### Finding Your Backend URL

1. Look at the **Ports** tab in Codespace
2. Find port 5000
3. Copy the URL (it will look like: `https://your-codespace-5000.preview.app.github.dev`)
4. Add `/api` to the end for the API URL

### Setting API URL Manually

Create `client/.env` file:
```bash
cd client
echo "REACT_APP_API_URL=https://your-codespace-5000.preview.app.github.dev/api" > .env
cd ..
```

Replace `your-codespace-5000` with your actual Codespace port URL.

## Testing the Connection

1. Start the servers: `npm start`
2. Open browser DevTools (F12)
3. Check Console - you should see: `🌐 API URL: https://...`
4. Try logging in - if it works, the connection is successful!
