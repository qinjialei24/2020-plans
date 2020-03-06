
// redux 拥有dispath getState subscribe 三个方法
const createStore = (reducer, initState = {})=>{
 let state =  initState
 const listeners = []
 function subscribe(listener) {
  listeners.push(listener)
 }
 function dispath (action) {
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
  dispath,
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
const storr = createStore(reducer, {
  count: 0
})