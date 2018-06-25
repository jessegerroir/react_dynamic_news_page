import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectId: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        nun_comments: 2,
        points: 5,
        objectID: 1,
    },
];

//this is a higher order function. It's a function that calls a function. It's useful as the filter funciton
//takes a function as it's input.
//this function matches the incoming pattern with the title property of the item form the list
//if it matches you return true and the item stays. If it doesn't then the item is removed.
const isSearched = (searchTerm) => (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
    constructor(props){
        super(props);
        //this allows us to store the list internally so we can update and change it
        this.state ={
            list,
            searchTerm: '',
        };

        //binding the button event handler, we have to bind it so it can use 'this' state
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onDismiss(id){
        const isNotId = (item) => item.objectId !== id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({ list: updatedList});
    }

    onSearchChange(event){
        this.setState({ searchTerm: event.target.value });
    }

    //whenever there is change, the render is called to re-render the view
    render() {
        const helloWorld = 'Welcome to the Road to learn React';
        const person = {firstName: 'James', lastName: 'Smith'};
        return (
            <div className="App">
                <form>
                    <input type="text"
                        onChange={this.onSearchChange}
                    />
                </form>
                {this.state.list.filter(isSearched(this.state.SearchTerm)).map(item =>
                    ...
                )}
                {this.state.list.map(item =>
                    <div key={item.objectID}>
                        <span>
                            <a href={item.title}>{item.title}</a>
                        </span>
                        <span>{item.author}</span>
                        <span>{item.num_comments}</span>
                        <span>{item.points}</span>
                        <span>
                            <button onClick={()=> this.onDismiss()}
                             type="button"
                            >
                            Dismiss
                            </button>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
