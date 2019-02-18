import {applyMiddleware, createStore}  from "redux";
import { createLogger } from 'redux-logger'
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

import reducers from "./reducers";

const logger = createLogger();

let middlewares = [promise(), thunk];

if (location.hostname === 'localhost') {
  middlewares.push(logger)
}

const middleware = applyMiddleware(...middlewares);

export default createStore(reducers, middleware);
