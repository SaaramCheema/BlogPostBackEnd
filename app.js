const express = require("express")
const mongoose  =require("mongoose")
const app = express();
const router = require("./Routes/userRoutes");
const Postrouter = require("./Routes/postRoutes");
const adminRouter = require("./Routes/adminRoutes");

app.use(express.json());
app.use("/user",router);
app.use("/admin",adminRouter);
app.use("/posts",Postrouter);
/**/
    mongoose.connect('mongodb+srv://i211226:webassignmentpass@cluster0.ditfwqw.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("Connected to Database!");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log("Error: "+err);
});
/*
const express = require("express")
const mongoose  =require("mongoose")
const app = express();
const user = require("./models/User.schema");
const Userrouter = require("./Routes/UserRoutes");
app.use(express.json())
const cors = require("cors")
require("dotenv").config()
const upload = require("express-fileupload")
app.use(upload())

app.use("/uploads" , express.static("uploads"))

app.listen(3000)
app.use(cors({
    origin:'*'
}))

app.use("/user" ,  Userrouter)

app.get("/" , (req , res)=>{
    res.json({"Meeage":"Hello"})
})

mongoose.connect(process.env.MONGODB_STRING).then(()=>{
    console.log("Connected")
}).catch(err=>{
    console.log(err)
})*/