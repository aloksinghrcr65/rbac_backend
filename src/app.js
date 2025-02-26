const express = require('express');
const app = express();
const { config } = require('./config/config');
const { CORS_ORIGIN } = config;
const cookieParser = require('cookie-parser');

const cors = require('cors');
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));

app.use(cookieParser());

// auth Route
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// admin Route
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

module.exports = { app };