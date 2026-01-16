# Codespace Port Configuration Guide

## Important: Port Visibility Settings

In GitHub Codespaces, **ports must be set to Public** for the frontend and backend to communicate properly.

## How to Configure Ports

### Step 1: Open Ports Tab
1. In your Codespace, click on the **"Ports"** tab (usually at the bottom of the screen)
2. You'll see a list of forwarded ports (3000 for frontend, 5000 for backend)

### Step 2: Make Ports Public
For each port (3000 and 5000):
1. Right-click on the port number
2. Select **"Port Visibility"** → **"Public"**
3. Or click the visibility icon (🔒/🌐) next to each port

### Why Public Ports Are Needed

- **Frontend (Port 3000)**: Needs to be public so you can access the React app in your browser
- **Backend (Port 5000)**: Needs to be public so the frontend can make API requests to it

### Port Configuration

- **Port 3000**: Frontend React application
- **Port 5000**: Backend API server

Both should be:
- ✅ **Public** (not Private)
- ✅ **Forwarded** automatically when servers start

## Troubleshooting

### Issue: CORS errors or connection failures

**Solution**: Make sure both ports 3000 and 5000 are set to **Public**

### Issue: Can't access the application

**Solution**: 
1. Check that port 3000 is Public
2. Click on the port URL to open it in a new tab

### Issue: API requests failing

**Solution**:
1. Check that port 5000 is Public
2. Verify the API URL in browser console shows the correct `-5000` subdomain
3. Test the backend directly: `https://your-codespace-5000.app.github.dev/api/health`

## Quick Check

After starting your servers with `npm start`:
1. Go to the **Ports** tab
2. Verify both ports show as **Public** (🌐 icon, not 🔒)
3. If they're Private, right-click → Port Visibility → Public

## Default Behavior

When you first start the servers, Codespaces may set ports to Private by default. Always check and change them to Public for web applications.
