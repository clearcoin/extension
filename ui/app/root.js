const { Component } = require('react')
const PropTypes = require('prop-types')
const { Provider } = require('react-redux')
const h = require('react-hyperscript')
const { HashRouter } = require('react-router-dom')
const I18nProvider = require('./i18n-provider')
const App = require('./app')
const SelectedApp = require('./select-app')

class Root extends Component {
  render () {
    const { store } = this.props

    return (
      h(Provider, { store }, [
        h(SelectedApp),
      ])
    )
  }
}

Root.propTypes = {
  store: PropTypes.object,
}

module.exports = Root
