#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Updating FitnessPoint...${NC}"

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to pull changes${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Changes pulled successfully!${NC}"
echo ""
echo -e "${YELLOW}🔄 Please restart your servers:${NC}"
echo -e "${YELLOW}   1. Stop the current servers (Ctrl+C)${NC}"
echo -e "${YELLOW}   2. Run: npm start${NC}"
echo ""
echo -e "${BLUE}💡 The frontend will automatically detect the correct API URL${NC}"
echo -e "${BLUE}   Check the browser console for: 🌐 API URL${NC}"
