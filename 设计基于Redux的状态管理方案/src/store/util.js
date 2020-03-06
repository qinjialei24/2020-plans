import produce from "immer"

const NAME_SPACE_FLAG = '/'

export const getActionMap = (reducerAndEffect, namespace) => Object.keys(reducerAndEffect)
  .reduce((actionMap, actionName) => ({
    ...actionMap,
    [actionName]: namespace + NAME_SPACE_FLAG + actionName
  }), {})

const getKey = (str) => str.substring(str.indexOf(NAME_SPACE_FLAG) + 1, str.length + 1)

export const withReducer = ({ state, action, reducer, namespace = '' }) =>
  Object.keys(reducer)
    .map(key => namespace + NAME_SPACE_FLAG + key)
    .includes(action.type)
    ? produce(state, draft => reducer[getKey(action.type)](draft, action))
    : state

export const createModel = (model) => {
  const { reducer, namespace } = model
  const reducerModule = (state = model.state, action) => withReducer({ state, action, reducer, namespace })
  reducerModule.action = getActionMap(reducer, namespace)
  return reducerModule
}


export const setActionToStore = (store, reducerModules) => {
  Object.keys(reducerModules).forEach(moduleName => {
    store[moduleName] = reducerModules[moduleName].action
  })
}