import User from '../models/User.js';
import { signToken } from '../utils/token.js';

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      const error = new Error('Email already registered');
      error.status = 409;
      throw error;
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: signToken(user), user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    res.json({ token: signToken(user), user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: serializeUser(req.user) });
}
