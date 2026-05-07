#!/bin/bash

# SMS System Pre-Flight Check
# Verifies all prerequisites are installed and configured

echo "================================"
echo "SMS System Pre-Flight Check"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ((errors++))
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    ((errors++))
fi

# Check MongoDB
echo "Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB CLI installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB CLI not found (but can use MongoDB Atlas)${NC}"
fi

# Check Redis
echo "Checking Redis..."
if command -v redis-server &> /dev/null; then
    echo -e "${GREEN}✓ Redis installed${NC}"
elif command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✓ Redis CLI installed${NC}"
else
    echo -e "${YELLOW}⚠ Redis not found (required for production)${NC}"
fi

# Check .env files
echo ""
echo "Checking configuration files..."

if [ -f "backend/.env" ]; then
    if [ -s "backend/.env" ]; then
        echo -e "${GREEN}✓ backend/.env exists and configured${NC}"
    else
        echo -e "${YELLOW}⚠ backend/.env exists but is empty${NC}"
        ((errors++))
    fi
else
    echo -e "${RED}✗ backend/.env not found${NC}"
    ((errors++))
fi

if [ -f "frontend/.env" ]; then
    if [ -s "frontend/.env" ]; then
        echo -e "${GREEN}✓ frontend/.env exists and configured${NC}"
    else
        echo -e "${YELLOW}⚠ frontend/.env exists but is empty${NC}"
    fi
else
    echo -e "${YELLOW}⚠ frontend/.env not found (will use defaults)${NC}"
fi

# Check backend node_modules
echo ""
echo "Checking dependencies..."

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Backend dependencies not installed (run: cd backend && npm install)${NC}"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend dependencies not installed (run: cd frontend && npm install)${NC}"
fi

# Summary
echo ""
echo "================================"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "To start the system:"
    echo "1. Ensure MongoDB is running"
    echo "2. Ensure Redis is running"
    echo "3. In Terminal 1: cd backend && npm run dev"
    echo "4. In Terminal 2: cd frontend && npm run dev"
else
    echo -e "${RED}✗ ${errors} check(s) failed${NC}"
    echo "Please fix the issues above before running the system"
fi
echo "================================"
