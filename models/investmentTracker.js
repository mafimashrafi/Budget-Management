const mongoose = require("mongoose");
const {Schema} = mongoose;

const investmentSchema =  new Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    investmentName: {
        type: String,
        maxlength:200,
        required: true,
    },
    investmentType: {
        type: String,
        required: true,
    },
    investedAmount: {
        type: Number,
        required: true,
    },
    investingDate:{
        type: Date,
        required: true, 
        default: new Date(),
    },
});

const Investment = mongoose.model("Investment", investmentSchema);
module.exports = Investment;