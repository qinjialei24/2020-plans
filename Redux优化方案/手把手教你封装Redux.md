https://hackernoon.com/redesigning-redux-b2baee8b8a38
其实大部分情况下，你不需要 Redux，但如果实在需要使用，跟着我一起优化 Redux 吧
如果你用过 vue 的 vuex 或者 angular 的 service+rxjs 来做状态管理，你就会发现 Redux 太特么难用了

先看看优化之后的成果，所有这些只需要十多行代码！极致性价比！


先来个对比

比如
- 定义 action 太麻烦，一大堆模板代码
- action 和 reducer 分开写，文件切换太麻烦
- 没有模块化概念
- 没有命名空间的概念

// 觉得 redux 太难用，没关系，教你十多行代码在 Redux 的基础上封装，提升你的开发体验
## 前言
- redux 封装程度较低，导致直接使用过于繁琐
- 