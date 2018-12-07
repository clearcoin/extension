import React, { Component } from 'react'
import PropTypes from 'prop-types'

const h = require('react-hyperscript')
const Tooltip = require('../tooltip-v2.js')
const copyToClipboard = require('copy-to-clipboard')

class Referrals extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    referralUrl: PropTypes.string,
  }
  
  render () {
    const { t } = this.context
    const { referralUrl } = this.props
    
    // this.state = {
    //   hasCopied: false,
    //   copyToClipboardPressed: false,
    // }
    
    return h('div.referrals', [
      h('img.clearybot', { src: "./images/clearybot.svg" }),
      h('div.referrals-explanation', [
        h('strong.callout-heading', "Invite Your Friends"),
        h('br'),
        "When they complete KYC, you'll both earn ",
        h('span.purp', "500 XCLR!"),
        // h(Tooltip, {
        //   position: 'bottom',
        //   title: this.state.hasCopied ? this.context.t('copiedExclamation') : this.context.t('copyToClipboard'),
        // }, [
        //   h('button.wallet-view__address', {
        //     className: classnames({
        //       'wallet-view__address__pressed': this.state.copyToClipboardPressed,
        //     }),
        //     onClick: () => {
        //       copyToClipboard(referralUrl)
        //       this.setState({ hasCopied: true })
        //       setTimeout(() => this.setState({ hasCopied: false }), 3000)
        //     },
        //     onMouseDown: () => {
        //       this.setState({ copyToClipboardPressed: true })
        //     },
        //     onMouseUp: () => {
        //       this.setState({ copyToClipboardPressed: false })
        //     },
        //   }, [
        //     referralUrl,
        //     h('i.fa.fa-clipboard', { style: { marginLeft: '8px' } }),
        //   ]),
        // ]),
      ]),
    ])
  }
}

export default Referrals
