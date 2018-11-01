import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CountTo from 'react-count-to'

const Tooltip = require('../tooltip-v2.js')

class Stats extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    stats: PropTypes.string,
  }
  
  render () {
    const { t } = this.context
    const { stats } = this.props
    
    // todo: comma-ize value
    const countDisplay = value => <span>{value}</span>;
    
    return (
        <div className="stats">
          <div>
            <CountTo to={stats.today.ads_seen} speed={1100} delay={15}>{countDisplay}</CountTo> ads
            <div className="count-label">seen today</div>
          </div>
          <div>
            <CountTo to={stats.total.ads_seen} speed={1100} delay={15}>{countDisplay}</CountTo> ads
            <div className="count-label">seen total</div>
          </div>
          <Tooltip
            position="bottom"
            html={(
                <div>
                Due to frequency caps from advertisers, you are only able to earn XCLR for up to 100 ads per hour.
                </div>
              )}>
            <CountTo to={stats.today.xclr_earned} speed={1100} delay={15}>{countDisplay}</CountTo> XCLR
            <div className="count-label">earned today</div>
          </Tooltip>
          <Tooltip
            position="bottom"
            html={(
                <div>
                Earned XCLR will be sent to your wallet twice a month by the 15th and 30th. Your KYC needs to be completed to receive any earned XCLR. Users that have not yet completed their KYC can accrue a maximum of 1,000 XCLR on their account. Contact help@clearcoin.co for support.
                </div>
              )}>
              <CountTo to={stats.total.xclr_earned} speed={1100} delay={15}>{countDisplay}</CountTo> XCLR
              <div className="count-label">earned total</div>
          </Tooltip>
        </div>
    )
  }
}

export default Stats
