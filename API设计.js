// 在store对象增加属性，无需声明action，方便调用reducer
// 第一步
const store = {
  counter: {
    reducer: {
      add:'counter/reducer/add'
    },
    effect: {
      asyncAdd:'counter/effect/asyncAdd'
    },
  },
  todo: {
    reducer: {
    delete:'todo/reducer/delete'
  },
  effect: {
    asyncDelete:'todo/effect/asyncDelete'
  },},
}  

// 第二步
// 通过字符串分割，判断是reducer还是effect
// 若是effect，在dispatch的时候当做函数先执行