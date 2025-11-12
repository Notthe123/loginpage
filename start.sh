#!/bin/bash
# Wina Bwangu FinTech Dashboard - Startup Script

echo "🚀 Starting Wina Bwangu FinTech Dashboard..."
echo ""

# Activate virtual environment and start Flask server
source .venv/bin/activate
python3 app.py

echo ""
echo "✅ Server is running at http://localhost:8000"
echo "📌 Open your browser and navigate to: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
