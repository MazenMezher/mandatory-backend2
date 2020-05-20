const express = require("express");
const bodyparser = require("body-parser");

const keyGenerator = require("generate-key");
const moment = require("moment");
const mongoose = require("mongoose");

const app = express();
app.use(bodyparser.json());

let storeName = "";

app.get("/logininfo", function(req, res){
    res.send(storeName)
})

app.post("/logininfo", function(req, res){
    let name = req.body.username;
    console.log(name)
    if(!name){
        res.status(400)
        res.json({err: "name is nonexistant"})
    } else {
        storeName = name;
        res.json({name})
    }
})

const port = process.env.port || 8000;

app.listen(port, function(){
    console.log("The server works at :", port)
})

