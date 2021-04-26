import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

//Reducers
import allReducers from './reducers';

//Components
import App from './App';

//Styles
import './assets/sass/main.scss';

const myStore = createStore(allReducers);

ReactDOM.render(
    <Provider store={myStore}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();
