const mongoose = require("mongoose");
const {Schema} = mongoose;

const incomeCategorySchema = new Schema({
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
    earning:{
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

const IncomeCategory = mongoose.model("IncomeCategory", incomeCategorySchema);
module.exports = IncomeCategory;