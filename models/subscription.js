const mongoose = require("mongoose");
const {Schema} = mongoose;

const subscriptionSchema =  new Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriptionName: {
        type: String,
        maxlength:200,
        required: true,
    },
    subscriptionType: {
        type: String,
        required: true,
    },
    subscriptionFee: {
        type: Number,
        required: true,
    },
    startingDate:{
        type: Date,
        required: true, 
        default: new Date(),
    },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;