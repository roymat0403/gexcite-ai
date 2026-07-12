import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body as SignUpRequest;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered with Gexcite' });
    }

    user = new User({
      email,
      password,
      firstName,
      lastName,
      subscriptionPlan: 'free-trial',
      leadsLimit: 50
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'gexcite-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Welcome to Gexcite! Your free trial starts now.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscriptionPlan: user.subscriptionPlan,
        trialEndsAt: user.trialEndsAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating Gexcite account', error });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Gexcite credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Gexcite credentials' });
    }

    if (user.subscriptionPlan === 'free-trial' && new Date() > user.trialEndsAt!) {
      return res.status(403).json({ 
        message: 'Your Gexcite free trial has expired. Please upgrade to continue.',
        trialExpired: true
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'gexcite-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Welcome back to Gexcite!',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscriptionPlan: user.subscriptionPlan,
        trialEndsAt: user.trialEndsAt,
        leadsGenerated: user.leadsGenerated
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging into Gexcite', error });
  }
});

export default router;