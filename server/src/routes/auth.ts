import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../database';
import { JWT_SECRET } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, age, gender, height, weight, activity_level, goal } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await dbRun(
      'INSERT INTO users (username, email, password, age, gender, height, weight, activity_level, goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, age || null, gender || null, height || null, weight || null, activity_level || null, goal || null]
    );
    
    console.log('✅ New user registered:', username, email);

    const userId = result.lastID;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    // Get created user with created_at
    const newUser: any = await dbGet('SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at, last_login FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        height: newUser.height,
        weight: newUser.weight,
        activity_level: newUser.activity_level,
        goal: newUser.goal,
        created_at: newUser.created_at,
        last_login: newUser.last_login
      }
    });
  } catch (error: any) {
    console.error('❌ Register error:', error);
    if (error.message && error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user: any = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await dbRun('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Get updated user with last_login
    const updatedUser: any = await dbGet('SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at, last_login FROM users WHERE id = ?', [user.id]);

    res.json({
      token,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        age: updatedUser.age,
        gender: updatedUser.gender,
        height: updatedUser.height,
        weight: updatedUser.weight,
        activity_level: updatedUser.activity_level,
        goal: updatedUser.goal,
        created_at: updatedUser.created_at,
        last_login: updatedUser.last_login
      }
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
