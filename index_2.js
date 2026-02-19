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
}))


app.listen(PORT, ()=>{
    console.log('runnig');
})


const route = require('./route/flutter_route');
app.use("/api", route);

app.post("/api/addUser", async(req,res)=>{
    console.log("final", userData);

    res.status(200).send({
        "status_code":200,
        "msg":"user added",
        "data":userData
    })
});


