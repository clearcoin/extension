const inherits = require('util').inherits
const Component = require('react').Component
const connect = require('react-redux').connect
const h = require('react-hyperscript')
const actions = require('../../ui/app/actions')
const log = require('loglevel')
// mascara
const MascaraFirstTime = require('../../mascara/src/app/first-time').default
const MascaraBuyEtherScreen = require('../../mascara/src/app/first-time/buy-ether-screen').default
// init
const InitializeMenuScreen = require('./first-time/init-menu')
const NewKeyChainScreen = require('./new-keychain')
// unlock
const UnlockScreen = require('./unlock')
// accounts
const AccountDetailScreen = require('./account-detail')
const AccountQrScreen = require('./account-qr')
const SendTransactionScreen = require('./send')
const ConfirmTxScreen = require('./conf-tx')
// notice
const NoticeScreen = require('./components/notice')
const generateLostAccountsNotice = require('../lib/lost-accounts-notice')
// other views
const ConfigScreen = require('./config')
const AddTokenScreen = require('./add-token')
const Import = require('./accounts/import')
const InfoScreen = require('./info')
const AppBar = require('./components/app-bar')
const Loading = require('./components/loading')
const BuyView = require('./components/buy-button-subview')
const HDCreateVaultComplete = require('./keychains/hd/create-vault-complete')
const HDRestoreVaultScreen = require('./keychains/hd/restore-vault')
const RevealSeedConfirmation = require('./keychains/hd/recover-seed/confirmation')

module.exports = connect(mapStateToProps)(App)

inherits(App, Component)
function App () { Component.call(this) }

function mapStateToProps (state) {
  const {
    identities,
    accounts,
    address,
    keyrings,
    isInitialized,
    noActiveNotices,
    seedWords,
    featureFlags,
  } = state.metamask
  const selected = address || Object.keys(accounts)[0]

  return {
    // state from plugin
    isLoading: state.appState.isLoading,
    loadingMessage: state.appState.loadingMessage,
    noActiveNotices: state.metamask.noActiveNotices,
    isInitialized: state.metamask.isInitialized,
    isUnlocked: state.metamask.isUnlocked,
    currentView: state.appState.currentView,
    selectedAddress: state.metamask.selectedAddress,
    transForward: state.appState.transForward,
    isMascara: state.metamask.isMascara,
    isOnboarding: Boolean(!noActiveNotices || seedWords || !isInitialized),
    seedWords: state.metamask.seedWords,
    unapprovedTxs: state.metamask.unapprovedTxs,
    unapprovedMsgs: state.metamask.unapprovedMsgs,
    menuOpen: state.appState.menuOpen,
    network: state.metamask.network,
    provider: state.metamask.provider,
    forgottenPassword: state.appState.forgottenPassword,
    nextUnreadNotice: state.metamask.nextUnreadNotice,
    lostAccounts: state.metamask.lostAccounts,
    frequentRpcList: state.metamask.frequentRpcList || [],
    featureFlags,

    // state needed to get account dropdown temporarily rendering from app bar
    identities,
    selected,
    keyrings,
  }
}

App.prototype.render = function () {
  const {
    currentView,
    dispatch,
    isLoading,
    loadingMessage,
    transForward,
    network,
    featureFlags,
  } = this.props
  const isLoadingNetwork = network === 'loading' && currentView.name !== 'config'
  const loadMessage = loadingMessage || isLoadingNetwork
    ? `Connecting to ${this.getNetworkName()}`
    : null
  log.debug('Main ui render function')


  if (!featureFlags.skipAnnounceBetaUI) {
    close = async () => {
      await this.props.dispatch(actions.setFeatureFlag('skipAnnounceBetaUI', true))
    }

    const switchUI = async () => {
      const flag = 'betaUI'
      const enabled = true
      await this.props.dispatch(actions.setFeatureFlag(
        flag,
        enabled,
      ))
      await this.close()
      global.platform.openExtensionInBrowser()
    }

    this.switchUI
  }


  return (
    h('.flex-column.full-height', {
      style: {
        // Windows was showing a vertical scroll bar:
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
      },
    }, [
      h(AppBar, {
        ...this.props,
      }),
    ])
  )
}
App.prototype.renderLoadingIndicator = function ({ isLoading, isLoadingNetwork, loadMessage }) {
  const { isMascara } = this.props

  return isMascara
    ? null
    : h(Loading, {
      isLoading: isLoading || isLoadingNetwork,
      loadingMessage: loadMessage,
    })
}

App.prototype.renderPrimary = function () {
  log.debug('rendering primary')
  return null
}

App.prototype.toggleMetamaskActive = function () {
  if (!this.props.isUnlocked) {
    // currently inactive: redirect to password box
    var passwordBox = document.querySelector('input[type=password]')
    if (!passwordBox) return
    passwordBox.focus()
  } else {
    // currently active: deactivate
    this.props.dispatch(actions.lockMetamask(false))
  }
}
App.prototype.getNetworkName = function () {
  const { provider } = this.props
  const providerName = provider.type

  let name

  if (providerName === 'mainnet') {
    name = 'Main Ethereum Network'
  } else if (providerName === 'ropsten') {
    name = 'Ropsten Test Network'
  } else if (providerName === 'kovan') {
    name = 'Kovan Test Network'
  } else if (providerName === 'rinkeby') {
    name = 'Rinkeby Test Network'
  } else {
    name = 'Unknown Private Network'
  }

  return name
}
