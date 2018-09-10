const Component = require('react').Component
const connect = require('react-redux').connect
const h = require('react-hyperscript')
const inherits = require('util').inherits
const TokenBalance = require('./token-balance')
const Identicon = require('./identicon')
const currencyFormatter = require('currency-formatter')
const currencies = require('currency-formatter/currencies')

const { formatBalance, generateBalanceObject } = require('../util')

module.exports = connect(mapStateToProps)(BalanceComponent)

function mapStateToProps (state) {
  const accounts = state.metamask.accounts
  const network = state.metamask.network
  const selectedAddress = state.metamask.selectedAddress || Object.keys(accounts)[0]
  const account = accounts[selectedAddress]

  return {
    account,
    network,
    conversionRate: state.metamask.conversionRate,
    currentCurrency: state.metamask.currentCurrency,
  }
}

inherits(BalanceComponent, Component)
function BalanceComponent () {
  Component.call(this)
}

BalanceComponent.prototype.render = function () {
  const props = this.props
  const { token, network } = props

  return h('div.balance-container', {}, [

    // TODO: balance icon needs to be passed in
    // h('img.balance-icon', {
    //   src: '../images/eth_logo.svg',
    //   style: {},
    // }),
    h(Identicon, {
      diameter: 50,
      address: token && token.address,
      network,
    }),

    token ? this.renderTokenBalance() : this.renderBalance(),
  ])
}

BalanceComponent.prototype.renderTokenBalance = function () {
  const { token } = this.props

  return h('div.flex-column.balance-display', [
    h('div.token-amount', [ h(TokenBalance, { token }) ]),
  ])
}

BalanceComponent.prototype.renderBalance = function () {
  const props = this.props
  const { shorten, account } = props
  const balanceValue = account && account.balance
  const needsParse = 'needsParse' in props ? props.needsParse : true
  const formattedBalance = balanceValue ? formatBalance(balanceValue, 6, needsParse) : '...'
  const showFiat = 'showFiat' in props ? props.showFiat : true

  if (formattedBalance === 'None' || formattedBalance === '...') {
    return h('div.flex-column.balance-display', {}, [
      h('div.token-amount', {
        style: {},
      }, formattedBalance),
    ])
  }

  return h('div.flex-column.balance-display', {}, [
    h('div.token-amount', {
      style: {},
    }, this.getTokenBalance(formattedBalance, shorten)),

    showFiat ? this.renderFiatValue(formattedBalance) : null,
  ])
}

BalanceComponent.prototype.renderFiatValue = function (formattedBalance) {

  const { conversionRate, currentCurrency } = this.props

  const fiatDisplayNumber = this.getFiatDisplayNumber(formattedBalance, conversionRate)

  const fiatPrefix = currentCurrency === 'USD' ? '$' : ''

  return this.renderFiatAmount(fiatDisplayNumber, currentCurrency, fiatPrefix)
}

BalanceComponent.prototype.renderFiatAmount = function (fiatDisplayNumber, fiatSuffix, fiatPrefix) {
  const shouldNotRenderFiat = fiatDisplayNumber === 'N/A' || Number(fiatDisplayNumber) === 0
  if (shouldNotRenderFiat) return null

  const upperCaseFiatSuffix = fiatSuffix.toUpperCase()

  const display = currencies.find(currency => currency.code === upperCaseFiatSuffix)
    ? currencyFormatter.format(Number(fiatDisplayNumber), {
      code: upperCaseFiatSuffix,
    })
    : `${fiatPrefix}${fiatDisplayNumber} ${upperCaseFiatSuffix}`

  return h('div.fiat-amount', {
    style: {},
  }, display)
}

BalanceComponent.prototype.getTokenBalance = function (formattedBalance, shorten) {
  const balanceObj = generateBalanceObject(formattedBalance, shorten ? 1 : 3)

  const balanceValue = shorten ? balanceObj.shortBalance : balanceObj.balance
  const label = balanceObj.label

  return `${balanceValue} ${label}`
}

BalanceComponent.prototype.getFiatDisplayNumber = function (formattedBalance, conversionRate) {
  if (formattedBalance === 'None') return formattedBalance
  if (conversionRate === 0) return 'N/A'

  const splitBalance = formattedBalance.split(' ')

  const convertedNumber = (Number(splitBalance[0]) * conversionRate)
  const wholePart = Math.floor(convertedNumber)
  const decimalPart = convertedNumber - wholePart

  return wholePart + Number(decimalPart.toPrecision(2))
}
