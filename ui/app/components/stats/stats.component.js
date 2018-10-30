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
            <CountTo to={stats.today.ads_seen} speed={1000}>{countDisplay}</CountTo> ads
            <div className="count-label">seen today</div>
          </div>
          <div>
            <CountTo to={stats.total.ads_seen} speed={1000}>{countDisplay}</CountTo> ads
            <div className="count-label">seen total</div>
          </div>
          <div>
            <CountTo to={stats.today.xclr_earned} speed={1000}>{countDisplay}</CountTo> XCLR
            <div className="count-label">earned today</div>
          </div>
          <Tooltip
            position="bottom"
            html={(
                <div>
                Earned XCLR will be sent to your wallet twice a month by the 15th and 30th. Your KYC needs to be completed to receive earned XCLR. Contact help@clearcoin.co for support.
                </div>
              )}>
              <CountTo to={stats.total.xclr_earned} speed={1000}>{countDisplay}</CountTo> XCLR
              <div className="count-label">earned total</div>
          </Tooltip>
        </div>
    )
  }
}

export default Stats
