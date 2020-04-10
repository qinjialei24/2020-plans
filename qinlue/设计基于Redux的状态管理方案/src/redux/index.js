
// redux 拥有dispatch getState subscribe 三个方法
const createStore = (reducer, initState = {}, rewriteCreateStoreFunc)=>{
   /*如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
   if(rewriteCreateStoreFunc){
    const newCreateStore =  rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
 }
 let state =  initState
 const listeners = []
 function subscribe(listener) {
  listeners.push(listener)
  return function unSubscribe () {
  const index = listeners.indexOf(listener)
  listeners.splice(index, 1)
  }
 }
 function dispatch (action) {
   state = reducer(state, action)
  for(let i = 0; i < listeners.length; i++){
    const listener = listeners[i]
    listener()
  }
}
 function getState () {
   return state
 }
 dispatch({ type: Symbol() })
 return {
  subscribe,
  dispatch,
  getState
 }
}
let initState = {
  count: 0
}
const counterReducer = (state, action) =>{
  if (!state) {
    state = initState;
}
 switch (action.type) {
   case 'INCREMENT':
     return {
      ...state,
      count: state.count + 1
     }
     case 'DECREMENT':
     return {
      ...state,
      count: state.count - 1
     }
 
   default:
    return state
 } 
}
const combineReducers =(reducers)=>{
  const reducerKeys = Object.keys(reducers)  
  return function combination (state, action) { 
    const nextState = {}
    for(let i = 0;i<reducerKeys.length;i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      const previousReudverForKey = state[key]
      const nextStateForKey = reducer(previousReudverForKey, action)
      nextState[key] = nextStateForKey
    }
    return nextState
  }
}
const reducer = combineReducers({
  counterReducer
})
// const store = createStore(reducer)
const loggerMiddleware = (store) => (next)=>(action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}
const exceptionMiddleware = (store)=>(next)=> (action)=>{
  try {
    console.log(next,'next')
    next(action)
  } catch (error) {
    console.log('错误报告: ', error)
  }
}
const timeMiddleware = (store)=> (next)=>(action)=>{
  console.log('time', new Date().getTime());
  next(action)
}
const applyMiddleware = function (...middlewares){
 /*返回一个重写createStore的方法*/
   return function rewriteCreateStoreFunc (oldCreateStore) {
    /*返回重写后新的 createStore*/
    return function newCreateStore (reducer, initState) {
      /*1. 生成store*/
      const store = oldCreateStore(reducer, initState)
       /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      /*const chain = middlewares.map(middleware => middleware(store));*/
const simpleStore = { getState: store.getState };
const chain = middlewares.map(middleware => middleware(simpleStore));
      // const chain = middlewares.map((middleware)=> middleware(store))
      let dispatch = store.dispatch;
     /* 实现 exception(time((logger(dispatch))))*/
      chain.reverse().map((middleware)=>{
        dispatch = middleware(dispatch)
      })
       /*2. 重写 dispatch*/
      store.dispatch = dispatch
      return store;
    }
  }
}
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);
// 传rewriteCreateStoreFunc 函数则带中间件
const store = createStore(reducer, initState, rewriteCreateStoreFunc);
// const next = store.dispatch
// // 这里是这样，action 是通过 调用dispatch 方法传进去的 
// // 把中间件当参数传给另外一个中间件，则另一个中间件执行的时候next 方法是方法的中间件 让这些中间件都变成一个函数接收一个action 参数
// store.dispatch = exception(logger(time(next)))
// console.log(store.dispatch)
// export default store
