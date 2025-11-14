const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// Get pending users
router.get('/pending-users', authenticateAdmin, async (req, res) => {
  try {
    const users = await db.query(
      "SELECT id, name, age, sex, county, email, created_at FROM users WHERE status = 'pending' ORDER BY created_at DESC"
    );
    res.json({ users });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: 'Failed to get pending users' });
  }
});

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await db.query(
      "SELECT id, name, age, sex, county, email, status, approved_at, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Approve user
router.post('/approve-user/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.admin.adminId;

    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'approved') {
      return res.status(400).json({ error: 'User already approved' });
    }

    // Update user status
    await db.run(
      "UPDATE users SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = ? WHERE id = ?",
      [adminId, userId]
    );

    // Generate password setup token
    const token = Buffer.from(`${user.email}-${user.id}`).toString('base64');
    const setupUrl = `${process.env.APP_URL || 'http://localhost:3001'}/set-password?email=${encodeURIComponent(user.email)}&token=${token}`;

    // Send approval email
    await sendEmail({
      to: user.email,
      subject: 'Account Approved - Set Your Password',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Account Approved</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.name},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Your account has been approved. Please set your password to start using the Raksha Ireland app.
          </p>
          <a href="${setupUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">
            Set Password
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            Or copy this link: ${setupUrl}
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'User approved and email sent' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Reject user
router.post('/reject-user/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await db.run("DELETE FROM users WHERE id = ?", [userId]);

    // Send rejection email
    await sendEmail({
      to: user.email,
      subject: 'Registration Not Approved',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Registration Not Approved</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.name},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Unfortunately, your registration request could not be approved at this time.
            ${reason ? `<br><br>Reason: ${reason}` : ''}
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'User rejected and email sent' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

// Get SOS alerts statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await db.get("SELECT COUNT(*) as count FROM users WHERE status = 'approved'");
    const pendingUsers = await db.get("SELECT COUNT(*) as count FROM users WHERE status = 'pending'");
    const totalAlerts = await db.get("SELECT COUNT(*) as count FROM sos_alerts");
    const todayAlerts = await db.get(
      "SELECT COUNT(*) as count FROM sos_alerts WHERE DATE(created_at) = DATE('now')"
    );

    res.json({
      totalUsers: totalUsers.count,
      pendingUsers: pendingUsers.count,
      totalAlerts: totalAlerts.count,
      todayAlerts: todayAlerts.count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;

