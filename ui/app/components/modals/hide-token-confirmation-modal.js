const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const Identicon = require('../identicon')

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    token: state.appState.modal.modalState.props.token,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    hideToken: address => {
      dispatch(actions.removeToken(address))
        .then(() => {
          dispatch(actions.hideModal())
        })
    },
  }
}

inherits(HideTokenConfirmationModal, Component)
function HideTokenConfirmationModal () {
  Component.call(this)

  this.state = {}
}

HideTokenConfirmationModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(HideTokenConfirmationModal)


HideTokenConfirmationModal.prototype.render = function () {
  const { token, network, hideToken, hideModal } = this.props
  const { symbol, address } = token

  return h('div.hide-token-confirmation', {}, [
    h('div.hide-token-confirmation__container', {
    }, [
      h('div.hide-token-confirmation__title', {}, [
        this.context.t('hideTokenPrompt'),
      ]),

      h(Identicon, {
        className: 'hide-token-confirmation__identicon',
        diameter: 45,
        address,
        network,
      }),

      h('div.hide-token-confirmation__symbol', {}, symbol),

      h('div.hide-token-confirmation__copy', {}, [
        this.context.t('readdToken'),
      ]),

      h('div.hide-token-confirmation__buttons', {}, [
        h('button.btn-cancel.hide-token-confirmation__button.allcaps', {
          onClick: () => hideModal(),
        }, [
          this.context.t('cancel'),
        ]),
        h('button.btn-clear.hide-token-confirmation__button.allcaps', {
          onClick: () => hideToken(address),
        }, [
          this.context.t('hide'),
        ]),
      ]),
    ]),
  ])
}
