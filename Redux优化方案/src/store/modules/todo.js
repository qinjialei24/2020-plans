import { createModel } from "../util";

// 定义需要管理的状态
const model = {
  namespace: 'todo',//命名空间
  state: {
    inputValue: '123',
    list: []
  },
  reducer: {//操作 state 内的变量，必须是 纯函数 ，不能存放带有异步的代码
    add(state, action) {
      state.list.push(action.data)
    },
    delete(state, action) {
      state.list.splice(action.data, 1)
    },
    changeInput(state, action) {
      state.inputValue = action.data
    },
  },
  effect: {
    asyncAdd(reducer, data, state) {
      reducer.add(state, {
        data
      })
      console.log("TCL: Add -> state", state)
      console.log("TCL: Add -> data", data)
      console.log('reducer.add 的值是：', reducer.add);
      // setTimeout(() => {
      //   reducer.add(state, {
      //     data
      //   })
      // }, 1000);
    }
  }
}

export default createModel(model)