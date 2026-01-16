#!/bin/bash
# Quick script to update package.json with start script

cat > package.json << 'EOF'
{
  "name": "fitness-point",
  "version": "1.0.0",
  "description": "Fitness awareness website with social features",
  "scripts": {
    "start": "bash start.sh",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install --legacy-peer-deps",
    "stop": "powershell -ExecutionPolicy Bypass -File ./stop-servers.ps1"
  },
  "keywords": ["fitness", "health", "social"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

echo "✅ package.json updated!"
