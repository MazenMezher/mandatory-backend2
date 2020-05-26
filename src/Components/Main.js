import React, { Component } from 'react';
import axios from "axios";
import querystring from "query-string";
import CreateTodos from "./CreateTodos";

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
        }
    }

    componentDidMount(){
        const { username } = querystring.parse(window.location.search, {
            ignoreQueryPrefix: true
        });
        axios.get("/logininfo").then(res => {
            this.setState({activeName: res.data})
            console.log(res.data)
        })

        axios.post("/logininfo", {username: username},{headers: {"Content-Type": "application/json"}}).then(res => {
            console.log(res)
        })

        axios.get("/windowcreation").then(res => {
            console.log(res.data)
            this.setState({todoWindowsArray: res.data})
        })
    }

    onChange(e){
        this.setState({todoWindows: e.target.value})
    }

    onSubmit(e){
        e.preventDefault()
        const { username } = querystring.parse(window.location.search, {
            ignoreQueryPrefix: true
        });
        axios.post("/windowcreation", {username: username, todoWindows: this.state.todoWindows},{
            headers: {"Content-Type": "application/json"}
        }).then(res => {
            axios.get("/windowcreation").then(res => {
                console.log(res.data)
                this.setState({todoWindowsArray: res.data})
            })
            console.log(res)
        })

        this.setState({todoWindowsCleaner: this.state.todoWindows, todoWindows: ""})
    }
    
    addTodos = () => {
        axios.get("/createtodo").then(res => {
            this.setState({savedTodos: res.data})
        })
    }

    render() {
        const { todoWindows, todoWindowsArray, activeName, savedTodos } = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>

                    <input type="text" value={todoWindows} onChange={this.onChange.bind(this)} />
                </form>
                <div>
                    {todoWindowsArray.map(window => {
                        return (
                            <div key={window._id}> 
                                <p>{window.windowValue} </p>
                                {savedTodos.map(todos => {
                                    console.log(todos)
                                    if(todos.windowCreation === window.windowValue){
                                        console.log(todos)
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
