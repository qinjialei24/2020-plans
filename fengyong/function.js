var curry = function(fn){
    var l = fn.length, args = [...arguments];
    return function(){
        var nArgs = [...args, ...arguments];
        if(nArgs.length - 1 < l){
            return curry(...nArgs);
        }else{
            return fn.apply(this, nArgs.slice(1));
        }
    }
}


var compose = function(...fns){
    var l = fns.length, self;
    var next = function(i){
        i --;
        return function(){
            if( i < 0 )  return typeof self == 'function' && self(...arguments);
            if( i == l - 1 ) self = this; // 组合嵌套时， 当前this已改变
            var res = fns[i].apply(next(i), arguments);
            if(res) return next(i)(res);
            return res;
        }
    }
    return next(l);
}
var fn = curry(function(a, b){
    console.log('a, b');
    setTimeout( _ => this( a + b), 1000);
});
var m = compose(fn('a'), function(){
    console.log('1a');
    return 1;
});
//m()
var n = compose(function(x){ console.log(x) }, m);
//n()


var chain = curry(function(f, m){
    try{
        return f(m).value.call(this);
    }catch{
        throw new Error('chain传入的方法不符合规范');
    }
});
class IO {
    constructor(fn) {
        this.value = fn;
    }
    start(arg){
        return this.value.call(new Function(), arg);
    }
    chain(f){
        var value = this.value;
        return new IO(function(){
            return compose(m => f(m).value.call(this), value)();
        });
        // return this.map(function(m){
        //     return f(m).value();
        // })
    }
    of(x){
        return new IO(function(){
            return x;
        });
    }
    map(fn){
        return new IO(compose(fn, this.value));
    }
}



// var io = new IO(_ => window).map(x => console.log(x))
var getWindow = function(){
    console.log(1)
    return new IO(function(){
        console.log(2)
        // setTimeout(_ => this(window), 1000)
        return window;
    })
}
var log = function(x){
    console.log(3);
    return new IO(function(){
        console.log(4, this)
        console.log(x);
        // return x;
        setTimeout(_ => this(x), 1000);
    })
}

var io1 = getWindow().map(console.log);
var io2 = getWindow().chain(log).chain(log);
// var co3 = compose( chain(log), chain(getWindow))
// console.log(io2.start())
// co3('')
io1.start();
