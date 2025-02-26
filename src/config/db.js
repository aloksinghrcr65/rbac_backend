const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");
const { config } = require("./config");

const { MONGODB } = config;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB}/${DB_NAME}`);

        console.log(`✅ [${new Date().toISOString()}] MongoDB connected successfully!`);
        console.log(`📌 Database: ${DB_NAME}`);
        console.log(`🔗 Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`❌ [${new Date().toISOString()}] MongoDB connection failed!`);
        console.error(`🔍 Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB };
