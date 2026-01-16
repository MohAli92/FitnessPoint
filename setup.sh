#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up FitnessPoint...${NC}"

# Update package.json with start script
echo -e "${YELLOW}📝 Updating package.json...${NC}"
cat > package.json << 'PKGEOF'
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
PKGEOF
echo -e "${GREEN}✅ package.json updated!${NC}"

# Create start.sh script
echo -e "${YELLOW}📝 Creating start.sh...${NC}"
cat > start.sh << 'STARTEOF'
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting FitnessPoint...${NC}"

# Check if node_modules exist, if not install dependencies
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm run install-all
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed!${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    echo "PORT=5000" > server/.env
    echo "JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo 'your-secret-key-change-in-production')" >> server/.env
    echo -e "${GREEN}✅ .env file created!${NC}"
fi

# Start the development servers
echo -e "${GREEN}🎉 Starting development servers...${NC}"
npm run dev
STARTEOF

chmod +x start.sh
echo -e "${GREEN}✅ start.sh created and made executable!${NC}"

echo -e "${GREEN}✨ Setup complete! Now you can run: npm start${NC}"
