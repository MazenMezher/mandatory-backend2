import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          login: false,
          username: "",
        }
      }
    
    onChange = (e) => {
        this.setState({ username: e.target.value });
    };
    
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ login: true });
    };

    
    render() {
        const { login, username } = this.state;
        if(login){
            return <Redirect to={`/main?username=${username}`} />
        }
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <p>Username</p>
                    <input type="text" value={username} onChange={this.onChange.bind(this)} />
                </form>
            </div>
        )
    }
}

export default Login
