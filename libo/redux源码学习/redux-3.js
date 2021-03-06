function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
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

function InfoReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'SET_DESCRIPTION':
            return {
                ...state,
                description: action.description
            }
        default:
            return state;
    }
}


function combineReducers(reducers) {

    /* reducerKeys = ['counter', 'info']*/
    const reducerKeys = Object.keys(reducers)

    /*返回合并后的新的reducer函数*/
    return function combination(state = {}, action) {
        /*生成的新的state*/
        const nextState = {}

        /*遍历执行所有的reducers，整合成为一个新的state*/
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i]
            const reducer = reducers[key]
            /*之前的 key 的 state*/
            const previousStateForKey = state[key]
            /*执行 分 reducer，获得新的state*/
            const nextStateForKey = reducer(previousStateForKey, action)

            nextState[key] = nextStateForKey
        }
        return nextState;
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

const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer
});

let initState = {
    counter: {
        count: 0
    },
    info: {
        name: 'zs',
        description: 'redux从0-1'
    }
}

let store = createStore(reducer, initState);

store.subscribe(() => {
    let state = store.getState();
    console.log(state.counter.count, state.info.name, state.info.description);
});
/*自增*/
store.dispatch({
    type: 'INCREMENT'
});

/*修改 name*/
store.dispatch({
    type: 'SET_NAME',
    name: 'ls'
});