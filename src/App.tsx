import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { Provider } from 'react-redux';
import { configureStore } from './store/store';
import saga from './sagas/index';

const store = configureStore();
store.runSaga(saga);

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Home />
        </Provider>,
        document.getElementById('app')
    );
};

store.subscribe(render);
render();

// const App = () => {
    
//     return (
//         <Provider store={store}>
//             <Home />
//         </Provider>
//     );
// };

// ReactDOM.render(<App />, document.getElementById('app'));