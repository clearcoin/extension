const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const actions = require('../actions')
const genAccountLink = require('etherscan-link').createAccountLink
const connect = require('react-redux').connect
const Dropdown = require('./dropdown').Dropdown
const DropdownMenuItem = require('./dropdown').DropdownMenuItem
const Identicon = require('./identicon')
const copyToClipboard = require('copy-to-clipboard')
const { checksumAddress } = require('../util')

class AccountDropdowns extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accountSelectorActive: false,
      optionsMenuActive: false,
    }
    this.accountSelectorToggleClassName = 'accounts-selector'
    this.optionsMenuToggleClassName = 'fa-ellipsis-h'
  }

  renderAccounts () {
    const { identities, selected, keyrings } = this.props

    return Object.keys(identities).map((key, index) => {
      const identity = identities[key]
      const isSelected = identity.address === selected

      const simpleAddress = identity.address.substring(2).toLowerCase()

      const keyring = keyrings.find((kr) => {
        return kr.accounts.includes(simpleAddress) ||
          kr.accounts.includes(identity.address)
      })

      return h(
        DropdownMenuItem,
        {
          closeMenu: () => {},
          onClick: () => {
            this.props.actions.showAccountDetail(identity.address)
          },
          style: {
            marginTop: index === 0 ? '5px' : '',
            fontSize: '24px',
          },
        },
        [
          h(
            Identicon,
            {
              address: identity.address,
              diameter: 32,
              style: {
                marginLeft: '10px',
              },
            },
          ),
          this.indicateIfLoose(keyring),
          h('span', {
            style: {
              marginLeft: '20px',
              fontSize: '24px',
              maxWidth: '145px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }, identity.name || ''),
          h('span', { style: { marginLeft: '20px', fontSize: '24px' } }, isSelected ? h('.check', '✓') : null),
        ]
      )
    })
  }

  indicateIfLoose (keyring) {
    try { // Sometimes keyrings aren't loaded yet:
      const type = keyring.type
      const isLoose = type !== 'HD Key Tree'
      return isLoose ? h('.keyring-label.allcaps', this.context.t('loose')) : null
    } catch (e) { return }
  }

  renderAccountSelector () {
    const { actions } = this.props
    const { accountSelectorActive } = this.state

    return h(
      Dropdown,
      {
        useCssTransition: true, // Hardcoded because account selector is temporarily in app-header
        style: {
          marginLeft: '-238px',
          marginTop: '38px',
          minWidth: '180px',
          overflowY: 'auto',
          maxHeight: '300px',
          width: '300px',
        },
        innerStyle: {
          padding: '8px 25px',
        },
        isOpen: accountSelectorActive,
        onClickOutside: (event) => {
          const { classList } = event.target
          const isNotToggleElement = !classList.contains(this.accountSelectorToggleClassName)
          if (accountSelectorActive && isNotToggleElement) {
            this.setState({ accountSelectorActive: false })
          }
        },
      },
      [
        ...this.renderAccounts(),
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => actions.addNewAccount(),
          },
          [
            h(
              Identicon,
              {
                style: {
                  marginLeft: '10px',
                },
                diameter: 32,
              },
            ),
            h('span', { style: { marginLeft: '20px', fontSize: '24px' } }, this.context.t('createAccount')),
          ],
        ),
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => actions.showImportPage(),
          },
          [
            h(
              Identicon,
              {
                style: {
                  marginLeft: '10px',
                },
                diameter: 32,
              },
            ),
            h('span', {
              style: {
                marginLeft: '20px',
                fontSize: '24px',
                marginBottom: '5px',
              },
            }, this.context.t('importAccount')),
          ]
        ),
      ]
    )
  }

  renderAccountOptions () {
    const { actions } = this.props
    const { optionsMenuActive } = this.state

    return h(
      Dropdown,
      {
        style: {
          marginLeft: '-215px',
          minWidth: '180px',
        },
        isOpen: optionsMenuActive,
        onClickOutside: (event) => {
          const { classList } = event.target
          const isNotToggleElement = !classList.contains(this.optionsMenuToggleClassName)
          if (optionsMenuActive && isNotToggleElement) {
            this.setState({ optionsMenuActive: false })
          }
        },
      },
      [
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => {
              const { selected, network } = this.props
              const url = genAccountLink(selected, network)
              global.platform.openWindow({ url })
            },
          },
          this.context.t('etherscanView'),
        ),
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => {
              const { selected, identities } = this.props
              var identity = identities[selected]
              actions.showQrView(selected, identity ? identity.name : '')
            },
          },
          this.context.t('showQRCode'),
        ),
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => {
              const { selected } = this.props
              copyToClipboard(checksumAddress(selected))
            },
          },
          this.context.t('copyAddress'),
        ),
        h(
          DropdownMenuItem,
          {
            closeMenu: () => {},
            onClick: () => {
              actions.requestAccountExport()
            },
          },
          this.context.t('exportPrivateKey'),
        ),
      ]
    )
  }

  render () {
    const { style, enableAccountsSelector, enableAccountOptions } = this.props
    const { optionsMenuActive, accountSelectorActive } = this.state

    return h(
      'span',
      {
        style: style,
      },
      [
        enableAccountsSelector && h(
          // 'i.fa.fa-angle-down',
          'div.cursor-pointer.color-orange.accounts-selector',
          {
            style: {
              // fontSize: '1.8em',
              background: 'url(images/switch_acc.svg) white center center no-repeat',
              height: '25px',
              width: '25px',
              transform: 'scale(0.75)',
              marginRight: '3px',
            },
            onClick: (event) => {
              event.stopPropagation()
              this.setState({
                accountSelectorActive: !accountSelectorActive,
                optionsMenuActive: false,
              })
            },
          },
          this.renderAccountSelector(),
        ),
        enableAccountOptions && h(
          'i.fa.fa-ellipsis-h',
          {
            style: {
              marginRight: '0.5em',
              fontSize: '1.8em',
            },
            onClick: (event) => {
              event.stopPropagation()
              this.setState({
                accountSelectorActive: false,
                optionsMenuActive: !optionsMenuActive,
              })
            },
          },
          this.renderAccountOptions()
        ),
      ]
    )
  }
}

AccountDropdowns.defaultProps = {
  enableAccountsSelector: false,
  enableAccountOptions: false,
}

AccountDropdowns.propTypes = {
  identities: PropTypes.objectOf(PropTypes.object),
  selected: PropTypes.string,
  keyrings: PropTypes.array,
  actions: PropTypes.objectOf(PropTypes.func),
  network: PropTypes.string,
  style: PropTypes.object,
  enableAccountOptions: PropTypes.bool,
  enableAccountsSelector: PropTypes.bool,
    t: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      showConfigPage: () => dispatch(actions.showConfigPage()),
      requestAccountExport: () => dispatch(actions.requestExportAccount()),
      showAccountDetail: (address) => dispatch(actions.showAccountDetail(address)),
      addNewAccount: () => dispatch(actions.addNewAccount()),
      showImportPage: () => dispatch(actions.showImportPage()),
      showQrView: (selected, identity) => dispatch(actions.showQrView(selected, identity)),
    },
  }
}

AccountDropdowns.contextTypes = {
  t: PropTypes.func,
}

module.exports = {
  AccountDropdowns: connect(null, mapDispatchToProps)(AccountDropdowns),
}
