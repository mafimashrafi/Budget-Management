const express = require("express"); 
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//requiring models
const User = require("./models/user.js"); 
const verfyUser = require("./middlewares/authMiddleware.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());


const port = 8080;

//connection local mongodb
main()
    .then(() => {
        console.log("✅ Database connected successfully");
    }).catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/budgetManagement");
};


const allowedPages=[
    'userProfile', 
    'savingsGoal',
    'budget', 'transaction', 
    'incomeCategory', 'expenseCategory',
    'dashboard', 'taxCalculation',
    'multiCurrency',
    'transactionHst', 'billReminder', 
    'emergency', 'exportData', 
    'investmentTracker', 'recurringtransaction', 
    'report', 'subscriptions', 'suggestions'];


const coverPages = ['login', 'register'];

//cover page
app.get('/', (req, res) =>{
    // using global pages array
    res.render("cover.ejs", {coverPages});
});

//home page
app.get('/home', verfyUser, (req, res) =>{
    res.render("home.ejs", {allowedPages});
});

//requiring route
const registerRoute = require("./routes/registerRoute.js");
const profileRoute = require("./routes/profileRoute.js");
const loginRoute = require("./routes/loginRoute.js");
const suggestionRoute = require("./routes/suggestionRoute.js");
const budgetRoute = require("./routes/budgetRoute.js");
const savingGoalsRoute = require("./routes/savingGoalsRoute.js");
const multiCurrency = require("./routes/multicurrencyRoute.js");
const subscriptions = require("./routes/subscriptionRoute.js");
const expenseCatagory = require("./routes/expenseCategoryRoute.js");

app.use("/", registerRoute); 
app.use("/", loginRoute); 
app.use("/", profileRoute);
app.use("/", suggestionRoute);
app.use("/", budgetRoute);
app.use("/", savingGoalsRoute);
app.use("/", multiCurrency);
app.use("/", subscriptions);
app.use("/", expenseCatagory);


app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})