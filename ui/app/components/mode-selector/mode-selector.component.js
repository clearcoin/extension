import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MultiToggle from 'react-multi-toggle'

const Tooltip = require('../tooltip-v2.js')

const modeOptions = [
  {
    displayName: 'Earn',
    value: 'Earn'
  },
  {
    displayName: 'Hide',
    value: 'Hide'
  },
  {
    displayName: 'Off',
    value: 'Off'
  },
];

class ModeSelector extends Component {
  state = {
    mode: 'Earn',
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    selectedAddress: PropTypes.string,
    selectedIdentity: PropTypes.object,
  }

  onModeSelect = value => this.setState({ mode: value });

  render () {
    const { t } = this.context
    // const { mode } = this.props
    const { mode } = this.state

    return (
      <div className="mode-selector">
        <Tooltip
          position="bottom"
      html={(
          <div>
            EARN - see ads and earn XCLR
            <br />HIDE - block all ads
            <br />OFF - turn off completely
          </div>
        )}>
            <MultiToggle
              options={modeOptions}
              selectedOption={mode}
              onSelectOption={this.onModeSelect}
            />
        </Tooltip>
      </div>
    )
    
    // return (
    //   <div className="selected-account">
    //     <Tooltip
    //       position="bottom"
    //       title={this.state.copied ? t('copiedExclamation') : t('copyToClipboard')}
    //     >
    //       <div
    //         className="selected-account__clickable"
    //         onClick={() => {
    //           this.setState({ copied: true })
    //           setTimeout(() => this.setState({ copied: false }), 3000)
    //           copyToClipboard(selectedAddress)
    //         }}
    //       >
    //         <div className="selected-account__name">
    //           { selectedIdentity.name }
    //         </div>
    //       </div>
    //     </Tooltip>
    //   </div>
    // )
  }
}

export default ModeSelector
