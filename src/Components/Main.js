import React, { Component } from 'react';
import axios from "axios";
import querystring from "query-string";
import CreateTodos from "./CreateTodos";
import { Modal, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import '../App.css';
class Main extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            username: "",
            todoWindows: "",
            todoWindowsArray: [],
            savedTodos: [],
            todoWindowsCleaner: "",
            activeName: "",
            show: false,
            descriptionValue: "",
            windowCreationValue: "",
            todoValue: "",
            todoSaveInfo: [],
            todoId: "",
            logOut: false,
        }
    }

    componentDidMount(){
        const { username } = querystring.parse(window.location.search, {
            ignoreQueryPrefix: true
        });
        axios.get("/logininfo").then(res => {
            this.setState({activeName: res.data})
        })

        axios.post("/logininfo", {username: username},{headers: {"Content-Type": "application/json"}}).then(res => {
            console.log(res)
        })

        axios.get("/windowcreation").then(res => {
            this.setState({todoWindowsArray: res.data})
        })

        axios.get("/createtodo").then(res => {
            this.setState({savedTodos: res.data})
        })
    }

    onChange = (e) => {
        this.setState({todoWindows: e.target.value})
    }

    onSubmit = (e) =>{
        e.preventDefault()
        const { username } = querystring.parse(window.location.search, {
            ignoreQueryPrefix: true
        });
        axios.post("/windowcreation", {username: username, todoWindows: this.state.todoWindows},{
            headers: {"Content-Type": "application/json"}
        }).then(res => {
            axios.get("/windowcreation").then(res => {
                this.setState({todoWindowsArray: res.data})
            })
        })

        this.setState({todoWindowsCleaner: this.state.todoWindows, todoWindows: ""})
    }

// saving the different values on submit of a todo
    saveOnSubmit =() =>{
        window.location.reload(false);
        this.setState({show: false})

        axios.put("/gettodoinfo/" + this.state.todoId, {
            description: this.state.descriptionValue,
            todoValue: this.state.todoValue,
            windowcreation: this.state.windowCreationValue,
            _id: this.state.todoId,
        },{headers: {"Content-Type": "application/json"}}).then(res => {
            axios.get("/createtodo").then(res => {
                this.setState({savedTodos: res.data})
            })
        })
    }
    
    addTodos = () => {
        window.location.reload(false);
        axios.get("/createtodo").then(res => {
            this.setState({savedTodos: res.data})
        })
    }

    handleModal = (todo) => {
        this.setState({show: !this.state.show})
        
        axios.post("/gettodoinfo", {todo: todo},{headers: {"Content-Type": "application/json"}}).then(res => {
            console.log("this is todo post ", res)
        })

        axios.get("/gettodoinfo").then(res => {
            this.setState({todoSaveInfo: res.data});
            res.data.map(todoInfo => {
                this.setState({
                        descriptionValue: todoInfo.description,
                        todoValue: todoInfo.todoValue,
                        windowCreationValue: todoInfo.windowcreation,
                        todoId: todoInfo._id,
                    })
            })
        })
    }

    onChangeDescription =(e) =>{
        this.setState({descriptionValue: e.target.value})
    }

    onChangeTodoValues= (e) =>{
        this.setState({todoValue: e.target.value})
    }

    onChangeWindowCreation = (e) =>{
        this.setState({windowCreationValue: e.target.value})
    }

    moveCreatedTodo = (newDestination) =>{
        window.location.reload(false);
        this.setState({show: false});

        axios.put("/gettodoinfo/" + this.state.todoId, {
            description: this.state.descriptionValue,
            todoValue: this.state.todoValue,
            windowcreation: newDestination,
            _id: this.state.todoId,
        }).then(res => {
            axios.get("/createtodo").then(res => {
                this.setState({savedTodos: res.data})
            })
        })
    }

    deleteTodoItem = (id) => {
        window.location.reload(false);
        axios.delete("/deleteitem/" + id).then(res => {
            axios.get("/createtodo").then(res => {
                this.setState({savedTodos: res.data})
            })
        })
    }

    deleteWindow = (windowName) => {
        window.location.reload(false);
        axios.delete("/deletewindow/" + windowName).then(res => {
            axios.get("/createtodo").then(res => {
                this.setState({savedTodos: res.data})
            })
        })
    }

    logOut = () => {
        this.setState({logOut: true});
    }

    render() {
        const { logOut, todoWindows, todoWindowsArray, activeName, savedTodos, windowCreationValue, descriptionValue, todoValue } = this.state;
        if(logOut){
            return <Redirect to={`/`} />
        }
        return (
            <div className="backgroundMain">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <input className="loginInput" placeholder="Create TodoWindow" type="text" value={todoWindows} onChange={this.onChange.bind(this)} />
                </form>
                <button className="mainWindowButton" onClick={this.logOut.bind(this)}>LogOut</button>
                <div className="testDiv">
                    {todoWindowsArray.map(window => {
                        return (
                            <div key={window._id}> 
                                <p className="mainWindowText">{window.windowValue} </p>
                                <button className="mainWindowButton" onClick={() => this.deleteWindow(window.windowValue)}>Delete window</button>
                                {savedTodos.map(todos => {
                                    if(todos.windowcreation === window.windowValue){
                                        return (
                                            <div> 
                                                <button className="mainWindowButton" onClick={()=> this.handleModal(todos.todoValue)}>{todos.todoValue}</button>
                                                <button className="mainWindowButton" onClick={() => this.deleteTodoItem(todos._id)} >Delete Todo</button>
                                                <Modal show={this.state.show} onHide={this.handleModal}>
                                                    <Modal.Header closeButton> </Modal.Header>
                                                    <Modal.Body> 
                                                        <form onSubmit={this.saveOnSubmit}>
                                                            <label>Description</label>
                                                            <input type="text" value={descriptionValue} onChange={this.onChangeDescription.bind(this)} />
                                                            <br/>
                                                            <label>Todo-Window</label>
                                                            <input type="text" value={windowCreationValue} onChange={this.onChangeWindowCreation.bind(this)} />
                                                            <br/>
                                                            <label>Todo-Value</label>
                                                            <input type="text" value={todoValue} onChange={this.onChangeTodoValues.bind(this)} />
                                                            <br/>
                                                            <span>{todos.time}</span>
                                                            <br/>
                                                            <span>&#8595; Click To Move Todo &#8595;</span>
                                                            {todoWindowsArray.map(windows => {
                                                                return (
                                                                    <div onClick={()=> this.moveCreatedTodo(windows.windowValue)}>{windows.windowValue}</div>
                                                                )
                                                            })}
                                                        </form>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button onClick={this.saveOnSubmit} >Save Changes</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        )
                                        
                                    }
                                })}
                                <CreateTodos addTodos={this.addTodos} windowCreation={window.windowValue} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Main
