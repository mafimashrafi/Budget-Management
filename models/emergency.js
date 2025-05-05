const mongoose = require("mongoose");
const {Schema} = mongoose;

const newEmergencySchema =  new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    targetfund:{
        type: Number,
        default: 0,
    },
    currentfund:{
        type: Number,
        required: true,
    },
    depositedAmount: {
        type: Number,
        required: true,
    },
    note:{
        type: String,
        maxlength: 200,
    },
    depositeDate: {
        type: Date,
        default: new Date(),
    },
});

const EmergencyFund = mongoose.model("EmergencyFund", newEmergencySchema);
module.exports = EmergencyFund;