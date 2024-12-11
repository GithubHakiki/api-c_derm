require('dotenv').config();
const express = require('express');
const cors = require('cors');
const changeController = require('./controllers/changeController');
const userController = require('./controllers/userController');
const otpController = require('./controllers/otpController');
const logoutController = require('./controllers/logoutController');
const userRouter = require('./routes/userRouter');
const { getArticles } = require('./controllers/articlesController');
const authenticateJWT = require('./middleware/authenticateJWT');

const app = express();

// Konfigurasi CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['POST', 'GET', 'PUT'],
  credentials: true,
}));

app.use(express.json());

// Middleware Global
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rute Root
app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
app.use('/api', authenticateJWT, userRouter);

// Auth-related routes
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/verify-otp', otpController.verifyOtp);
app.post('/logout', authenticateJWT, logoutController.logout);

// Change-related routes
app.put('/change-username', authenticateJWT, changeController.changeUsername);
app.put('/change-password', authenticateJWT, changeController.changePassword);

// Public content routes
app.get('/articles', getArticles);

// Menangani rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Menangani error di server
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// Menjalankan server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
