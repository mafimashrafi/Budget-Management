const mongoose = require("mongoose");
const { Schema } = mongoose;   
const initData = require("./data.js");
const User = require("../models/user.js");

main()
    .then(() => {
        console.log("✅ Database connected successfully");
    }).catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/budgetManagement");
};

const initDB = async() => {
    await User.deleteMany({});
    await User.insertMany(initData.data);
    console.log("✅ Database initialized successfully");
};

initDB();