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

