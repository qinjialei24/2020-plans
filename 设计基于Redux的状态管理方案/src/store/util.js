import produce from "immer"

export const getReducerEffectMap = (reducerAndEffect, namespace) => Object.keys(reducerAndEffect)
  .reduce((actionMap, actionName) => ({
    ...actionMap,
    [actionName]: namespace + '/' + actionName
  }), {})

const getKey = (str) => {
  const i = str.indexOf('/')
  return str.substring(i + 1, str.length + 1)
}

export const handleActions = ({ state, action, reducer, namespace = '' }) =>
  Object.keys(reducer)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducer[getKey(action.type)](draft, action))
    : state

export const createModel = (model) => {
  const { reducer, namespace } = model
  const fn = (state = model.state, action) => handleActions({
    state,
    action,
    reducer,
    namespace
  })
  // 通过 reducer 和 effect 的函数名 生成对应的 action，
  fn.action = getReducerEffectMap(reducer, namespace)
  return fn
}


export const setActionToStore = (store, reducerModules) => {
  Object.keys(reducerModules).forEach(moduleName => {
    store[moduleName] = reducerModules[moduleName].action
  })
}