const express = require("express");
const bodyparser = require("body-parser");

const keyGenerator = require("generate-key");
const moment = require("moment");
const mongoose = require("mongoose");

const app = express();
app.use(bodyparser.json());

app.get("/test", function(req, res){
    res.send("Hello")
})

const port = process.env.port || 8000;

app.listen(port, function(){
    console.log("The server works at :", port)
})

