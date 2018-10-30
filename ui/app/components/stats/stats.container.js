import { connect } from 'react-redux'
import Stats from './stats.component'

const selectors = require('../../selectors')

const mapStateToProps = state => {
  return {
    stats: selectors.getStats(state),
  }
}

export default connect(mapStateToProps)(Stats)
