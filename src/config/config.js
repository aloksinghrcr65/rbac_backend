// require('dotenv').config({ path: './.env' });
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const config = {
    MONGODB: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS,
    TOKEN_KEY: process.env.SECRET_KEY
};

module.exports = {config};
