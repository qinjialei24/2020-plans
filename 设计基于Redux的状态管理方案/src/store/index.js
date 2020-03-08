import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import todo from "./modules/todo";
import counter from "./modules/counter";
import { setActionToStore } from "vuex-redux";

const logger = store => dispatch => action => {
  console.log("action", action)
  dispatch(action)
  console.log("store", store)
}


const reducerModules = {
  todo,
  counter,
}

const middleware = [logger]

const store = createStore(combineReducers(reducerModules), composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));



setActionToStore(store, reducerModules)

const _dispatch = store.dispatch

store.dispatch = (type, data) => _dispatch({ type, data })


export default store