import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './modules'
import {composeWithDevTools} from 'redux-devtools-extension'

const store = createStore(rootReducer, composeWithDevTools())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

