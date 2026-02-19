const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URL;
mongoose.connect(MONGO,{})
.then(()=>{
    console.log("Success");
})
.catch((err)=> console.log(err))


app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

const route = require('./route/flutter_route');
const authRoute = require('./route/Auth_Routes');
const productRoute = require('./route/productRoute');
app.use("/api", route);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);


app.listen(PORT, ()=>{
    console.log('runnig');
})




