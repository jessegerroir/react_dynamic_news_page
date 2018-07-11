import React, { Component } from 'react';
import axios from 'axios';
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

class Search extends Component{
    //this puts focus on the search box when the component mounts using the DOM API
    componentDidMount(){
        if(this.input){
            this.input.focus();
        }
    }

    render(){
        const {
            value,
            onChange,
            onSubmit,
            children
        } = this.props;
        return (
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    ref={(node) => { this.input = node; }}
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        );
    }
}

const Loading = () => <div>Loading...</div>;

//higher order component
const withLoading = (Component) => ({ isLoading, ...rest}) =>
        isLoading
        ? <Loading />
        : <Component { ...rest } />;

const ButtonWithLoading = withLoading(Button);


class App extends Component {
    //this allows us to shutdown calls if lifecycle is interrupted
    _isMounted = false;
    constructor(props){
        super(props);
        //this allows us to store the list internally so we can update and change it
        this.state ={
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
        };

        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        //binding the button event handler, we have to bind it so it can use 'this' state
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    //if the component mounted (rendered fine) fetch data to fill it?
    componentDidMount(){
        this._isMounted = true;
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm];
    }

    onSearchSubmit(event){
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        //go fetch the top stories
        if(this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }

    //use the url to fetch execute the code and fetch the resources and return json
    fetchSearchTopStories(searchTerm, page = 0){
        //set load to true to display loading screen
        this.setState({ isLoading: true });

        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this._isMounted && this.setSearchTopStories(result.data))
            .catch(error => this._isMounted && this.setState({ error }));
    }

    //we are concatenating the old and new list when searching this helps for pagination
    setSearchTopStories(result){
        const { hits, page } = result;
        const { searchKey, results } = this.state;
        //if we have results return the old ones if we have them already, otherwise return empty
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];

        //instead of altering the object directly we create a new result that is added to previous object
        this.setState({
            results: {
                ...results, [searchKey]: { hits: updatedHits, page}
            },
            isLoading: false
        });
    }

    onDismiss(id){
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);

        //instead of altering the object directly we create a new result that is added to previous object
        //the returned information is stored under the word we used to search
        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page}
            }
        });
    }

    onSearchChange(event){
        this.setState({ searchTerm: event.target.value });
    }

    //whenever there is change, the render is called to re-render the view
    render() {
        //we use deconstruction here so we don't have to type out this.state everytime we want to access a variable
        const { searchTerm, results, searchKey, error, isLoading } = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

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
                    {error ? <div className="interactions"><p>Something went wrong</p></div> :
                        <Table
                            list={list}
                            onDismiss={this.onDismiss}
                        />
                    }
                    <div className="interactions">

                            <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                                More
                            </ButtonWithLoading>

                    </div>
                </div>
            </div>
        );
    }
}

export default App;

//exporting the components we made so they can be used elsewhere
export {
  Button,
  Search,
  Table,
};
