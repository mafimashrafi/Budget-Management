const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    phoneNumber: {
        type: String,
        
        unique: true,
    },
    image:{
        type: String,
        default: "/image/logo.png",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User; 