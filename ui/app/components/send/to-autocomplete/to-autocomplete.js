const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const AccountListItem = require('../account-list-item/account-list-item.component').default
const connect = require('react-redux').connect
const Tooltip = require('../../tooltip')

ToAutoComplete.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect()(ToAutoComplete)


inherits(ToAutoComplete, Component)
function ToAutoComplete () {
  Component.call(this)

  this.state = { accountsToRender: [] }
}

ToAutoComplete.prototype.getListItemIcon = function (listItemAddress, toAddress) {
  const listItemIcon = h(`i.fa.fa-check.fa-lg`, { style: { color: '#02c9b1' } })

  return toAddress && listItemAddress === toAddress
    ? listItemIcon
    : null
}

ToAutoComplete.prototype.renderDropdown = function () {
  const {
    closeDropdown,
    onChange,
    to,
  } = this.props
  const { accountsToRender } = this.state

  return accountsToRender.length && h('div', {}, [

    h('div.send-v2__from-dropdown__close-area', {
      onClick: closeDropdown,
    }),

    h('div.send-v2__from-dropdown__list', {}, [

      ...accountsToRender.map(account => h(AccountListItem, {
        account,
        className: 'account-list-item__dropdown',
        handleClick: () => {
          onChange(account.address)
          closeDropdown()
        },
        icon: this.getListItemIcon(account.address, to),
        displayBalance: false,
        displayAddress: true,
      })),

    ]),

  ])
}

ToAutoComplete.prototype.handleInputEvent = function (event = {}, cb) {
  const {
    to,
    accounts,
    closeDropdown,
    openDropdown,
  } = this.props

  const matchingAccounts = accounts.filter(({ address }) => address.match(to || ''))
  const matches = matchingAccounts.length

  if (!matches || matchingAccounts[0].address === to) {
    this.setState({ accountsToRender: [] })
    event.target && event.target.select()
    closeDropdown()
  } else {
    this.setState({ accountsToRender: matchingAccounts })
    openDropdown()
  }
  cb && cb(event.target.value)
}

ToAutoComplete.prototype.componentDidUpdate = function (nextProps, nextState) {
  if (this.props.to !== nextProps.to) {
    this.handleInputEvent()
  }
}

ToAutoComplete.prototype.render = function () {
  const {
    to,
    dropdownOpen,
    onChange,
    inError,
    qrScanner,
  } = this.props

  return h('div.send-v2__to-autocomplete', {}, [

    h(`input.send-v2__to-autocomplete__input${qrScanner ? '.with-qr' : ''}`, {
      placeholder: this.context.t('recipientAddress'),
      className: inError ? `send-v2__error-border` : '',
      value: to,
      onChange: event => onChange(event.target.value),
      onFocus: event => this.handleInputEvent(event),
      style: {
        borderColor: inError ? 'red' : null,
      },
    }),
    qrScanner && h(Tooltip, {
      title: this.context.t('scanQrCode'),
      position: 'bottom',
    }, h(`i.fa.fa-qrcode.fa-lg.send-v2__to-autocomplete__qr-code`, {
      style: { color: '#33333' },
      onClick: () => this.props.scanQrCode(),
    })),
    !to && h(`i.fa.fa-caret-down.fa-lg.send-v2__to-autocomplete__down-caret`, {
      style: { color: '#dedede' },
      onClick: () => this.handleInputEvent(),
    }),

    dropdownOpen && this.renderDropdown(),

  ])
}
