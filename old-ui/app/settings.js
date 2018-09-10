const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../../ui/app/actions')

module.exports = connect(mapStateToProps)(AppSettingsPage)

function mapStateToProps (state) {
  return {}
}

inherits(AppSettingsPage, Component)
function AppSettingsPage () {
  Component.call(this)
}

AppSettingsPage.prototype.render = function () {
  return (

    h('.account-detail-section.flex-column.flex-grow', [

      // subtitle and nav
      h('.flex-row.flex-center', [
        h('i.fa.fa-arrow-left.fa-lg.cursor-pointer', {
          onClick: this.navigateToAccounts.bind(this),
        }),
        h('h2.page-subtitle', 'Settings'),
      ]),

      h('label', {
        htmlFor: 'settings-rpc-endpoint',
      }, 'RPC Endpoint:'),
      h('input', {
        type: 'url',
        id: 'settings-rpc-endpoint',
        onKeyPress: this.onKeyPress.bind(this),
      }),

    ])

  )
}

AppSettingsPage.prototype.componentDidMount = function () {
  document.querySelector('input').focus()
}

AppSettingsPage.prototype.onKeyPress = function (event) {
  // get submit event
  if (event.key === 'Enter') {
    // this.submitPassword(event)
  }
}

AppSettingsPage.prototype.navigateToAccounts = function (event) {
  event.stopPropagation()
  this.props.dispatch(actions.showAccountsPage())
}
