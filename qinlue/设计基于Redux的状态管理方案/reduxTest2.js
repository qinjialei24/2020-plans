/*
 * @Descripttion: 
 * @Author: voanit
 * @Date: 2020-04-14 23:12:08
 * @LastEditors: voanit
 * @LastEditTime: 2020-04-15 01:08:03
 */
const createStore = function (reducer , state) {
  const listeners = []
  function  subscribe(listener) {
    listeners.push(listener)
    return function unSubscribe () {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }
  function dispatch (action) {
    state = reducer(state , action)
    listeners.forEach(listener =>listener())
  }
  function getState() {
    return state
  }
  return {
    subscribe,
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
    default:
      return state
  }
}
function infoReducer (state, action) {
  switch (action.type) {
    case 'aaa':
      return {
        ...state,
        count: state.count + 1
      }  
    default:
      return state
  }
}
function combineReducer (reducers) {
 const reducerKeys = Object.keys(reducers)
 return function combination (state, action) {
   const nextState = {}
  reducerKeys.forEach((key)=>{
    const oldStateForKey = state[key]
   const reducer =  reducers[key]
   const nextStateForKey = reducer(oldStateForKey , action)
   nextState[key] = nextStateForKey
  })
  return nextState
 }
}
const reducer = combineReducer({
  info: infoReducer,
  counter: counterReducer
})
const loggerMiddlerWare = (store)=>(next)=>(action)=>{
  console.log(store.getState())
  next(action)
  console.log(store.getState())

}
const timeMiddlerWare =(store)=> (next)=>(action)=>{
  next(action)
  console.log(new Date().getTime())
}
const tryErrorMiddlerWare = (store)=>(next)=>(action)=>{
try {
  console.log('start')
  next(action)
  console.log('end')

} catch (error) {
  console.log(error)
}
}
function applyMiddlerware (...middlerwares) {
  return function newCreateStoreFunc (oldCreateStore) {
    return function newCreateStore  (reducer, state) {
      const store = oldCreateStore(reducer, state)
      let dispatch = store.dispatch
      const chain = middlerwares.map((middlerware)=> middlerware({getState: store.getState}))
      chain.reverse().forEach((middlerware)=>{
        dispatch = middlerware(dispatch)
      })
      store.dispatch = dispatch
      return store
    }
  }
}
const newCreateStoreFunc = applyMiddlerware(tryErrorMiddlerWare, loggerMiddlerWare,timeMiddlerWare)
const newCreateStore = newCreateStoreFunc(createStore)
const store = newCreateStore(reducer, { info: {},counter: {count: 0} })
// const store = createStore(reducer, { info: {},counter: {count: 0} })
// const logger = loggerMiddlerWare(store)
// const time = timeMiddlerWare(store)
// const tryError = tryErrorMiddlerWare(store)
// const next = store.dispatch
// store.dispatch = tryError(time(logger(next)))
store.dispatch({
  type:'add'
})
