export default function createStore(reducer, initState = {}){
  let state =  initState
  const listeners = []
  function subscribe(listener) {
   listeners.push(listener)
  }
  function dispatch (action) {
   //  console.log(state, action)
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