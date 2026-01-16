#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if we're in Codespaces
if [ -n "$CODESPACE_NAME" ]; then
    echo -e "${BLUE}🔗 Codespace detected!${NC}"
    echo -e "${YELLOW}📌 Make sure ports 3000 and 5000 are forwarded in your Codespace${NC}"
    echo -e "${YELLOW}   The frontend will automatically connect to the backend on port 5000${NC}"
    echo ""
fi

# Start the development servers
echo -e "${GREEN}🎉 Starting development servers...${NC}"
echo -e "${YELLOW}   Backend: http://localhost:5000${NC}"
echo -e "${YELLOW}   Frontend: http://localhost:3000${NC}"
echo ""
npm run dev
