const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect

const AccountPanel = require('./account-panel')

PendingMsgDetails.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect()(PendingMsgDetails)


inherits(PendingMsgDetails, Component)
function PendingMsgDetails () {
  Component.call(this)
}

PendingMsgDetails.prototype.render = function () {
  var state = this.props
  var msgData = state.txData

  var msgParams = msgData.msgParams || {}
  var address = msgParams.from || state.selectedAddress
  var identity = state.identities[address] || { address: address }
  var account = state.accounts[address] || { address: address }

  return (
    h('div', {
      key: msgData.id,
      style: {
        margin: '10px 20px',
      },
    }, [

      // account that will sign
      h(AccountPanel, {
        showFullAddress: true,
        identity: identity,
        account: account,
        imageifyIdenticons: state.imageifyIdenticons,
      }),

      // message data
      h('.tx-data.flex-column.flex-justify-center.flex-grow.select-none', [
        h('.flex-column.flex-space-between', [
          h('label.font-small.allcaps', this.context.t('message')),
          h('span.font-small', msgParams.data),
        ]),
      ]),

    ])
  )
}
