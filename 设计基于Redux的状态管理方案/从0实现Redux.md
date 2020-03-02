---
presentation:

 theme: simple.css
 progress: true

---


<!-- slide -->
# 从0实现 Redux 
1. 实现一个最简单的状态管理
2. Redux 的问题
   1. 全局单一 store 的理念导致产生了一颗巨大的状态树，状态树的任意节点更新，将导致所有组件触发更新，即使该组件不依赖该状态
   2. immutable 写起来太恶心
   3. 模板代码太多，比如需要定义各种烦人的 action
   4. action 与 reduce 是一一对应的，但是官方却推荐将两者独立成两个文件，导致维护成本上升
3. 
<!-- slide -->
实现一个最简单的状态管理
```js
let state = {
  count: 1
};
let listeners = [];

function subscribe(listener) {
  listeners.push(listener);
}

function changeCount(count) {
  state.count = count;
  listeners.forEach(listen=>{
    listen()
  })
}
```
<!-- slide -->
# Redux 的问题

<!-- slide -->
 - Redux 全局单一 store 的理念导致产生了一颗巨大的状态树，状态树的任意节点更新，将导致所有组件触发更新，即使该组件不依赖该状态
```js
const state ={
  a:{
    count:0,
    b:{
      c:{
        count:1
      }
    }
  }
}

```

<!-- slide -->
```js
const mapStateToProps = (state, ownProps) => {
  return {
    list: state.todo.list,
    inputValue: state.todo.inputValue,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    asyncDelete: data => {
      // dispatch(store.todo.add, data)
      dispatch(store.todo.asyncDelete, data)
    },
    inputChange: data => {
      dispatch(store.todo.changeInput, data.target.value)
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo)
```
