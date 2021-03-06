import { connect } from 'react-redux'
import ModeSelector from './mode-selector.component'

const selectors = require('../../selectors')
const actions = require('../../actions')

const mapStateToProps = state => {
  return {
    mode: selectors.getMode(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMode: value => dispatch(actions.setMode(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModeSelector)
