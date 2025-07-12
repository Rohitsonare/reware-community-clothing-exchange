import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

// Initialize Firebase Admin (you'll need to set this up with your service account)
if (!admin.apps.length) {
  try {
    // Check if we have Firebase credentials
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      console.log('⚠️  Firebase Admin credentials not found. Social login will be disabled.');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('⚠️  Social login will be disabled.');
  }
}

// Test route to verify CORS and API connectivity
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working correctly!' });
});

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || (req.path === '/signin' && !password) || (req.path === '/signup' && (!name || !password))) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  next();
};

// Signup
router.post('/signup', validateInput, async (req, res) => {
  const { email, password, name } = req.body;
  try {
    console.log(`📝 Signup request for ${email}`);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ Signup failed: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      points: 100 // Welcome bonus points
    });

    await user.save();
    console.log(`✅ User ${email} created successfully`);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Error creating account. Please try again.' });
  }
});

// Signin
router.post('/signin', validateInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`🔑 Signin request for ${email}`);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Signin failed: User ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user has a password (for social login users)
    if (!user.password) {
      console.log(`❌ Signin failed: User ${email} registered with social login`);
      return res.status(401).json({ message: 'Please sign in with your social account (Google/Apple)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Signin failed: Invalid password for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ User ${email} signed in successfully`);
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('❌ Signin error:', err);
    res.status(500).json({ message: 'Error signing in. Please try again.' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Auth error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Google OAuth signin
router.post('/google', async (req, res) => {
  try {
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      return res.status(500).json({ message: 'Social login is not configured on the server.' });
    }

    const { idToken, email, name, photoURL } = req.body;
    
    console.log(`🔑 Google signin request for ${email}`);
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        googleId: uid,
        profilePicture: photoURL,
        points: 100 // Welcome bonus points
      });
      await user.save();
      console.log(`✅ New Google user ${email} created successfully`);
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = uid;
        if (photoURL) user.profilePicture = photoURL;
        await user.save();
      }
      console.log(`✅ Existing user ${email} signed in with Google`);
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('❌ Google signin error:', err);
    res.status(500).json({ message: 'Google authentication failed. Please try again.' });
  }
});

// Apple OAuth signin
router.post('/apple', async (req, res) => {
  try {
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      return res.status(500).json({ message: 'Social login is not configured on the server.' });
    }

    const { idToken, email, name, photoURL } = req.body;
    
    console.log(`🔑 Apple signin request for ${email}`);
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        name: name || 'Apple User',
        email,
        appleId: uid,
        profilePicture: photoURL,
        points: 100 // Welcome bonus points
      });
      await user.save();
      console.log(`✅ New Apple user ${email} created successfully`);
    } else {
      // Update existing user with Apple info if not already set
      if (!user.appleId) {
        user.appleId = uid;
        if (photoURL) user.profilePicture = photoURL;
        await user.save();
      }
      console.log(`✅ Existing user ${email} signed in with Apple`);
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('❌ Apple signin error:', err);
    res.status(500).json({ message: 'Apple authentication failed. Please try again.' });
  }
});

export default router;
