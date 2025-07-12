# Firebase Setup Guide for ReWear

This guide will help you set up Firebase authentication for social login (Google and Apple) in your ReWear application.

## 📋 Prerequisites

- A Google account
- Access to Firebase Console
- Node.js and npm installed

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `reware-clothing-exchange` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and add your project support email
   - **Apple**: Click, toggle "Enable" (requires additional setup for production)

### Step 3: Configure Web App

1. Go to Project Settings (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web app"
4. Enter app nickname: `reware-frontend`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

## 🔧 Frontend Configuration

### Step 1: Update Frontend Environment

Create or update `frontend/.env`:

```env
# Replace with your actual Firebase configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 2: Example Configuration

Here's what your configuration might look like:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBxkQn8YJXGUaLGQ_zR4lEJCcqY3wTxPmE
REACT_APP_FIREBASE_AUTH_DOMAIN=reware-demo.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=reware-demo
REACT_APP_FIREBASE_STORAGE_BUCKET=reware-demo.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
```

## 🛠️ Backend Configuration

### Step 1: Generate Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Open the JSON file and note these values:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 2: Update Backend Environment

Create or update `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/reware
JWT_SECRET=reware_jwt_secret_key_for_authentication
PORT=5001

# Firebase Admin SDK - Replace with your actual values
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n
```

### Step 3: Private Key Format

The private key needs to be formatted correctly. If you're copying from the JSON file:

1. Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
2. Replace all actual newlines with `\n`
3. Put it all on one line

Example:
```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

## 🎯 Testing Your Setup

### Step 1: Test Backend

```bash
cd backend
npm start
```

You should see:
```
✅ Firebase Admin initialized successfully
✅ MongoDB Connected Successfully!
🚀 Server is running on port 5001
```

### Step 2: Test Frontend

```bash
cd frontend
npm start
```

The app should open at `http://localhost:3000` with working social login buttons.

## 🔐 Google OAuth Additional Setup

### For Production (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID
5. Add your domain to "Authorized JavaScript origins"
6. Add your redirect URI to "Authorized redirect URIs"

## 🍎 Apple OAuth Additional Setup

### For Production (Required for Apple)

1. You need an Apple Developer account
2. Create an App ID in Apple Developer Portal
3. Enable "Sign In with Apple" capability
4. Create a Service ID
5. Configure the Service ID with your domain
6. Generate a private key
7. Update Firebase with Apple configuration

## 🚨 Troubleshooting

### Common Issues

1. **"Service account object must contain a string 'project_id' property"**
   - Check your `FIREBASE_PROJECT_ID` is set correctly
   - Verify the service account JSON is valid

2. **"Firebase Admin initialization failed"**
   - Check all three Firebase environment variables are set
   - Verify the private key format (with \n for newlines)

3. **"Social login is not configured on the server"**
   - This means Firebase Admin SDK is not initialized
   - Check your backend environment variables

4. **Frontend Firebase errors**
   - Verify all `REACT_APP_FIREBASE_*` variables are set
   - Check Firebase project settings match your config

### Testing Without Firebase

The application will work without Firebase configuration:
- Traditional email/password authentication will work
- Social login buttons will show an error message
- All other features remain functional

## 📝 Security Notes

1. Never commit your `.env` files to version control
2. Keep your Firebase service account key secure
3. Use different Firebase projects for development and production
4. Enable Firebase Security Rules for production

## 🎉 Success!

Once configured, your users will be able to:
- Sign up/in with email and password
- Sign up/in with Google
- Sign up/in with Apple (with additional setup)
- Seamlessly switch between authentication methods

For support, check the main README.md or create an issue in the repository.
