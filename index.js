const express = require("express"); 
const app = express();
const path = require("path");

const port = 8080;

//app.use(express.urlencoded({extended: true}));
// app.use(express.json);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const allowedPages=['savingsGoal', 'budget', 'transaction', 'incomeCategory', 'expenseCategory', 'dashboard', 'taxCalculation', 'multiCurrency',
    'transactionHst', 'billReminder'];

app.get('/', (req, res) =>{
    // using global pages array
    res.render("index.ejs", {allowedPages});
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


app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})