
// redux 拥有dispatch getState subscribe 三个方法
const createStore = (reducer, initState = {})=>{
 let state =  initState
 const listeners = []
 function subscribe(listener) {
  listeners.push(listener)
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
const store = createStore(reducer)
const next = store.dispatch
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
const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
const time = timeMiddleware(store)
// 这里是这样，action 是通过 调用dispatch 方法传进去的 
// 把中间件当参数传给另外一个中间件，则另一个中间件执行的时候next 方法是方法的中间件
store.dispatch = exception(logger(time(next)))
console.log(store.dispatch)
export default store
