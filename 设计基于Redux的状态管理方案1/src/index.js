import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
  constructor () {
    super()
    this.state = {
      props:{
        add:()=>{},
        minus:()=>{}
      }
    }
  }
    render() {
      return ( <div>
        <h3>counter value is:</h3>
        <hr />
        <button onClick={this.state.props.add}>+</button>
        <button onClick={this.state.props.minus}>-</button>
        <h4>{this.state.props.count}</h4>
      </div>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


