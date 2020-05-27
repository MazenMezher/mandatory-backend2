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

  let todoLayout = mongoose.Schema({
      _id: String,
      todoValue: String,
      windowcreation: String,
      description: String,
      time: String,
      name: String,
  })

  let TodoLayout = mongoose.model("todo", todoLayout)

let WindowLayout = mongoose.model("window", windowLayout)

const app = express();
app.use(bodyparser.json());

let storeName = "";
let todoFetchInfo = "";

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

app.post("/createtodo", (req, res)=> {
    let todos = req.body;
    if(!todos.todo){
        res.status(400)
        res.json({err: "can not create todo"})
    } else {
        let todo = new TodoLayout({
            _id: keyGenerator.generateKey(),
            todoValue: todos.todo,
            windowcreation: todos.createWindow,
            description: "",
            time: moment().format('h:mn a'),
            name: storeName,
        })
        todo.save(function(err){
            if(err){
                console.log("Unable to save to mongoDB", err)
            } else {
                res.json(todos);
            }
        })
    }
})

app.get("/createtodo", (req, res ) => {
    TodoLayout.find({name: storeName}, function(err, data){
        if(err){
            console.log("can not find specific data for this name", err)
        } else {
            console.log("can send todo to frontend")
            res.send(data)
        }
    })
})

app.post("/gettodoinfo", (req, res) => {
    let todo = req.body;
    if(!todo.todo){
        res.status(400)
        res.json({err: "can not get todo"})
    } else {
        todoFetchInfo = todo.todo;
        res.json(todo);
    }
})

app.get("/gettodoinfo", (req, res) => {
    TodoLayout.find({todoValue: todoFetchInfo},function(err, data){
        if(err){
            console.log("Could not get specific todo", err);
        } else {
            res.send(data);
        }
    })
})

app.put("/gettodoinfo/:id", (req, res) => {
    let todoId = req.params.id;
    let todoItem = req.body;
    if(!todoId){
        res.status(400)
        res.json({err: "Could not get Id"})
    } else {
        TodoLayout.findByIdAndUpdate(todoItem._id, {
            _id: todoItem._id,
            todoValue: todoItem.todoValue,
            windowcreation: todoItem.windowcreation,
            description: todoItem.description,
        },function(err){
            if(err){
                console.log("Unable to update values", err)
            } else {
                console.log("I can update values correctly")
            }
        })
    }
})

app.delete("/deleteitem/:id",(req, res)=>{
    let id = req.params.id;
    TodoLayout.findByIdAndDelete(id, function(err){
        if(err){
            console.log("Can not delete todo", err)
        } else {
            console.log("managed to delete todo")
            res.status(204);
        }
    })
})

app.delete("/deletewindow/:windowName", (req, res)=> {
    let windowName = req.params.windowName;
    WindowLayout.deleteMany({windowValue: windowName}, function(err){
        if(err){
            console.log("can not delete window", err)
        } else {
            console.log("window deleted")
            res.status(204);
        }

    })
    TodoLayout.deleteMany({windowcreation: windowName}, function(err){
        if(err){
            console.log("can not delete all todos", err)
        } else {
            console.log("widow deleted and all its todos")
            res.status(204);
        }
    })
})


const port = process.env.port || 8000;

app.listen(port, function(){
    console.log("The server works at :", port)
})

