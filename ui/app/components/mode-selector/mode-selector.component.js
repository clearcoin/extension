import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MultiToggle from 'react-multi-toggle'

const Tooltip = require('../tooltip-v2.js')

const modeOptions = [
  {
    displayName: 'Earn',
    value: 'earn'
  },
  {
    displayName: 'Hide',
    value: 'hide'
  },
  {
    displayName: 'Off',
    value: 'off'
  },
];

class ModeSelector extends Component {
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

    return (
      <div className="mode-selector">
        <Tooltip
          position="bottom"
          html={(
              <div>
                EARN - see ads and earn XCLR
                <br />HIDE - block all ads
                <br />OFF - show regular ads
              </div>
            )}>
            <MultiToggle
              options={modeOptions}
              selectedOption={mode}
              onSelectOption={setMode}
            />
        </Tooltip>
      </div>
    )
  }
}

export default ModeSelector
