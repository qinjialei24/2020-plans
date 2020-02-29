import { OPTION } from "./constant";
// 1.匹配对应命名空间的 reducer
// 2. 使用 immer 简化 reducer 函数编写
const handleReducer = ({ state, action, reducer, namespace = '' }) =>
  Object.keys(reducer)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducer[getKey(action.type, '/')](draft, action))
    : state

export const createModel = (model) => {
  const { reducer, namespace } = model
  const reducerFn = (state = model.state, action) => handleReducer({
    state,
    action,
    reducer,
    namespace
  })
  reducerFn[OPTION] = model//将当前 model 的配置信息 挂载到 reducerFn 的 option 属性上
  return reducerFn
}

// 将每个 reducer model 挂在 store 对应 namespace 上
// /* TODO: */ combineReducers 调用时 检查 参数key 与 对应模块的 namespace 是否一致 
const initModules = (store, modules) => {
  Object.keys(modules).forEach(moduleName => {
    store[moduleName] = modules[moduleName][OPTION]
  })
}

export const init = (store, modules) => {
  initModules(store, modules)

  return store
}


// 期望这样使用

// 组件同步调用 
dispatch(store.counter.add)

// 组件异步调用 
dispatch(store.counter.add)
