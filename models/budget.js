const mongoose = require("mongoose");
const {Schema} = mongoose;

const budgetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    todo: {
        type: String,
        required: true,
        maxlength: 100,
    },
    budget:{
        type: Number,
        required: true,
    },
});

const BudgetList = mongoose.model("BudgetList", budgetSchema);
module.exports = BudgetList;