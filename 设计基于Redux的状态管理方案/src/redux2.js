const createStore = (reducer) => {
  let state
  const listeners = []

  const subscribe = (listener) => {
    listeners.push(listener)
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  const getState = () => state

  dispatch({
    type: 'xxx'
  })

  return {
    subscribe,
    dispatch,
    getState
  }
}

const todoReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case 'addTodo':
      return {
        ...state,
        list: state.list.push(action.payload)
      }
    default:
      return state
  }
}

const countReducer = (state = 0, action) => {
  switch (action.type) {
    case 'add':
      return state + 1
    default:
      return state
  }
}


const combineReducers = (reducers) => {
  const reducerKeys = Object.keys(reducers)

  return (state = {}, action) => {
    const nextState = {}
    reducerKeys.forEach(reducerName => {
      const reducer = reducers[reducerName]
      const previousStateForKey = state[reducerName]
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[reducerName] = nextStateForKey
    })
    return nextState
  }
}


const reducer = combineReducers({
  todo: todoReducer,
  count: countReducer,
})


const store = createStore(reducer)

const _dispatch = store.dispatch

store.dispatch = (action) => {
  console.log(store.getState(), 'state');
  _dispatch(action)
  console.log(store.getState(), 'next state');
}

const _dispatch2 = store.dispatch

store.dispatch = action => { 
  console.log(' new Date().getTime() 的值是：', new Date().getTime());
  _dispatch2(action)
}


store.subscribe(() => {
  const state = store.getState()
})



store.dispatch({
  type: 'addTodo',
  payload: '测试'
})

store.dispatch({
  type: 'add',
  payload: '测试'
})