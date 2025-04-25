const mongoose = require("mongoose");
const {Schema} = mongoose;

const billReminderSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        ref: 'User',
        required: true,
    },
    billToRemind: {
        type: String,
        required: true,
        maxlength: 200,
    },
    reminderDate:{
        type: Date,
        required: true,
    },
    sent: {
        type: Boolean,
        default: false,
    },
});

const BillReminder = mongoose.model("BillReminder", billReminderSchema);
module.exports = BillReminder;