# Codespace Setup Guide

## Quick Start for GitHub Codespaces

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   
   This will install dependencies for:
   - Root project (concurrently)
   - Server (Express, TypeScript, etc.)
   - Client (React, Tailwind, etc.)

2. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   echo "PORT=5000" > .env
   echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
   cd ..
   ```
   
   Or manually create `server/.env`:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

## Port Forwarding in Codespaces

When running in Codespaces, you'll need to forward ports:

1. The backend runs on port **5000**
2. The frontend runs on port **3000**

### ⚠️ IMPORTANT: Make Ports Public

**Both ports MUST be set to Public** for the application to work properly:

1. Go to the **"Ports"** tab in Codespaces
2. For each port (3000 and 5000):
   - Right-click → **"Port Visibility"** → **"Public"**
   - Or click the visibility icon (🔒) to change it to Public (🌐)

**Why?** The frontend needs to make API requests to the backend. If ports are Private, the browser can't access them, causing CORS errors and connection failures.

Codespaces should automatically detect these ports and prompt you to forward them. If not:
- Go to the "Ports" tab in Codespaces
- Forward ports 3000 and 5000
- **Make sure both are set to Public** (not Private)

## Troubleshooting

### If `npm run install-all` fails:

Try installing manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..
```

### If you get "command not found" errors:

Make sure all dependencies are installed. The error `react-scripts: not found` or `ts-node-dev: not found` means dependencies weren't installed.

### Database initialization:

The database will be created automatically on first server start. The SQLite database file (`fitnesspoint.db`) will be created in the `server` directory.

## Alternative: Manual Start

If `npm run dev` doesn't work, start servers separately:

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm start
```
