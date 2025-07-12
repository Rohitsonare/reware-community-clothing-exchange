# ReWear - Community Clothing Exchange Platform

A modern, full-stack web application for community-driven clothing exchange with beautiful UI/UX and social login integration.

## 🚀 Features

- **Beautiful, Modern UI**: Clean, responsive design with Material-UI components
- **Social Authentication**: Google and Apple login integration
- **Traditional Auth**: Email/password authentication with secure JWT tokens
- **Points System**: Reward users for participating in clothing exchanges
- **Secure Backend**: Express.js with MongoDB and Firebase authentication
- **Modern Frontend**: React with modern hooks and animations
- **Separated Architecture**: Clean separation between frontend and backend

## 🛠️ Tech Stack

### Frontend
- React 19.1.0
- Material-UI (MUI) 7.2.0
- Framer Motion for animations
- Firebase Auth for social login
- React Router for navigation
- Axios for API calls

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT for authentication
- bcryptjs for password hashing

## 📁 Project Structure

```
reware-communtiy-clothing-exchange/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Authentication components
│   │   │   └── dashboard/    # Dashboard components
│   │   ├── services/         # API services
│   │   └── firebase.js       # Firebase configuration
│   ├── package.json
│   └── .env                  # Frontend environment variables
├── backend/                  # Express.js backend
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── package.json
│   └── .env                  # Backend environment variables
├── package.json              # Root package.json for scripts
└── README.md
```

## 🎨 UI/UX Features

### Enhanced Sign-In Page
- Beautiful gradient header cards
- Social login buttons (Google & Apple)
- Animated form transitions
- Password visibility toggle
- Modern glassmorphism design
- Input validation with icons

### Enhanced Sign-Up Page
- Consistent design with sign-in
- Form validation with real-time feedback
- Password strength requirements
- Confirm password matching
- Social registration options

### Animations
- Smooth page transitions with Framer Motion
- Loading states with circular progress
- Hover effects on buttons
- Form input animations

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Firebase account for social authentication

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reware-communtiy-clothing-exchange
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication and configure Google & Apple providers
3. Create a web app and copy the configuration
4. Generate a Firebase Admin SDK service account key

### 4. Environment Configuration

#### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Backend (.env)
```env
MONGO_URI=mongodb://127.0.0.1:27017/reware
JWT_SECRET=your_jwt_secret_key
PORT=5001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### 5. Start MongoDB
```bash
mongod
```

### 6. Run the Application
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5001) concurrently.

## 🔐 Authentication Flow

### Traditional Authentication
1. User signs up with email/password
2. Password is hashed with bcrypt
3. JWT token is generated and stored
4. User can sign in with credentials

### Social Authentication
1. User clicks Google/Apple sign-in
2. Firebase handles OAuth flow
3. ID token is verified on backend
4. User is created/updated in database
5. JWT token is issued for app access

## 🌟 Key Features Implemented

### Enhanced UI/UX
- ✅ Beautiful gradient headers
- ✅ Social login buttons with proper styling
- ✅ Input icons and validation
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling with styled alerts

### Social Login Integration
- ✅ Google OAuth with Firebase
- ✅ Apple OAuth with Firebase
- ✅ Backend token verification
- ✅ User creation/linking
- ✅ Profile picture integration

### Separated Frontend
- ✅ Dedicated frontend folder
- ✅ Independent package.json
- ✅ Environment configuration
- ✅ Build and development scripts

## 🚀 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run frontend` - Start only frontend
- `npm run backend` - Start only backend
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## 🎯 Future Enhancements

- Clothing item management
- User profiles and ratings
- Messaging system
- Exchange history
- Admin dashboard
- Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, Node.js, and Firebase

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
