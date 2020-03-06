import { createStore, combineReducers } from "redux";
import todo from "./modules/todo";
import counter from "./modules/counter";
import { setActionToStore } from "./util";

const reducerModules = {
  todo,
  counter,
}

const store = createStore(
  combineReducers(reducerModules),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

setActionToStore(store, reducerModules)

const _dispatch = store.dispatch

store.dispatch = (type, data) => _dispatch({ type, data })


export default store