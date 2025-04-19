const express = require("express"); 
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("./models/user.js"); // Import the Listing model

const port = 8080;

//app.use(express.urlencoded({extended: true}));
// app.use(express.json);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
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


const allowedPages=['userProfile', 'login', 'register', 'savingsGoal', 'budget', 'transaction', 'incomeCategory', 'expenseCategory', 'dashboard', 'taxCalculation', 'multiCurrency',
    'transactionHst', 'billReminder', 'emergency', 'exportData', 'investmentTracker', 'recurringtransaction', 'report', 'subscriptions', 'suggestions'];


const coverPages = ['login', 'register'];

app.get('/', (req, res) =>{
    // using global pages array
    res.render("cover.ejs", {coverPages});
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

//creating users
app.post("/register", async (req, res) =>{
    const {username, email, password, confirmPassword, phoneNumber} = req.body;
    // console.log(password, req.body.confirmPassword);

    if(password !== confirmPassword){
        console.log("Password do not match");
        return res.render("register.ejs", {error: "Password do not match", username, email, phoneNumber})
    };

    const existingUser = await User.findOne({email});
    if(existingUser){
        // console.log("Email already exists");
        return res.render("register.ejs", {error: "Email already exists", username, email, phoneNumber})
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name: username,
        email: email,
        password: hashPassword,
        phoneNumber: phoneNumber,
        createdAt:new Date(),
    });
    newUser.save().then(() =>{
        console.log("user created successfully");
        res.redirect("/home");
    }).catch((err)=>{
        console.log(err);
        res.render("register.ejs", {error: "Error creating user", username, email, phoneNumber});
    });
});

app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})