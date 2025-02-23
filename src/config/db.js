const mongoose = require('mongoose');
const { connect } = mongoose;
const { DB_NAME } = require("../constants");
const { config } = require("../utils/config");

const { MONGODB } = config;

const connectDB = async () => {
    try {
        const connectionInstance = await connect(`${MONGODB}/${DB_NAME}`);

        console.log(`\n MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB failed to connect", error);
        process.exit(1);
    }
};

module.exports = { connectDB };
