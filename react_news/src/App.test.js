import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table } from "./App";


//this it block is a unit test
describe('App',  () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
      const component = renderer.create(
          <App />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

});

describe('Search', () => {
    //renders the search component to the DOM and verifies it doesn't crash
    it('renders without crashing', () => {
       const div = document.createElement('div');
       ReactDOM.render(<Search>Search</Search>, div);
       ReactDOM.unmountComponentAtNode(div);
    });
    //store a snapshot and run against previous snapshot, it fails if snapshot has changed
    test('has a valid snapshot', () => {
       const component = renderer.create(
            <Search>Search</Search>
       );
       let tree = component.toJSON();
       expect(tree).toMatchSnapshot();
    });

});

describe('Button', ()=>{
   it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Button>Give Me More</Button>, div);
      ReactDOM.unmountComponentAtNode(div);
   });

   test('has a valid snapshot', ()=> {
       const component = renderer.create(
         <Button>Give Me More</Button>
       );
       let tree = component.toJSON();
       expect(tree).toMatchSnapShot();
   });
});

describe('Table', () => {
   const props = {
       list: [
           { title: '1', author: '2', num_comments: 1, points: 2, objectID: 'y'},
           { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z'},
       ],
   };

   it('renders without crashing', () => {
       const div = document.createElement('div');
       ReactDOM.render(<Table {...props} />, div);
   });

   test('has a valid snapshot', ()=>{
       const component = renderer.create(
         <Table {...props} />
       );
       let tree = component.toJSON();
       expect(tree).toMatchSnapshot();
   });

   it('shows two items in list', () => {
      const element = shallow(
        <Table { ...props } />
      );
      //checks to see the table row has two elements
      expect(element.find('.table-row').length).toBe(2);
   });
});
