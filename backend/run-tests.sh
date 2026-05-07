#!/bin/bash

# SMS Backend Test Runner
# Utility script to run tests with various options

echo "================================"
echo "SMS Backend Test Runner"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to display menu
show_menu() {
    echo "Select test option:"
    echo "1) Run all tests"
    echo "2) Run tests with coverage"
    echo "3) Run unit tests only"
    echo "4) Run integration tests only"
    echo "5) Run tests in watch mode"
    echo "6) Run specific test file"
    echo "7) Debug tests"
    echo "8) Exit"
    echo ""
    read -p "Enter choice [1-8]: " choice
}

# Function to run tests
run_tests() {
    case $choice in
        1)
            echo -e "${BLUE}Running all tests...${NC}"
            npm test
            ;;
        2)
            echo -e "${BLUE}Running tests with coverage...${NC}"
            npm run test:coverage
            ;;
        3)
            echo -e "${BLUE}Running unit tests...${NC}"
            npm run test:unit
            ;;
        4)
            echo -e "${BLUE}Running integration tests...${NC}"
            npm run test:integration
            ;;
        5)
            echo -e "${BLUE}Running tests in watch mode...${NC}"
            npm run test:watch
            ;;
        6)
            echo -e "${BLUE}Running specific test file...${NC}"
            read -p "Enter test file name: " testfile
            npm test -- $testfile
            ;;
        7)
            echo -e "${BLUE}Debugging tests...${NC}"
            npm run test:debug
            ;;
        8)
            echo -e "${GREEN}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo "Invalid choice"
            ;;
    esac
}

# Main loop
while true; do
    show_menu
    run_tests
    echo ""
    read -p "Press Enter to continue..."
done
