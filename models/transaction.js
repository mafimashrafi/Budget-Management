const mongoose = require("mongoose");
const {Schema} = mongoose;

const newTransactionSchema = new Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date:{
        type: Date,
        default: new Date(),
        required: true,
    },
    note: {
        type: String,
        maxlength: 100,
    },
    explainSpends: {
        type: String,
        maxlength: 500,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const Transaction = mongoose.model("Transaction", newTransactionSchema);
module.exports = Transaction;