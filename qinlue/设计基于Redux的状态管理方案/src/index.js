import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/index.js'
class App extends React.Component {
  constructor () {
    super()
    this.state = {
      store: store.getState()
    }
    store.subscribe(()=>{
      this.setState({
        store: store.getState()
      })
    })
  }
    render() {
      return ( <div>
        <h3>counter value is:</h3>
        <hr />
        <button onClick={this.add}>+</button>
        <button onClick={this.minus}>-</button>
        <h4>{this.state.store.counterReducer.count}</h4>
      </div>)
    }
    add = ()=> {
      store.dispatch({
        type: 'INCREMENT'
      })
    }
    minus = ()=> {
      store.dispatch({
        type: 'DECREMENT'
      })
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


