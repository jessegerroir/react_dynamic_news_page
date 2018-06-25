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

const Search = ({ value, onChange, children }) =>
    <form>
        {children}
        <input
            type="text"
            value={value}
            onChange={this.onSearchChange}
        />
    </form>;

const Table = ({  list, pattern, onDismiss }) =>
    <div className="table">
        {list.filter(isSearched(pattern)).map(item =>
            <div key={item.objectID} className="table-row">
                <span style={{ width: '40%' }}>
                    <a href={item.url}>{item.title}</a>
                </span>
                <span style={{ width: '30%' }}>
                    {item.author}
                </span>
                <span style={{ width: '10%' }}>
                    {item.num_comments}
                </span>
                <span style={{ width: '10%' }}>
                    {item.points}
                </span>
                <span style={{ width: '10%' }}>
                    <Button
                        onClick={() => onDismiss(item.objectID)}
                        className="button-inline"
                    >
                        Dismiss
                    </Button>
                </span>
            </div>
        )}
    </div>;

const Button = ({onClick, className = "", children, }) =>
    <button
        onClick={onClick}
        className={className}
        type="button"
    >
        {children}
    </button>;

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
        //we use deconstruction here so we don't have to type out this.state everytime we want to access a variable
        const {
            searchTerm,
            list
        } = this.state;
        return (
            <div className="page">
                <div className="App">
                    <div className="interactions">
                        <Search
                            value={searchTerm}
                            onChange={this.onSearchChange}
                        >
                            Search
                        </Search>
                    </div>
                    <Table
                        list={list}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                </div>
            </div>
        );
    }
}

export default App;
