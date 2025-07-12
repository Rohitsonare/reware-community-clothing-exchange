import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Test route to verify CORS and API connectivity
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working correctly!' });
});

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || (req.path === '/signup' && !name)) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  if (password.length < 6) {
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

export default router;
