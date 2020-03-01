import { connect } from 'react-redux'
import Todo from "../components/todo";
import store from "../store/index";


const mapStateToProps = (state, ownProps) => {
  return {
    list: state.todo.list,
    inputValue: state.todo.inputValue,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    asyncDelete: data => {
      // dispatch(store.todo.add, data)
      dispatch(store.todo.asyncDelete, data)
    },
    inputChange: data => {
      dispatch(store.todo.changeInput, data.target.value)
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo)
