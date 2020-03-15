

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

store.subscribe(()=>{
    let state = store.getState();
    console.log('state 的值是：',state);
})

store.dispatch({
    ...store.getState(),
    count:2
})