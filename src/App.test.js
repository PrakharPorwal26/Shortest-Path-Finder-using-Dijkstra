import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//ensure that the App component renders without crashing. This test checks if the App component can be successfully mounted and unmounted in a DOM container.
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});