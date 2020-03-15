export default function combineReducers (reducers){
  const reducerKeys = Object.keys(reducers)  
  return function combination (state, action) { 
    const nextState = {}
    for(let i = 0;i<reducerKeys.length;i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      const previousReudverForKey = state[key]
      const nextStateForKey = reducer(previousReudverForKey, action)
      console.log({nextStateForKey})
      nextState[key] = nextStateForKey
    }
    return nextState
  }
}