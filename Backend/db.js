const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/i-notebook"; // /i-notebook is added and it creates new table in database

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Success");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;