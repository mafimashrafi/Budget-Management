const express = require("express"); 
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const UserS = require("./models/user.js"); // Import the Listing model

const port = 8080;

//app.use(express.urlencoded({extended: true}));
// app.use(express.json);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
app.use(methodOverride("_method"));

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


const allowedPages=['userProfile', 'login', 'savingsGoal', 'budget', 'transaction', 'incomeCategory', 'expenseCategory', 'dashboard', 'taxCalculation', 'multiCurrency',
    'transactionHst', 'billReminder', 'emergency', 'exportData', 'investmentTracker', 'recurringtransaction', 'report', 'subscriptions', 'suggestions'];

app.get('/', (req, res) =>{
    // using global pages array
    res.render("login.ejs");
});

//home page
app.get('/home', (req, res) =>{
    res.render("home.ejs", {allowedPages});
});

//handling in dynamic way
app.get("/:page", (req, res)=>{
    const page=req.params.page;

   //using global pages array
    try{
        if(allowedPages.includes(page)){
            res.render(page);
        }else{
            throw new Error("404; error. page not found");
        }
    }catch (error){
        console.error('Error rendering page:', error.message);
        res.status(404).render('404', { message: `Page "${page}" not found.` });
    }
});

//creat new account/register
app.get('/register', async(req, res)=>{
    res.render('register.ejs');
});

app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})