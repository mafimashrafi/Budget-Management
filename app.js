const express = require("express"); 
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const sendEmail = require('./utils/emailService');
const Reminder = require("./models/billreminders.js")
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = 8080;

main()
    .then(() => {
        console.log("✅ Database connected successfully");
    }).catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
};

const billReminder = require("./routes/billReminderRoute.js");
app.use("/", billReminder);

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const reminders = await Reminder.find({ sent: false, reminderDate: { $lte: now } });
    
    for (let reminder of reminders) {
      await sendEmail(reminder.email, 'Reminder', `Don't forget: ${reminder.task}`);
      reminder.sent = true;
      await reminder.save();
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));


const coverPages = ['login', 'register'];


app.get('/', (req, res) =>{
    res.render("cover.ejs", {coverPages});
});


const registerRoute = require("./routes/registerRoute.js");
const profileRoute = require("./routes/profileRoute.js");
const loginRoute = require("./routes/loginRoute.js");
const suggestionRoute = require("./routes/suggestionRoute.js");
const budgetRoute = require("./routes/budgetRoute.js");
const savingGoalsRoute = require("./routes/savingGoalsRoute.js");
const multiCurrency = require("./routes/multicurrencyRoute.js");
const subscriptions = require("./routes/subscriptionRoute.js");
const expenseCatagory = require("./routes/expenseCategoryRoute.js");
const incomeCatagory = require("./routes/incomeCategoryRoute.js");
const emergency = require("./routes/emergencyRoute.js");
const investmentTracker = require("./routes/investmentTrackerRoute.js");
const transaction = require("./routes/transactionRoute.js");
const recurringTransaction = require("./routes/recurringTransactionRoute.js");
const transactionHST = require("./routes/transactionHSTRoute.js");
const taxCalculation = require("./routes/taxCalculationRoute.js");
const dashboard = require("./routes/dashboardRoute.js");
const report = require("./routes/reportRoute.js");

app.use("/", registerRoute); 
app.use("/", loginRoute); 
app.use("/", profileRoute);
app.use("/", suggestionRoute);
app.use("/", budgetRoute);
app.use("/", savingGoalsRoute);
app.use("/", multiCurrency);
app.use("/", subscriptions);
app.use("/", expenseCatagory);
app.use("/", incomeCatagory);
app.use("/", emergency);
app.use("/", investmentTracker);
app.use("/", transaction);
app.use("/", recurringTransaction);
app.use("/", transactionHST);
app.use("/", taxCalculation);
app.use("/", dashboard);
app.use("/", report);


app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})