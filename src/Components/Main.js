import React, { Component } from 'react';
import axios from "axios";
import querystring from "query-string";

class Main extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            username: "",
            todoWindows: "",
            todoWindowsArray: [],
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
            console.log(res)
        })

        this.setState({todoWindowsCleaner: this.state.todoWindows, todoWindows: ""})

    }
    
    render() {
        const { todoWindows, todoWindowsArray, activeName } = this.state;
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
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Main
