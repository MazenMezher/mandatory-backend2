const express = require("express");
const bodyparser = require("body-parser");

const keyGenerator = require("generate-key");
const moment = require("moment");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Howltusk:4532267Xy@cluster0-gnkr8.mongodb.net/test?retryWrites=true&w=majority", function(err){
  if(err){
    console.log("error in connect", err)
  } else {
    console.log("Connected to data-base")
  }
});

let windowLayout = mongoose.Schema({
    _id: String,
    name: String,
    windowValue: String,
  })

let WindowLayout = mongoose.model("window", windowLayout)

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

app.get("/windowcreation", function(req,res){
    WindowLayout.find({name: storeName}, function(err, data){
        if(err){
            console.log("could not get from mongoDB", err)
        } else {
            console.log("Data sent to frontend")
            res.send(data)
        }
    })
})

app.post("/windowcreation", function(req, res){
    let windowcreation = req.body;
    if(!windowcreation.todoWindows){
        res.status(400)
        res.json({err: "can not create window"})
    } else {
        storeName = windowcreation.username;
        let createWindow = new WindowLayout({
            _id: keyGenerator.generateKey(),
            name: windowcreation.username,
            windowValue: windowcreation.todoWindows,
        })
        createWindow.save(function(err){
            if(err){
                console.log("Can not save info to mongoDb", err)
            } else {
                res.json(windowcreation)
            }
        });
    }
})



const port = process.env.port || 8000;

app.listen(port, function(){
    console.log("The server works at :", port)
})

