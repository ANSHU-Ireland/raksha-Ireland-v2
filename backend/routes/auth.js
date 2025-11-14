const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { sendEmail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'raksha-secret-key-change-in-production';

// Register new user (pending approval)
router.post('/register', async (req, res) => {
  try {
    const { name, age, sex, county, email } = req.body;

    if (!name || !age || !sex || !county || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Insert user with pending status
    const result = await db.run(
      "INSERT INTO users (name, age, sex, county, email, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [name, age, sex, county, email]
    );

    res.json({ 
      success: true, 
      message: 'Registration successful. Waiting for admin approval.',
      userId: result.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Set password after approval
router.post('/set-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ error: 'Email, token, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify token
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'approved') {
      return res.status(400).json({ error: 'Account not approved yet' });
    }

    // Simple token verification (in production, use proper token system)
    const expectedToken = Buffer.from(`${email}-${user.id}`).toString('base64');
    if (token !== expectedToken) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Hash and set password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    res.json({ success: true, message: 'Password set successfully' });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Account pending approval' });
    }

    if (!user.password) {
      return res.status(403).json({ error: 'Password not set. Please set your password first.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        county: user.county
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await db.get("SELECT * FROM admins WHERE email = ?", [email]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

