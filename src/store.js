import {applyMiddleware, createStore}  from "redux";
import { createLogger } from 'redux-logger'
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

import reducers from "./reducers";

const logger = createLogger({
  level: 'info',
  collapsed: true,
  diff: true
});

let middlewares = [promise(), thunk];

if (process.env.NODE_ENV !== "production") {
  middlewares.push(logger)
}

const middleware = applyMiddleware(...middlewares);

export default createStore(reducers, middleware);
