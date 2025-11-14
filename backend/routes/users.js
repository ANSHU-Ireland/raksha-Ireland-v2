const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Update user location
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    await db.run(
      "UPDATE users SET last_location_lat = ?, last_location_lng = ?, last_location_updated = CURRENT_TIMESTAMP WHERE id = ?",
      [latitude, longitude, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await db.get("SELECT id, name, age, sex, county, email, status FROM users WHERE id = ?", [userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;

