const mongoose = require("mongoose");
const initData = require("./data.js");
const User = require("../models/user.js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging: Check if MONGO_URI is loaded

main()
    .then(() => {
        console.log("✅ Database connected successfully");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb+srv://mafimashrafi78:O3K42wqTUeEDrsQq@budgetmanagement.ukuq0bp.mongodb.net/budgetManagement", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
}

const initDB = async () => {
    await User.deleteMany({});
    await User.insertMany(initData.data);
    console.log("✅ Database initialized successfully");
};

initDB();