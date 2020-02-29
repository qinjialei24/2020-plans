# 前言
说实话，三大前端框架的状态管理方案（redux、vuex、service+rxjs ），从开发体验上来看，毫无疑问，redux 是最差的，这也导致出现了一大堆 redux 的改良品

但那都是别人家的轮子，出于对自己产品负责的态度，大家都不太敢随意使用，还是尽量使用原生 redux ，毕竟 redux 是经过无数产品考验过的，可靠性能够保证

其实我们不需要动手从零再造个轮子，我们只需要稍微加几十行代码，就可以稍微优化一下 redux，以最低的成本提升一些开发体验

当然，这些优化可能在你看起来，稍显简陋或者并不是你的痛点

但那并不重要，本文只是提供一个最小成本优化 redux 可行的思路

> 一定要敢于尝试，并且要敢于去敲代码去改变一些你觉得不合理的设计

# 正文

# 官方推荐 action 和 reducer 放在不同文件，但是这样导致文件切换繁琐
按照一般的文件分类，我们有 **action** 和 **reducer** 两个文件

Action 和 Reducer 明显是一一对应的，没必要分为不同的文件

举个计数器的🌰子

文件目录结构如下

- store
    - action.js
    - reducer.js

```js
// action.js
export const ADD ='add'

//reducer.js
const counter ={ count: 0 }

export default function reducer(state = counter, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count:state.count+1
      }
      break;

    default:
      return state
      break;
  }
}

//组件使用
import {ADD} from './action.js'

store.dispatch(ADD)
```
当我们想要查看组件逻辑 **store.dispatch(ADD)** 时，我们需要

1. 打开 action 文件，搜索常量 ADD
2. 打开 reducer 文件，搜索常量 ADD

此处有两次文件的切换操作，在我看来是完全没必要的，上述 action 和 reducer **本质是改变同一个状态(即 counter 对象)**，既然是改变同一个状态，为什么不把他们和他们要改变的状态放在一起呢？

我们可以这么做，以我们需要改变的状态 **counter** 为文件名建立文件，放入对应的 action 和 reducer 

文件目录结构如下

- store
    - counter.js

**counter.js** 内容如下
```js
const initialState = {
  count: 10
}

function reducer(state = counter, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count:state.count+1
      }
      break;

    default:
      return state
      break;
  }
}

```
# Reducer switch 写法较为繁琐
当 reducer 较多时，使用 switch 较为繁琐

我们可以写个工具方法 将 reducer switch 风格 转换成对象风格，将 action 转换成对象的属性名
```js
//工具方法
const handleActions = ({ state, action, reducers}) =>
  Object.keys(reducers)
    .includes(action.type)
    ? reducers[action.type](state,action)
    : state


//counter.js
const initialState = {
  count: 10
}

const reducers = {
  add(state, action) {
    return{
      ...state,
      count:state.count+1
    }
  },
  minus(state, action) {
    return{
      ...state,
      count:state.count-1
    }
  },
}

export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
})

```

# reducer 必须是纯函数,必须返回新的引用，当对象层次较深时，写法繁琐
我们可以通过引入 **immer（一个小巧的不可变数据结构的库）** 来优化

第一步 引入 immer
```js
import produce from "immer"
```
第二步 修改 handleActions 工具函数
```js
export const handleActions = ({ state, action, reducers}) =>
  Object.keys(reducers)
    .includes(action.type)
    ? produce(state, draft => reducers[action.type](draft, action))
    : state

//新增了这一行
produce(state, draft => reducers[action.type](draft, action))
```
然后我们写 reducer 就可以

1. **不需要每次手动return**
2. **不需要手动生成新的引用**

如下
```js
// 改造前
const reducers = {
  add(state, action) {
    return{
      ...state,
      count:state.count+1
    }
  },
  minus(state, action) {
    return{
      ...state,
      count:state.count-1
    }
  },
}
//改造后
const reducers = {
  add(state, action) {
    state.count++
  },
  minus(state, action) {
    state.count--
  },
}
```


稍微解释一下我们新增的这行代码

```js
produce(state, draft => reducers[action.type](draft, action))
```
这里涉及到 immer 的使用

produce 的第一个参数是你想操作的对象，我们这里是操作 state

第二个参数是一个函数，immer 会给该函数传个参数，参数为你操作的对象的副本（可以理解为深拷贝对象），对该副本进行操作时不会影响原对象

所以我们在 reducers 对象内写的函数就相当于写 produce 的第二个参数，同时在 handleActions 工具函数内，我们通过三元表达式也已经 return了，也就实现了 reducers 对象内的函数不需要手动 return
# 增加命名空间
当项目大了后，我们写的 action 可能存在命名冲突的问题，解决办法是以当前文件名当做命名空间

例如，我们有如下目录结构

- store
    - counter.js
  
有一天我们需要增加个 todo-list 模块

- store
    - counter.js
    - todoList.js
  
为了防止 counter 和 todoList 内 action 命名冲突，我们可以改造下 handleActions 工具函数
```js
import produce from "immer"

const getKey = (str, flag) => {
  const i = str.indexOf(flag)
  return str.substring(i + 1, str.length + 1)
}

export const handleActions = ({ state, action, reducers, namespace = '' }) =>
  Object.keys(reducers)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducers[getKey(action.type, '/')](draft, action))
    : state

export default (state = initialState, action) => handleActions({
  namespace: 'counter',//增加命名空间
  state,
  action,
  reducers,
})
``` 
组件这样使用
```js
store.dispatch('counter/add')//counter 模块的 add方法
store.dispatch('todoList/add')//todoList 模块的 add方法
``` 
[示例代码](https://github.com/qinjialei1023/my-redux/blob/master/my-app/src/store/modules/todo.js)

 
# 待优化的点
- action 基于字符串，编辑器无法做到智能提示，并且容易出现拼写错误
- 支持ts

未完待续。。。


