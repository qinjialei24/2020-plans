import produce from "immer"

// /* TODO: */ reducer 和 effect 重名时 给予警告
// /* TODO: */ 考虑 reducer 和 effect 不存在 或者为空对象的情况
export const getReducerEffectMap = (reducerAndEffect, namespace) => Object.keys(reducerAndEffect)
  .reduce((actionMap, actionName) => ({
    ...actionMap,
    [actionName]: namespace + '/' + actionName
  }), {})

const getKey = (str, flag) => {
  const i = str.indexOf(flag)
  return str.substring(i + 1, str.length + 1)
}

export const handleActions = ({ state, action, reducer, namespace = '' }) =>
  Object.keys(reducer)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducer[getKey(action.type, '/')](draft, action))
    : state

// export const formatModel = ({ state, action, reducer, effect, namespace = '' }) =>
//   Object.keys(reducer)
//     .map(key => namespace + '/' + key)
//     .includes(action.type)
//     ? produce(state, draft => reducer[getKey(action.type, '/')](draft, action))
//     : state

export const formatModel = ({ state, action, reducer, effect, namespace = '' }) => {
  const reducerKey = Object.keys(reducer).map(key => namespace + '/' + key)
  const effectKey = Object.keys(effect).map(key => namespace + '/' + key)

  // 触发的是 reducer
  if (reducerKey.includes(action.type)) {
    return produce(state, draft => reducer[getKey(action.type, '/')](draft, action))
  }

  // 触发的是 effect
  // if (effectKey.includes(action.type)) {
  //   const effectFn = effect[getKey(action.type, '/')]
  //   effectFn(reducer, action.data, state)
  // }
  else {
    return state
  }
}


export const handleEffect = (effect = {}) => {

}


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

// 增加 modules 属性 存储所有模块
const initModules = store => {
  // store[modules] = {}
}

export const init = store => {
  // initModules(store)

  return store

} 