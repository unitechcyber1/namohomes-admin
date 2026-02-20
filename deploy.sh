#!/bin/bash

# EC2 Deployment Script for Namohomes Admin
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project directory (update if different)
PROJECT_DIR="/home/ubuntu/namohomes-admin"

cd $PROJECT_DIR

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building production bundle...${NC}"
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build failed! build/ directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Create logs directory if it doesn't exist
mkdir -p logs

echo -e "${YELLOW}🔄 Restarting PM2 application...${NC}"
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📊 Checking PM2 status...${NC}"
pm2 status

echo -e "${GREEN}🎉 Application is now running!${NC}"
echo -e "${YELLOW}💡 View logs with: pm2 logs namohomes-admin${NC}"

