import { connect } from 'react-redux'
import Referrals from './referrals.component'

const selectors = require('../../selectors')
const actions = require('../../actions')

const mapStateToProps = state => {
  return {
    referralCode: selectors.getReferralCode(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getReferralCodeFromService: value => dispatch(actions.getReferralCodeFromService()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Referrals)
