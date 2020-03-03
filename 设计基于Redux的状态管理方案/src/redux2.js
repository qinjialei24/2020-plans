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

  return {
    subscribe,
    dispatch,
    getState
  }
}

const todoReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        list: state.list.push(action.payload)
      }
    default:
      return state
  }
}

const store = createStore(todoReducer)

store.subscribe(() => {
  const state = store.getState()
  console.log("state", state)
})




store.dispatch({
  type: 'add',
  payload: '测试'
})