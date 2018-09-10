const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const PropTypes = require('prop-types')
const connect = require('react-redux').connect
const actions = require('../../../../actions')
const { DEFAULT_ROUTE } = require('../../../../routes')

PrivateKeyImportView.contextTypes = {
  t: PropTypes.func,
}

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PrivateKeyImportView)


function mapStateToProps (state) {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(state.metamask.accounts)[0],
  }
}

function mapDispatchToProps (dispatch) {
  return {
    importNewAccount: (strategy, [ privateKey ]) => {
      return dispatch(actions.importNewAccount(strategy, [ privateKey ]))
    },
    displayWarning: (message) => dispatch(actions.displayWarning(message || null)),
    setSelectedAddress: (address) => dispatch(actions.setSelectedAddress(address)),
  }
}

inherits(PrivateKeyImportView, Component)
function PrivateKeyImportView () {
  this.createKeyringOnEnter = this.createKeyringOnEnter.bind(this)
  Component.call(this)
}

PrivateKeyImportView.prototype.render = function () {
  const { error, displayWarning } = this.props

  return (
    h('div.new-account-import-form__private-key', [

      h('span.new-account-create-form__instruction', this.context.t('pastePrivateKey')),

      h('div.new-account-import-form__private-key-password-container', [

        h('input.new-account-import-form__input-password', {
          type: 'password',
          id: 'private-key-box',
          onKeyPress: e => this.createKeyringOnEnter(e),
        }),

      ]),

      h('div.new-account-import-form__buttons', {}, [

        h('button.btn-default.btn--large.new-account-create-form__button', {
          onClick: () => {
            displayWarning(null)
            this.props.history.push(DEFAULT_ROUTE)
          },
        }, [
          this.context.t('cancel'),
        ]),

        h('button.btn-primary.btn--large.new-account-create-form__button', {
          onClick: () => this.createNewKeychain(),
        }, [
          this.context.t('import'),
        ]),

      ]),

      error ? h('span.error', error) : null,
    ])
  )
}

PrivateKeyImportView.prototype.createKeyringOnEnter = function (event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    this.createNewKeychain()
  }
}

PrivateKeyImportView.prototype.createNewKeychain = function () {
  const input = document.getElementById('private-key-box')
  const privateKey = input.value
  const { importNewAccount, history, displayWarning, setSelectedAddress, firstAddress } = this.props

  importNewAccount('Private Key', [ privateKey ])
    .then(({ selectedAddress }) => {
      if (selectedAddress) {
        history.push(DEFAULT_ROUTE)
        displayWarning(null)
      } else {
        displayWarning('Error importing account.')
        setSelectedAddress(firstAddress)
      }
    })
    .catch(err => err && displayWarning(err.message || err))
}
