import React, { Component } from 'react'
import axios from "axios";
class CreateTodos extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            todos: "",
            totalTodos: [],
            todosCleaner: "",

        }
    }

    onChange(e){
        this.setState({todos: e.target.value});
    }

    onSubmit(e){
        e.preventDefault()
        axios.post("/createtodo", {todo: this.state.todos, createWindow: this.props.windowCreation}, {
            headers: {"Content-Type":"application/json"}
        }).then(res => {
            console.log("todos from backend", res)
            this.props.addTodos()
        })
    }

    render() {
        const { todos, totalTodos } = this.state;
        return (
            <div>
                <div >
                    {totalTodos.map(todos => {
                        console.log(todos)
                        return (
                            <button>{todos.todoValue}</button>
                        )
                    })}
                </div>
                <div>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <input type="text" value={todos} onChange={this.onChange.bind(this)} />
                    </form>
                </div>
                

            </div>
        )
    }
}

export default CreateTodos
