const express = require('express');
const app = express();
const { config } = require('./config/constants.config');
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
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// admin Route
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// common Route
const commonRoutes = require('./routes/common.routes');
app.use('/api', commonRoutes);

const { authenticate } = require("./middleware/auth.middleware");
const { onlyAdminAccess } = require("./middleware/admin.middleware");

// AllRoutes route
const { getAllRoutes } = require('./controllers/admin/router.controller');
app.get('/api/admin/get-routes', authenticate, onlyAdminAccess, getAllRoutes);


module.exports = { app };