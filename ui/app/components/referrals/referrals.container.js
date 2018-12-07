import { connect } from 'react-redux'
import Referrals from './referrals.component'

const selectors = require('../../selectors')

const mapStateToProps = state => {
  return {
    referralUrl: 'https://platform.clearcoin.co/invite/FH88',
    stats: selectors.getStats(state),
  }
}

export default connect(mapStateToProps)(Referrals)
