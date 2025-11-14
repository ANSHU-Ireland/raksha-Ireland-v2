const express = require('express');
const router = express.Router();
const { getDistance } = require('geolib');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const SOS_RADIUS_KM = 3;

// Send SOS alert
router.post('/alert', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location is required' });
    }

    // Get user info
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create SOS alert
    const alertResult = await db.run(
      "INSERT INTO sos_alerts (user_id, latitude, longitude) VALUES (?, ?, ?)",
      [userId, latitude, longitude]
    );

    // Find users within 3km radius
    const allUsers = await db.query(
      "SELECT id, name, last_location_lat, last_location_lng FROM users WHERE status = 'approved' AND id != ? AND last_location_lat IS NOT NULL AND last_location_lng IS NOT NULL",
      [userId]
    );

    const nearbyUsers = allUsers.filter(u => {
      if (!u.last_location_lat || !u.last_location_lng) return false;
      const distance = getDistance(
        { latitude, longitude },
        { latitude: u.last_location_lat, longitude: u.last_location_lng }
      );
      return distance <= SOS_RADIUS_KM * 1000; // Convert km to meters
    });

    // Send real-time alerts via Socket.IO
    const io = req.app.get('io');
    const activeUsers = req.app.get('activeUsers');

    const alertData = {
      alertId: alertResult.id,
      userId: user.id,
      userName: user.name,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };

    nearbyUsers.forEach(nearbyUser => {
      const socketId = activeUsers.get(nearbyUser.id);
      if (socketId) {
        io.to(socketId).emit('sos-alert', alertData);
      }
    });

    res.json({
      success: true,
      alertId: alertResult.id,
      notifiedUsers: nearbyUsers.length
    });
  } catch (error) {
    console.error('SOS alert error:', error);
    res.status(500).json({ error: 'Failed to send SOS alert' });
  }
});

// Get recent SOS alerts (for testing/admin)
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const alerts = await db.query(
      `SELECT 
        sos_alerts.*, 
        users.name as user_name, 
        users.county 
      FROM sos_alerts 
      JOIN users ON sos_alerts.user_id = users.id 
      ORDER BY sos_alerts.created_at DESC 
      LIMIT 50`
    );

    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

module.exports = router;

