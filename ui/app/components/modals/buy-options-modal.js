const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const { getNetworkDisplayName } = require('../../../../app/scripts/controllers/network/util')

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    address: state.metamask.selectedAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toCoinbase: (address) => {
      dispatch(actions.buyEth({ network: '1', address, amount: 0 }))
    },
    hideModal: () => {
      dispatch(actions.hideModal())
    },
    showAccountDetailModal: () => {
      dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
    },
    toFaucet: network => dispatch(actions.buyEth({ network })),
  }
}

inherits(BuyOptions, Component)
function BuyOptions () {
  Component.call(this)
}

BuyOptions.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(BuyOptions)


BuyOptions.prototype.renderModalContentOption = function (title, header, onClick) {
  return h('div.buy-modal-content-option', {
    onClick,
  }, [
    h('div.buy-modal-content-option-title', {}, title),
    h('div.buy-modal-content-option-subtitle', {}, header),
  ])
}

BuyOptions.prototype.render = function () {
  const { network, toCoinbase, address, toFaucet } = this.props
  const isTestNetwork = ['3', '4', '42'].find(n => n === network)
  const networkName = getNetworkDisplayName(network)

  return h('div', {}, [
    h('div.buy-modal-content.transfers-subview', {
    }, [
      h('div.buy-modal-content-title-wrapper.flex-column.flex-center', {
        style: {},
      }, [
        h('div.buy-modal-content-title', {
          style: {},
        }, this.context.t('transfers')),
        h('div', {}, this.context.t('howToDeposit')),
      ]),

      h('div.buy-modal-content-options.flex-column.flex-center', {}, [

        isTestNetwork
          ? this.renderModalContentOption(networkName, this.context.t('testFaucet'), () => toFaucet(network))
          : this.renderModalContentOption('Coinbase', this.context.t('depositFiat'), () => toCoinbase(address)),

        // h('div.buy-modal-content-option', {}, [
        //   h('div.buy-modal-content-option-title', {}, 'Shapeshift'),
        //   h('div.buy-modal-content-option-subtitle', {}, 'Trade any digital asset for any other'),
        // ]),,

        this.renderModalContentOption(
          this.context.t('directDeposit'),
          this.context.t('depositFromAccount'),
          () => this.goToAccountDetailsModal()
        ),

      ]),

      h('button', {
        style: {
          background: 'white',
        },
        onClick: () => { this.props.hideModal() },
      }, h('div.buy-modal-content-footer#buy-modal-content-footer-text', {}, this.context.t('cancel'))),
    ]),
  ])
}

BuyOptions.prototype.goToAccountDetailsModal = function () {
  this.props.hideModal()
  this.props.showAccountDetailModal()
}
