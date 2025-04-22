const mongoose = require("mongoose");
const {Schema} = mongoose;

const savingsGoalSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    savingSource: {
        type: String,
        required: true, 
    },
    goals: {
        type: String,
        required: true,
        maxlegnth: 200,
    },
    estimatedSave:{
        type: Number,
        required: false,
    },
    savedAmount: {
        type: Number,
        required:false,
        default: 0, 
    },
    targetMonth: {
        type: String,
    },
    done: {
        type: Boolean,
        default: false,
    },
});

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);
module.exports = SavingsGoal; 