const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
// Lokalna podatkovna baza
var dbURI = "mongodb://127.0.0.1/CourSense";

// MongoDB Atlas podatkovna baza v oblaku
if (process.env.NODE_ENV === "production")
    dbURI = process.env.MONGODB_ATLAS_URI;
// Lokalna Docker podatkovna baza
else if (process.env.NODE_ENV === "test")
    dbURI = "mongodb://coursense-mongo-db/CourSense";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to '" + dbURI + "'.");
});
mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected.");
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log("Mongoose disconnected through '" + msg + "'.");
        callback();
    });
};
process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => {
        process.kill(process.pid, "SIGUSR2");
    });
});
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => {
        process.exit(0);
    });
});
process.on("SIGTERM", () => {
    gracefulShutdown("Cloud-based app shutdown", () => {
        process.exit(0);
    });
});

require("./schemas");