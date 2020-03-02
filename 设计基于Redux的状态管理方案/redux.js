class Subject {
  constructor() {
    this.listeners = []
  }
  subscribe(cb) {
    this.listeners.push(cb)
  }
  dispatch() {
    this.listeners.forEach(cb => cb())
  }
}

const store = new Redux();

store.subscribe(() => {
  console.log('1');
})

store.dispatch()