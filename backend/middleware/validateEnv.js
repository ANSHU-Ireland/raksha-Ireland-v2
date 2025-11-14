// Validate required environment variables
const validateEnv = () => {
  const required = ['JWT_SECRET'];
  const missing = [];

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Warn about insecure JWT secret in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'raksha-secret-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET in production! Change this immediately!');
  }
};

module.exports = validateEnv;

