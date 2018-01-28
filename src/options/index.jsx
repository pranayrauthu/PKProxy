import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import App from './components/App';
import optionsStore from './reducers';



ReactDOM.render(
    <Provider store={optionsStore}>
        <App />
    </Provider>,
    document.getElementById('app')
);