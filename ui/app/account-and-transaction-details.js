const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
// Main Views
const TxView = require('./components/tx-view')
const WalletView = require('./components/wallet-view')

module.exports = AccountAndTransactionDetails

inherits(AccountAndTransactionDetails, Component)
function AccountAndTransactionDetails () {
  Component.call(this)
}

AccountAndTransactionDetails.prototype.render = function () {
  return h('div.account-and-transaction-details', [
    // wallet
    h(WalletView, {
      style: {
      },
      responsiveDisplayClassname: '.lap-visible',
    }, [
    ]),

    // transaction
    h(TxView, {
      style: {
      },
    }, [
    ]),
  ])
}

