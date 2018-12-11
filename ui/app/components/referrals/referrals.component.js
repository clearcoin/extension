import React, { Component } from 'react'
import PropTypes from 'prop-types'

const config = require('../../../../app/config')
const h = require('react-hyperscript')
const classnames = require('classnames')
const Tooltip = require('../tooltip-v2.js')
const copyToClipboard = require('copy-to-clipboard')

class Referrals extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    referralCode: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      hasCopied: false,
      copyToClipboardPressed: false,
    }
  }

  componentWillMount () {
    const { referralCode, getReferralCodeFromService } = this.props

    if ( ! referralCode) { // if not already set in our extension storage, then we need to retrieve from web service
      getReferralCodeFromService()
    }
  }
  
  renderReferralLink = (referralUrl) => {
    return h(Tooltip, {
      position: 'bottom',
      title: this.state.hasCopied ? this.context.t('copiedExclamation') : this.context.t('copyToClipboard'),
    }, [
      h('button.wallet-view__address', {
        className: classnames({
          'wallet-view__address__pressed': this.state.copyToClipboardPressed,
        }),
        onClick: () => {
          copyToClipboard(referralUrl)
          this.setState({ hasCopied: true })
          setTimeout(() => this.setState({ hasCopied: false }), 3000)
        },
        onMouseDown: () => {
          this.setState({ copyToClipboardPressed: true })
        },
        onMouseUp: () => {
          this.setState({ copyToClipboardPressed: false })
        },
      }, [
        referralUrl,
        h('i.fa.fa-clipboard', { style: { marginLeft: '8px' } }),
      ]),
    ])
  }
  
  render () {
    const { t } = this.context
    const { referralCode } = this.props
    const referralUrl = config.REFERRAL_BASE_URL + referralCode
    
    return h('div.referrals', [
      h('img.clearybot', { src: "./images/clearybot.svg" }),
      h('div.referrals-explanation', [
        h('strong.callout-heading', "Invite Your Friends"),
        h('br'),
        "Share this link, and both of you will earn",
        h('br'),
        h('span.purp', "500 XCLR"), " when they complete KYC!", 
        (referralCode ? this.renderReferralLink(referralUrl) : ""),
      ]),
    ])
  }
}

export default Referrals
