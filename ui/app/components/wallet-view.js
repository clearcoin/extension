const Component = require('react').Component
const PropTypes = require('prop-types')
const connect = require('react-redux').connect
const h = require('react-hyperscript')
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const inherits = require('util').inherits
const classnames = require('classnames')
const { checksumAddress } = require('../util')
const Identicon = require('./identicon')
// const AccountDropdowns = require('./dropdowns/index.js').AccountDropdowns
const Tooltip = require('./tooltip-v2.js')
const copyToClipboard = require('copy-to-clipboard')
const actions = require('../actions')
const BalanceComponent = require('./balance-component')
const TokenList = require('./token-list')
const selectors = require('../selectors')
const {
  DEFAULT_ROUTE,
  SETTINGS_ROUTE,
  ADD_TOKEN_ROUTE
} = require('../routes')

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(WalletView)

WalletView.contextTypes = {
  t: PropTypes.func,
}

function mapStateToProps (state) {

  return {
    network: state.metamask.network,
    sidebarOpen: state.appState.sidebarOpen,
    identities: state.metamask.identities,
    accounts: state.metamask.accounts,
    tokens: state.metamask.tokens,
    keyrings: state.metamask.keyrings,
    selectedAddress: selectors.getSelectedAddress(state),
    selectedAccount: selectors.getSelectedAccount(state),
    selectedTokenAddress: state.metamask.selectedTokenAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    checkKYC: () => dispatch(actions.checkKYC()),
    showSendPage: () => dispatch(actions.showSendPage()),
    hideSidebar: () => dispatch(actions.hideSidebar()),
    unsetSelectedToken: () => dispatch(actions.setSelectedToken()),
    showAccountDetailModal: () => {
      dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
    },
    lockMetamask: () => {
      dispatch(actions.lockMetamask())
      dispatch(actions.hideWarning())
      dispatch(actions.hideSidebar())
    },
    showAddTokenPage: () => dispatch(actions.showAddTokenPage()),
  }
}

inherits(WalletView, Component)
function WalletView () {
  Component.call(this)
  this.state = {
    hasCopied: false,
    copyToClipboardPressed: false,
  }
}

WalletView.prototype.componentWillMount = function() {
  const { checkKYC } = this.props
  // Always must check KYC for rejection
  checkKYC()
}

WalletView.prototype.renderWalletBalance = function () {
  const {
    selectedTokenAddress,
    selectedAccount,
    unsetSelectedToken,
    hideSidebar,
    sidebarOpen,
  } = this.props

  const selectedClass = selectedTokenAddress
    ? ''
    : 'wallet-balance-wrapper--active'
  const className = `flex-column wallet-balance-wrapper ${selectedClass}`

  return h('div', { className }, [
    h('div.wallet-balance',
      {
        onClick: () => {
          unsetSelectedToken()
          selectedTokenAddress && sidebarOpen && hideSidebar()
        },
      },
      [
        h(BalanceComponent, {
          balanceValue: selectedAccount ? selectedAccount.balance : '',
          style: {},
        }),
      ]
    ),
  ])
}

WalletView.prototype.render = function () {
  const {
    responsiveDisplayClassname,
    selectedAddress,
    keyrings,
    checkKYC,
    showAccountDetailModal,
    lockMetamask,
    sidebarOpen,
    hideSidebar,
    history,
    identities,
  } = this.props

  const checksummedAddress = checksumAddress(selectedAddress)

  if (!selectedAddress) {
    throw new Error('selectedAddress should not be ' + String(selectedAddress))
  }

  const keyring = keyrings.find((kr) => {
    return kr.accounts.includes(selectedAddress)
  })

  const type = keyring.type
  const isLoose = type !== 'HD Key Tree'

  return h('div.wallet-view.flex-column' + (responsiveDisplayClassname || ''), {
    style: {},
  }, [

    // TODO: Separate component: wallet account details
    h('div.flex-column.wallet-view-account-details', {
      style: {},
    }, [
      h('div.wallet-view__sidebar-close', {
        onClick: hideSidebar,
      }),

      h('div.wallet-view__keyring-label.allcaps', isLoose ? this.context.t('imported') : ''),

      h('div.flex-column.flex-center.wallet-view__name-container',
        { style: { margin: '0 auto' } },
        [
          h('img', {
            src: "/images/logo-text.png",
            style: {
              margin: '-14px 0 21px 0',
              width: '133px'
            }
          }),

          h(Tooltip, {
            position: 'bottom',
            title: this.state.hasCopied ? this.context.t('copiedExclamation') : this.context.t('copyToClipboard'),
          }, [
            h('button.wallet-view__address', {
              className: classnames({
                'wallet-view__address__pressed': this.state.copyToClipboardPressed,
              }),
              onClick: () => {
                copyToClipboard(checksummedAddress)
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
              `${checksummedAddress.slice(0, 6)}...${checksummedAddress.slice(-4)}`,
              h('i.fa.fa-clipboard', { style: { marginLeft: '8px' } }),
            ]),
          ]),
          
          h('div.flex-row.flex-center', { style: { margin: '18px 0 18px 0' } },
            [
              h('button.btn-clear.wallet-view__details-button.allcaps',
                { style: { margin: '0 8px 0 0' },
                  onClick: () => {
                    history.push(SETTINGS_ROUTE);
                    sidebarOpen && hideSidebar();
                  },
                },
                this.context.t('settings')),
              h('button.btn-clear.wallet-view__details-button.allcaps', {
                onClick: () => {
                  lockMetamask();
                  history.push(DEFAULT_ROUTE);
                }
              }, this.context.t('logout')),]),
        ]),
    ]),

    h(TokenList),
    this.renderWalletBalance(),

    // hide ability to add token
    // h('button.btn-primary.wallet-view__add-token-button', {
    //   onClick: () => {
    //     history.push(ADD_TOKEN_ROUTE)
    //     sidebarOpen && hideSidebar()
    //   },
    // }, this.context.t('addToken')),
  ])
}
