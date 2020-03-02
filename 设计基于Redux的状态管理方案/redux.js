class Subject {
  constructor() {
    this.listeners = []
  }
  subscribe(cb) {
    this.listeners.push(cb)
  }
  notify() {
    this.listeners.forEach(cb => cb())
  }
}

const obj = new Subject();

obj.subscribe(() => {
  console.log('1');
})

obj.notify()