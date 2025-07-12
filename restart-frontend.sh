#!/bin/bash

# Kill existing frontend process
echo "Stopping frontend server..."
pkill -f "react-scripts start"

# Wait a moment
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd /Users/rohitsonare/reware-community-clothing-exchange/frontend
npm start
