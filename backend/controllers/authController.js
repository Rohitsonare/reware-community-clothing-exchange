import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      logger.info('✅ Firebase Admin initialized successfully');
    } else {
      logger.warn('⚠️  Firebase Admin credentials not found. Social login will be disabled.');
    }
  } catch (error) {
    logger.error('❌ Firebase Admin initialization failed:', error.message);
  }
}

export const signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      points: 100, // Welcome bonus points
    });

    await user.save();
    logger.info(`User ${email} created successfully`);

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res
        .status(401)
        .json({ message: 'Please sign in with your social account (Google/Apple)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Failed login attempt for ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    logger.info(`User ${email} signed in successfully`);

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
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
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({ message: 'Social login is not configured on the server.' });
    }

    const { idToken, email, name, photoURL } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: name || email.split('@')[0],
        avatar: photoURL,
        googleId: uid,
        isVerified: true,
        points: 100,
      });
      await user.save();
      logger.info(`New Google user ${email} created successfully`);
    } else {
      // Update existing user
      if (!user.googleId) {
        user.googleId = uid;
        if (!user.profilePicture) user.profilePicture = photoURL; // Changed from avatar to profilePicture to match schema
        await user.save();
      }
      logger.info(`Existing user ${email} signed in with Google`);
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const appleLogin = async (req, res, next) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({ message: 'Social login is not configured on the server.' });
    }

    const { idToken, email, name, photoURL } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name || 'Apple User',
        email,
        appleId: uid,
        profilePicture: photoURL,
        points: 100,
      });
      await user.save();
      logger.info(`✅ New Apple user ${email} created successfully`);
    } else {
      if (!user.appleId) {
        user.appleId = uid;
        if (photoURL) user.profilePicture = photoURL;
        await user.save();
      }
      logger.info(`✅ Existing user ${email} signed in with Apple`);
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
};
