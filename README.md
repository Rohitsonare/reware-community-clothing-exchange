Team name - 
Rohit sonare 
Gmail -rohitsonare465@gmail.com

problem statement -
# ReWear - Community Clothing Exchange Platform
Overview:
Develop ReWear, a web-based platform that enables users to exchange unused clothing
through direct swaps or a point-based redemption system. The goal is to promote sustainable
fashion and reduce textile waste by encouraging users to reuse wearable garments instead of
discarding them.

A modern, full-stack web application for community-driven clothing exchange with beautiful UI/UX, advanced item listing, and social login integration.



## 🚀 Features

- **Beautiful, Modern UI**: Clean, responsive design with Material-UI components
- **Advanced Item Listing**: Full-featured item browse with search, filters, and pagination
- **Item Detail Pages**: Comprehensive item view with image gallery and interaction
- **Social Authentication**: Google and Apple login integration
- **Traditional Auth**: Email/password authentication with secure JWT tokens
- **Like/Unlike System**: Users can like items and track favorites
- **Swap Request System**: Request to swap items with other users
- **Advanced Search & Filtering**: Search by title, filter by category, size, condition, availability
- **Responsive Design**: Grid/list view toggle, mobile-friendly interface
- **Real-time Updates**: Live item availability and interaction feedback
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
- Lodash for utility functions

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT for authentication
- bcryptjs for password hashing
- Comprehensive API endpoints for items, users, and swaps

## 📁 Project Structure

```
reware-communtiy-clothing-exchange/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── ItemListingPage.js    # Main item listing page
│   │   │   ├── ItemDetailPage.js     # Item detail view
│   │   │   ├── BrowseItems.js        # Browse items component
│   │   │   └── LandingPage.js        # Landing page
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── services/         # API services
│   │   └── firebase.js       # Firebase configuration
│   ├── package.json
│   └── .env                  # Frontend environment variables
├── backend/                  # Express.js backend
│   ├── models/               # MongoDB models (User, Item, Swap)
│   ├── routes/               # API routes (auth, dashboard, items)
│   ├── seed.js               # Database seeding script
│   ├── package.json
│   └── .env                  # Backend environment variables
├── test-app.sh               # API testing script
├── package.json              # Root package.json for scripts
└── README.md
```

## 🎨 UI/UX Features

### Item Listing Page
- **Advanced Search**: Real-time search by item title and description
- **Smart Filtering**: Filter by category, size, condition, and availability
- **Flexible Views**: Toggle between grid and list view layouts
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Pagination**: Efficient browsing with page-based navigation
- **Category Statistics**: Visual breakdown of items by category
- **Like/Unlike**: Heart button to save favorite items
- **Swap Requests**: Direct swap request functionality

### Item Detail Page
- **Image Gallery**: High-quality image display with navigation
- **Comprehensive Details**: Full item information including owner details
- **Interactive Actions**: Like, unlike, and swap request buttons
- **Owner Information**: Profile pictures and user details
- **Responsive Layout**: Mobile-friendly detail view

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

#### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_BACKEND_URL=http://localhost:5001
```

### 5. Seed the Database (Optional)
```bash
cd backend
npm run seed
```
This will populate your database with sample users and items for testing.

### 6. Start MongoDB
```bash
mongod
```

### 7. Run the Application
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5001) concurrently.

## 🧪 Testing

### API Testing
Run the comprehensive API test script:
```bash
chmod +x test-app.sh
./test-app.sh
```

This script tests all major API endpoints including:
- Item listing and filtering
- Search functionality
- Like/unlike operations
- Category statistics
- Pagination

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

### Item Listing & Management
- ✅ Advanced item listing page with search and filters
- ✅ Item detail pages with image galleries
- ✅ Like/unlike functionality for items
- ✅ Swap request system
- ✅ Category-based filtering and statistics
- ✅ Size and condition filtering
- ✅ Availability status tracking
- ✅ Pagination for large item lists
- ✅ Grid and list view options
- ✅ Responsive design for all devices

### Backend API
- ✅ Comprehensive item API with filtering
- ✅ Search functionality across title and description
- ✅ Like/unlike endpoints
- ✅ Category statistics endpoint
- ✅ Pagination support
- ✅ User authentication integration
- ✅ Error handling and validation

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

### Data Management
- ✅ MongoDB integration with Mongoose
- ✅ Database seeding script
- ✅ Comprehensive data models
- ✅ Test data generation

## � API Endpoints

### Items API
- `GET /api/items` - Get all items with filtering and pagination
  - Query params: `page`, `limit`, `search`, `category`, `size`, `condition`, `isAvailable`
- `GET /api/items/stats` - Get category statistics
- `GET /api/items/:id` - Get specific item details
- `POST /api/items/:id/like` - Like an item (requires authentication)
- `DELETE /api/items/:id/like` - Unlike an item (requires authentication)
- `POST /api/items/:id/swap` - Request a swap (requires authentication)

### Authentication API
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/apple` - Apple OAuth login

### Dashboard API
- `GET /api/dashboard` - Get user dashboard data (requires authentication)

## �🚀 Available Scripts

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
- `npm run seed` - Seed database with test data

## 🎯 Future Enhancements

- Advanced messaging system between users
- User profiles and ratings system
- Exchange history and tracking
- Admin dashboard for moderation
- Mobile app (React Native)
- Push notifications
- Image upload and management
- Advanced recommendation system
- Geolocation-based filtering
- Multi-language support

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

Built with ❤️ using React, Node.js, MongoDB, and Firebase
