import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

//this is a higher order function. It's a function that calls a function. It's useful as the filter funciton
//takes a function as it's input.
//this function matches the incoming pattern with the title property of the item form the list
//if it matches you return true and the item stays. If it doesn't then the item is removed.
const isSearched = (searchTerm) => (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());

const search = ({ value, onChange, children }) =>
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
        {list.map(item =>
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

const Search = ({  value, onChange, onSubmit, children }) =>
    <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">
            {children}
        </button>
    </form>;


class App extends Component {
    constructor(props){
        super(props);
        //this allows us to store the list internally so we can update and change it
        this.state ={
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        //binding the button event handler, we have to bind it so it can use 'this' state
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    onSearchSubmit(event){
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    fetchSearchTopStories(searchTerm, page = 0){
        //use the url to fetch execute the code and fetch the resources and return json
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    //we are concatenating the old and new list when searching this helps for pagination
    setSearchTopStories(result){
        const { hits, page } = result;
        const oldHits = page !== 0 ? this.state.result.hits : [];
        const updatedHits = [...oldHits, ...hits];

        this.setState({
            result: { hits: updatedHits, page}
        });
    }

    //if the component mounted (rendered fine) fetch data to fill it?
    componentDidMount(){
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

    onDismiss(id){
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        //instead of altering the object directly we create a new result that is added to previous object
        this.setState({
            result: {...this.state.result, hits: updatedHits}
        });
    }

    onSearchChange(event){
        this.setState({ searchTerm: event.target.value });
    }

    //whenever there is change, the render is called to re-render the view
    render() {
        //we use deconstruction here so we don't have to type out this.state everytime we want to access a variable
        const { searchTerm, result } = this.state;
        const page = (result && result.page) || 0;
        return (
            <div className="page">
                <div className="App">
                    <div className="interactions">
                        <Search
                            defaultValue={searchTerm}
                            onChange={this.onSearchChange}
                            onSubmit={this.onSearchSubmit}
                        >
                            Search
                        </Search>
                    </div>
                    {result &&
                    <Table
                        list={result.hits}
                        onDismiss={this.onDismiss}
                    />
                    }
                    <div className="interactions">
                        <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
                            More
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
