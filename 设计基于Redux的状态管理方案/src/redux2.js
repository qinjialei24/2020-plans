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
  // /* reducerKeys = ['counter', 'info']*/
  // const reducerKeys = Object.keys(reducers)

  // /*返回合并后的新的reducer函数*/
  // return function combination(state = {}, action) {
  //   /*生成的新的state*/
  //   const nextState = {}

  //   /*遍历执行所有的reducers，整合成为一个新的state*/
  //   for (let i = 0; i < reducerKeys.length; i++) {
  //     const key = reducerKeys[i]
  //     const reducer = reducers[key]
  //     /*之前的 key 的 state*/
  //     const previousStateForKey = state[key]
  //     /*执行 分 reducer，获得新的state*/
  //     const nextStateForKey = reducer(previousStateForKey, action)

  //     nextState[key] = nextStateForKey
  //   }
  //   return nextState;
  // }
  const reducerKeys = Object.keys(reducers)

  return (state = {}, action) => {
    const nextState = {}
    reducerKeys.forEach(reducerName => {
      const reducer = reducers[reducerName]
      const previousStateForKey = state[reducerName]
      console.log("state", state)
      console.log("reducerName", reducerName)
      console.log("previousStateForKey", previousStateForKey)
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
    })
    return nextState
  }
}


const reducer = combineReducers({
  todo: todoReducer,
  count: countReducer,
})


const store = createStore(reducer)

store.subscribe(() => {
  const state = store.getState()
  console.log("state", state)
})




store.dispatch({
  type: 'addTodo',
  payload: '测试'
})

store.dispatch({
  type: 'add',
  payload: '测试'
})