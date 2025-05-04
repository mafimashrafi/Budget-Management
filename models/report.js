const mongoose = require("mongoose");
const { Schema } = mongoose;

const newReport = new Schema({
    report:{
        type: String,
        maxlength: 500,
    },
    date: {
        type: Date,
        default: new Date(),
    },
});

const Report = mongoose.model("Report", newReport);
module.exports = Report;