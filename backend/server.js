const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const db = require('./database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sosRoutes = require('./routes/sos');
const adminRoutes = require('./routes/admin');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Low bandwidth optimization
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Initialize database
db.init();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.IO for real-time SOS alerts
const activeUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-location', (data) => {
    if (data.userId) {
      activeUsers.set(data.userId, socket.id);
      socket.userId = data.userId;
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);
app.set('activeUsers', activeUsers);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

