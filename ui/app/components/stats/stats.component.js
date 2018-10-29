import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CountTo from 'react-count-to'

const Tooltip = require('../tooltip-v2.js')

class Stats extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    mode: PropTypes.string,
    setMode: PropTypes.func,
  }

  render () {
    const { t } = this.context
    const { mode, setMode } = this.props

    // todo: commaize value
    const countDisplay = value => <span>{value}</span>;
    
    return (
        <div className="stats">
          <div>
            <CountTo to={3} speed={1000}>{countDisplay}</CountTo> ads
            <div className="count-label">on this page</div>
          </div>
          <div>
            <CountTo to={23888} speed={1000}>{countDisplay}</CountTo> ads
            <div className="count-label">seen today</div>
          </div>
          <div>
            <CountTo to={28} speed={1000}>{countDisplay}</CountTo> XCLR
            <div className="count-label">earned today</div>
          </div>
          <div>
            <CountTo to={1843} speed={1000}>{countDisplay}</CountTo> XCLR
            <div className="count-label">earned total</div>
          </div>
        </div>
    )
  }
}



export default Stats
