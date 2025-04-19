const mongoose = require("mongoose");
const { Schema } = mongoose;

const sgsSchema = new Schema({
    post:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 200,
    },
    postDate:{
        type: Date,
        default: Date.now,
    },
    postBy: {
        type: String,
        required: true,
    },
});

const Suggestion = mongoose.model("Suggestion", sgsSchema);
module.exports = Suggestion; 