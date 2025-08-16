#!/bin/bash

# CogniSite AI - Quick Setup Script
# This script helps you get CogniSite AI up and running quickly

set -e

echo "🚀 CogniSite AI - Quick Setup Script"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please ensure the .env file exists in the project root."
    exit 1
fi

echo "✅ Environment file found"

# Build the project to check for errors
echo ""
echo "🔨 Building project to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo "✅ Build successful"

# Start the development server
echo ""
echo "🎉 Setup complete! Starting the development server..."
echo ""
echo "📍 The application will be available at: http://localhost:5173"
echo "🔧 Visit /setup-status to check system configuration"
echo "📚 Check the README.md for detailed usage instructions"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start