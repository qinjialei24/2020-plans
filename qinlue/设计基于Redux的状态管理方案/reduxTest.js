/*
 * @Descripttion: 
 * @Author: voanit
 * @Date: 2020-04-12 21:13:01
 * @LastEditors: voanit
 * @LastEditTime: 2020-04-14 23:07:00
 */
const initState = {
  info: {
    name: '张三'
  },
  counter: {
    count: 0
  }
}
const createStore = function (reducer, state) {
  if (!state) {
    state = initState
  }
  let listeners = []
  function subscriber (listener) {
    listeners.push(listener)
    return function unSubscribe () {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }
  function dispatch (action) {
    state = reducer(state, action)
    for (let index = 0; index < listeners.length; index++) {
      const listener = listeners[index];
      listener()

    }
  }
  function getState () {
    return state
  }
  return {
    subscriber,
    dispatch,
    getState
  }
}
function counterReducer (state, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1
      }
    case 'lessen':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}
function infoReducer (state, action) {
  switch (action.type) {
    case 'changeName':
      return {
        ...state,
        name: '覃佳磊'
      }
    default:
      return state
  }
}
function mergeRecducer (reducers) {
  const reducerkeys = Object.keys(reducers)  // ['info', 'counter']
  // 此函数主要是循环对应上模板字符串然后进行根据action 生成新的state
  return function combination (state, action) {
    const nextState = {}
    for (let index = 0; index < reducerkeys.length; index++) {
      const reducerKey = reducerkeys[index]; // info  counter
      const reducer = reducers[reducerKey] //  infoReducer counterReducer
      const lastSteteForKey = state[reducerKey] // initState.info  initState.counter
      const nextStateForKey = reducer(lastSteteForKey, action)
      nextState[reducerKey] = nextStateForKey
    }
    return nextState
  }
}
const reducer = mergeRecducer({
  info: infoReducer,
  counter: counterReducer
})
// const store = createStore(reducer)
// const next = store.dispatch
const loggerMiddleware = (store) => (next) => (action) => {
  console.log(action, 'loggerMiddleware')
  console.log('this state', store.getState());
  next(action);
  console.log('next state', store.getState());
}
const exceptionMiddleware = (store) => (next) => (action) => {
  console.log(action, 'exceptionMiddleware')
  try {
    next(action)
  } catch (error) {
    console.log(error)
  }
}
const timeMiddleware = (store) => (next) => (action) => {
  console.log(action, 'timeMiddleware')
  console.log(new Date().getTime())
  next(action)
}
// const logger = loggerMiddleware(store)
// const exception = exceptionMiddleware(store)
// const timer = timeMiddleware(store)
// 执行的是最后传入的 中间件的next方法 // 最外层的函数最先执行
// store.dispatch = exception(timer(logger(next)))
const applyMiddleware = function (...middlewares) {
  return function newCreateStoreFunc (oldCreateStore) {
    return function newCreateStore (reducer, InitSate) {
      const store = oldCreateStore(reducer, InitSate)
      const chain = middlewares.map((middleware) => middleware({ getState: store.getState }))
      let dispatch = store.dispatch
      chain.reverse().map((middleware) => {
        dispatch = middleware(dispatch)
      })
      store.dispatch = dispatch
      return store
    }
  }

}
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, loggerMiddleware, timeMiddleware)
const newCreateStore = rewriteCreateStoreFunc(createStore)
const store = newCreateStore(reducer, initState)
store.dispatch({
  type: 'add'
})

