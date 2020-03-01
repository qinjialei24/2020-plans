import { createStore, combineReducers } from "redux";
import todo from "./modules/todo";
import counter from "./modules/counter";
import { init } from "./util";

const setActionToStore = (store, reducerModules) => {
  Object.keys(reducerModules).forEach(moduleName => {
    store[moduleName] = reducerModules[moduleName].action
  })
}

const reducerModules = {
  todo,
  counter,
}

const _store = createStore(
  combineReducers(reducerModules),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

setActionToStore(_store, reducerModules)

const _dispatch = _store.dispatch

_store.dispatch = (type, data) => _dispatch({ type, data })

const store = init(_store)


export default store