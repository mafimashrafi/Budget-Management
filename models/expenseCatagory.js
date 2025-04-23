const mongoose = require("mongoose");
const {Schema} = mongoose;

const expenseCategorySchema = new Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category:{
        type: String,
        require: true,
        maxlength: 200,
    },
    cost:{
        type: Number,
        require: true,
    },
    month: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    }
});

const ExpenseCategory = mongoose.model("ExpenseCategory", expenseCategorySchema);
module.exports = ExpenseCategory;