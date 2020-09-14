import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from 'reducers';

const store = createStore(reducer);

const App = () => {
    
    return (
        <Provider store={store}>
            <Home />
        </Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));