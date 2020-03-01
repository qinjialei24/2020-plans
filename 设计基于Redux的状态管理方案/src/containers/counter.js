import { connect } from 'react-redux'
import Counter from "../components/counter";
import store from "../store/index";


const mapStateToProps = (state, ownProps) => {
  return {
    count: state.counter.count
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: _ => {
      dispatch(store.counter.add)
    },
    minus: _ => {
      dispatch(store.counter.minus)
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
