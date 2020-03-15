# 前言
初学redux的时候主要是通过查看官方文档以及视频实战，虽然知道了redux的实际用法，但是也仅仅只是知道了API的用法，对于其为什么这样的设计及原理并不是很清楚。所以为了搞懂redux实现原理，本篇记录从0到1一步步如何实现redux。

## redux核心
在实现redux之前，首先回顾下redux的几个核心以及具体使用方法：
- store:在redux中通过createStore函数创建store，可以把store看成一个容器，它有几个方法，包括获取、修改数据。
- state：store对象中的所有数据。
- action：一个描述对象，必须包含type属性。通常type是一个字符串用来描述数据的操作。
- reducer：在redux中改变数据是通过store接受一个action后返回新的state，从接收action到计算出新的state过程称为reducer。

## 从0到1实现redux

### redux1.0

根据官方文档可以发现，通过createStore函数初始化赋值给store后，可以通过store.dispatch()，store.getState()等方法修改/获取数据，那么我们可以在createStore函数中定义这些函数并返回即可。

```js

let initData = {
    count:1
}

let createStore = function(initState){
    let state = initState;
    let listeners = []

    //订阅
    function subscribe(listener){
        listeners.push(listener)
    }

    //  发布
    function dispatch(newState){
        //获取新数据
        state = newState;
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener()
        }        
    }

    function getState(){
        return state;
    }
    
    return {
        subscribe,
        dispatch,
        getState
    }

}

let store = createStore(initData);

// 订阅
store.subscribe(()=>{
    let state = store.getState();
    console.log('state 的值是：',state); //state 的值是 2
})

//通过dispatch派发更改数据
store.dispatch({
    ...store.getState(),
    count:2
})

```

当然以上仅是一个简易版数据更改操作，并未涉及到action和reducer，后续会再继续完善。不过可以看出核心是通过发布订阅来完成数据的更新。

### redux2.0(实现action和reducer)....