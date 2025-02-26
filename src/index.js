const { config } = require("./config/config");
const { PORT } = config;
const { connectDB } = require("./config/db");
const { app } = require("./app");

connectDB().then(() => {
    app.on("error", (error) => {
        console.error("Error", error);
        throw error;
    })
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`)
    })
}).catch((error) => {
    console.log("MongoDB connection failed !!!", error);
});

