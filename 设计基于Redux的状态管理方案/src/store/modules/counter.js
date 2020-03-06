import { handleActions, getReducerEffectMap, createModel } from "../util";

const model = {
  namespace: 'counter',
  state: {
    count: 10
  },
  reducer: {
    add(state, action) {
      state.count += 2
    },
    minus(state, action) {
      state.count--
    },
  }
}

export default createModel(model)

// const initialState = {
//   count: 10
// }

// const reducers = {
//   add(state, action) {
//     state.count += 2
//   },
//   minus(state, action) {
//     state.count--
//   },
// }

// const fn = (state = initialState, action) => handleActions({
//   namespace: 'counter',
//   state,
//   action,
//   reducers,
// })

// fn.action = getReducerEffectMap(reducers, 'counter')
// console.log("TCL: fn.action", fn.action)


// export default fn
