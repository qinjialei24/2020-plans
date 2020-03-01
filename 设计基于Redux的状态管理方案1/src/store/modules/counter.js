import { handleActions, getReducerEffectMap } from "../util";


const initialState = {
  count: 10
}

const reducers = {
  add(state, action) {
    state.count++
  },
  minus(state, action) {
    state.count--
  },
}

const fn = (state = initialState, action) => handleActions({
  namespace: 'counter',
  state,
  action,
  reducers,
})

fn.action = getReducerEffectMap(reducers, 'counter')
console.log("TCL: fn.action", fn.action)


export default fn
