
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
 return {
  subscribe,
  dispatch,
  getState
 }
}
const reducer = (state, action) =>{
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
      
    }
  }

}
const store = createStore(reducer, {
  count: 0
})
export default store
