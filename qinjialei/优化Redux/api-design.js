const store = {
  counter: {
    reducer: {
      add: 'counter/reducer/add'
    },
    effect: {
      asyncAdd: 'counter/effect/asyncAdd'
    },
  },
  todo: {
    reducer: {
      delete: 'todo/reducer/delete'
    },
    effect: {
      asyncDelete: 'todo/effect/asyncDelete'
    },
  },
}

const todoModel = {
  namespace: 'todo',//命名空间
  state: {
    inputValue: '2222',
    list: []
  },
  reducer: {
    delete(state, action) {
      state.list.splice(action.data, 1)
    },
    changeInput(state, action) {
      console.log("changeInput -> action", action)
      state.inputValue = action.data
    },
  },
  effect: {
    asyncDelete({ commit, state }, payload) {
      setTimeout(() => {
        commit(todo.reducer.delete, payload)
      }, 2000);
    }
  }
}

// 第一步 installConfig
// 在store对象增加属性，无需声明action，方便调用reducer
const store = {

}
const config = {
  todo: {}
}

const installConfig = (store, config) => {

}

// 第二步
// 通过字符串分割，判断是reducer还是effect
// 若是effect，在dispatch的时候当做函数先执行