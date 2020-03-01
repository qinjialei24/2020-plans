## 前言
用过 redux 的小伙伴都知道 redux 的 reducer 必须是纯函数，但你知道为什么必须是纯函数吗？

可能你会说这不简单，官网都说了，是为了做到：

- 可预测性
- 时间旅行

**那什么是 可预测 呢?**
**什么是 时间旅行 呢？**

小伙伴：？？？

确实，这些 redux 官网都没有给出详细的解释，光从字眼上来看确实比较抽象。

不慌，花几分钟看完此文，保证你能看懂

## 理解 redux 的可预测性
// 有如下 reducer,并且 state 初始化 为 { count: 0 }
function todoReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1
      }
    default:
      return state
  }
}

// 假设如下名词
// 用户进入应用的第 1 秒为 t1
// 用户进入应用的第 2 秒为 t2
// 用户进入应用的第 n 秒为 tn
// 以此类推


//在 t1 时 我们在组件里 dispatch 一个 action，
// 此时 state ={count:1}
store.dispatch('add')

//在 t2 时 我们在组件里 dispatch 一个 action
// 此时 state ={count:2}
store.dispatch('add')

// 我们可以这样描述应用的状态

//时间的变化     t1 - t2
//action的变化  add - add 
//state的变化   1   -  2

// t0---t1---t2---

  

## 理解 redux 的时间旅行



