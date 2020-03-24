import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducer";
import FetchHelper from "../helpers/FetchHelper.js";
/**
 *  Redux Store configuration
 */

const middlewares = [thunk];

//create store
let store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(...middlewares),
    process.env.NODE_ENV === "development" && window.devToolsExtension
      ? window.devToolsExtension()
      : f => f
  )
);

FetchHelper.setReduxStore(store);

export default store;
