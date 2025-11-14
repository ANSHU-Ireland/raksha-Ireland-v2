const nodemailer = require('nodemailer');

// Configure email transporter
// For production, use proper SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Fallback: If no SMTP configured, log email instead
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n=== EMAIL (SMTP not configured) ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', html);
    console.log('===================================\n');
    return { success: true, message: 'Email logged (SMTP not configured)' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    // Log email for development
    console.log('\n=== EMAIL FAILED ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('===================================\n');
    throw error;
  }
};

module.exports = { sendEmail };

