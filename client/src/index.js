import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import {createStore, applyMiddleware, compose} from 'redux';
// Correct import for redux-thunk
import { thunk } from 'redux-thunk';
import './index.css'


import {reducers} from "./reducers";

const store = createStore(reducers, compose(applyMiddleware(thunk)))


ReactDOM.render(
    <Provider store={store}>
    <App/>
    </Provider>,
    
    document.getElementById('root')
    );