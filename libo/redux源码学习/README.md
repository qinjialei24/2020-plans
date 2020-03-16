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
以上代码首先通过创建一个createStore函数传入初始数据，函数内部定义state以及订阅容器变量。然后再分别创建订阅、发布、获取state函数，最后返回这三个函数。使用方法就是执行createStore传入initData，然后执行订阅。最后想要改变数据的时候通过dispatch触发数据更新。

当然以上仅是一个简易版数据更改操作，并未涉及到action和reducer，后续会再继续完善。


### redux2.0(实现action和reducer)

根据redux1.0代码可以发现数据是可以按照我们的要求改变，但是会遇到两个问题。首先就是我们对修改数据没有任何约束，它可以被任何人修改成任何属性。我们无法数据进行自定义修改。其次，根据官方文档修改数据的方法是通过dispatch()一个带有type属性的对象。所以根据这两点，再重新改写下。

按照以上思路首先改写createStore函数中的dispatch函数，从原来的传入新数据改为传入action对象，且state也不能像之前一样赋值给传入的newState：

```js

let createStore = function(initState){
    let state = initState;
    //...省略
    function dispatch(action){
        state = reducer(state,action) //由于传入的是一个action对象，可以创建一个reducer的函数转换成数据
    }

}

```

由于dispatch改为接收一个action对象，所以我们需要创建reducer函数将传入的对象转换成数据：

```js

function reducer(state,action){
    switch (action.type){
        case 'INCREMENT':
            return {
                ...state,
                count:state.count + 1
            }
        case 'DECREMENT':
            return {
                ...state,
                count:state.count - 1
            }
        default:
            return state;
    }
}

```

创建好reducer之后，需要把这个数据转换函数传递给createStore，结合下就是：

```js

let initState = {
    count: 0
}

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                count: state.count + 1
            }
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1
            }
        default:
            return state;
    }
}

const createStore = function (reducer, initState) {
    let state = initState;
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener)
    }
    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener()
        }
    }
    function getState() {
        return state;
    }
    return {
        subscribe,
        dispatch,
        getState
    }
}

```

然后我们就可以根据自定义的type来改变数据：

```js

let store = createStore(reducer,initState)

store.subscribe(() => {
    let state = store.getState()
    console.log(`count的值是:${state.count}`);
})
//递增
store.dispatch({
    type:'INCREMENT'
})
//递减
store.dispatch({
    type:'DECREMENT'
})
//无效修改
store.dispatch({
    count:'aaa'
})

```
