#!/bin/bash

echo "🚀 Setting up ReWear - Community Clothing Exchange Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

echo "✅ Node.js and MongoDB are installed"

# Install all dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install

echo "📦 Installing backend dependencies..."
cd ../backend && npm install

cd ..

echo "🔧 Setting up environment files..."

# Create frontend .env if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env file..."
    cat > frontend/.env << EOL
# Firebase Configuration
# To get these values:
# 1. Go to Firebase Console -> Project Settings -> General
# 2. Scroll down to "Your apps" section
# 3. Click on the web app or create a new one
# 4. Copy the configuration values

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Google OAuth (if using additional Google services)
REACT_APP_GOOGLE_CLIENT_ID=
EOL
fi

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cat > backend/.env << EOL
# Database
MONGO_URI=mongodb://127.0.0.1:27017/reware
JWT_SECRET=reware_jwt_secret_key_for_authentication
PORT=5001

# Firebase Admin SDK (Replace with your actual Firebase service account credentials)
# To get these values:
# 1. Go to Firebase Console -> Project Settings -> Service Accounts
# 2. Click "Generate new private key"
# 3. Download the JSON file and use the values below
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. 🔥 Set up Firebase (optional, for social login):"
echo "   - Read FIREBASE_SETUP.md for detailed instructions"
echo "   - Update environment variables in frontend/.env and backend/.env"
echo ""
echo "2. 🗄️  Start MongoDB:"
echo "   mongod"
echo ""
echo "3. 🚀 Run the application:"
echo "   npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "� Note: The app will work without Firebase configuration."
echo "   Traditional email/password authentication will work."
echo "   Social login will be disabled until Firebase is configured."
echo ""
echo "📚 For more information:"
echo "   - Check README.md for general setup"
echo "   - Check FIREBASE_SETUP.md for social login setup"
