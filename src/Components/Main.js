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
    }

    onChange(e){
        this.setState({todoWindows: e.target.value})
    }

    onSubmit(e){
        e.preventDefault()
        
    }
    
    render() {
        const { todoWindows, todoWindowsArray, activeName } = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>

                    <input type="text" value={todoWindows} onChange={this.onChange.bind(this)} />
                </form>
            </div>
        )
    }
}

export default Main
