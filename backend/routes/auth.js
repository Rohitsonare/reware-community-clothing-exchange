import express from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { signupSchema, signinSchema, socialLoginSchema } from '../validation/auth.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working correctly!' });
});

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/signin', validate(signinSchema), authController.signin);
router.get('/me', authController.getCurrentUser);
router.post('/google', validate(socialLoginSchema), authController.googleLogin);
router.post('/apple', validate(socialLoginSchema), authController.appleLogin);

export default router;
