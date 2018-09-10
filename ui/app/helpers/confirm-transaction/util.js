import currencyFormatter from 'currency-formatter'
import currencies from 'currency-formatter/currencies'
import abi from 'human-standard-token-abi'
import abiDecoder from 'abi-decoder'
import ethUtil from 'ethereumjs-util'
import BigNumber from 'bignumber.js'

abiDecoder.addABI(abi)

import MethodRegistry from 'eth-method-registry'
const registry = new MethodRegistry({ provider: global.ethereumProvider })

import {
  conversionUtil,
  addCurrencies,
  multiplyCurrencies,
  conversionGreaterThan,
} from '../../conversion-util'

import { unconfirmedTransactionsCountSelector } from '../../selectors/confirm-transaction'

export function getTokenData (data = {}) {
  return abiDecoder.decodeMethod(data)
}

export async function getMethodData (data = {}) {
  const prefixedData = ethUtil.addHexPrefix(data)
  const fourBytePrefix = prefixedData.slice(0, 10)
  const sig = await registry.lookup(fourBytePrefix)
  const parsedResult = registry.parse(sig)

  return {
    name: parsedResult.name,
    params: parsedResult.args,
  }
}

export function increaseLastGasPrice (lastGasPrice) {
  return ethUtil.addHexPrefix(multiplyCurrencies(lastGasPrice, 1.1, {
    multiplicandBase: 16,
    multiplierBase: 10,
    toNumericBase: 'hex',
  }))
}

export function hexGreaterThan (a, b) {
  return conversionGreaterThan(
    { value: a, fromNumericBase: 'hex' },
    { value: b, fromNumericBase: 'hex' },
  )
}

export function getHexGasTotal ({ gasLimit, gasPrice }) {
  return ethUtil.addHexPrefix(multiplyCurrencies(gasLimit, gasPrice, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 16,
  }))
}

export function addEth (...args) {
  return args.reduce((acc, base) => {
    return addCurrencies(acc, base, {
      toNumericBase: 'dec',
      numberOfDecimals: 6,
    })
  })
}

export function addFiat (...args) {
  return args.reduce((acc, base) => {
    return addCurrencies(acc, base, {
      toNumericBase: 'dec',
      numberOfDecimals: 2,
    })
  })
}

export function getTransactionAmount ({
  value,
  toCurrency,
  conversionRate,
  numberOfDecimals,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromCurrency: 'ETH',
    toCurrency,
    numberOfDecimals,
    fromDenomination: 'WEI',
    conversionRate,
  })
}

export function getTransactionFee ({
  value,
  toCurrency,
  conversionRate,
  numberOfDecimals,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'BN',
    toNumericBase: 'dec',
    fromDenomination: 'WEI',
    fromCurrency: 'ETH',
    toCurrency,
    numberOfDecimals,
    conversionRate,
  })
}

export function formatCurrency (value, currencyCode) {
  const upperCaseCurrencyCode = currencyCode.toUpperCase()

  return currencies.find(currency => currency.code === upperCaseCurrencyCode)
    ? currencyFormatter.format(Number(value), { code: upperCaseCurrencyCode })
    : value
}

export function convertTokenToFiat ({
  value,
  toCurrency,
  conversionRate,
  contractExchangeRate,
}) {
  const totalExchangeRate = conversionRate * contractExchangeRate

  return conversionUtil(value, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    toCurrency,
    numberOfDecimals: 2,
    conversionRate: totalExchangeRate,
  })
}

export function hasUnconfirmedTransactions (state) {
  return unconfirmedTransactionsCountSelector(state) > 0
}

export function roundExponential (value) {
  const PRECISION = 4
  const bigNumberValue = new BigNumber(String(value))

  // In JS, numbers with exponentials greater than 20 get displayed as an exponential.
  return bigNumberValue.e > 20 ? Number(bigNumberValue.toPrecision(PRECISION)) : value
}
