import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

//Components
import App from './App';

//Styles
import './assets/sass/main.scss';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
