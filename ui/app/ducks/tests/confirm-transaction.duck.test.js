import assert from 'assert'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ConfirmTransactionReducer, * as actions from '../confirm-transaction.duck.js'

const initialState = {
  txData: {},
  tokenData: {},
  methodData: {},
  tokenProps: {
    tokenDecimals: '',
    tokenSymbol: '',
  },
  fiatTransactionAmount: '',
  fiatTransactionFee: '',
  fiatTransactionTotal: '',
  ethTransactionAmount: '',
  ethTransactionFee: '',
  ethTransactionTotal: '',
  hexGasTotal: '',
  nonce: '',
  fetchingMethodData: false,
}

const UPDATE_TX_DATA = 'metamask/confirm-transaction/UPDATE_TX_DATA'
const CLEAR_TX_DATA = 'metamask/confirm-transaction/CLEAR_TX_DATA'
const UPDATE_TOKEN_DATA = 'metamask/confirm-transaction/UPDATE_TOKEN_DATA'
const CLEAR_TOKEN_DATA = 'metamask/confirm-transaction/CLEAR_TOKEN_DATA'
const UPDATE_METHOD_DATA = 'metamask/confirm-transaction/UPDATE_METHOD_DATA'
const CLEAR_METHOD_DATA = 'metamask/confirm-transaction/CLEAR_METHOD_DATA'
const UPDATE_TRANSACTION_AMOUNTS = 'metamask/confirm-transaction/UPDATE_TRANSACTION_AMOUNTS'
const UPDATE_TRANSACTION_FEES = 'metamask/confirm-transaction/UPDATE_TRANSACTION_FEES'
const UPDATE_TRANSACTION_TOTALS = 'metamask/confirm-transaction/UPDATE_TRANSACTION_TOTALS'
const UPDATE_HEX_GAS_TOTAL = 'metamask/confirm-transaction/UPDATE_HEX_GAS_TOTAL'
const UPDATE_TOKEN_PROPS = 'metamask/confirm-transaction/UPDATE_TOKEN_PROPS'
const UPDATE_NONCE = 'metamask/confirm-transaction/UPDATE_NONCE'
const FETCH_METHOD_DATA_START = 'metamask/confirm-transaction/FETCH_METHOD_DATA_START'
const FETCH_METHOD_DATA_END = 'metamask/confirm-transaction/FETCH_METHOD_DATA_END'
const CLEAR_CONFIRM_TRANSACTION = 'metamask/confirm-transaction/CLEAR_CONFIRM_TRANSACTION'

describe('Confirm Transaction Duck', () => {
  describe('State changes', () => {
    const mockState = {
      confirmTransaction: {
        txData: {
          id: 1,
        },
        tokenData: {
          name: 'abcToken',
        },
        methodData: {
          name: 'approve',
        },
        tokenProps: {
          tokenDecimals: '3',
          tokenSymbol: 'ABC',
        },
        fiatTransactionAmount: '469.26',
        fiatTransactionFee: '0.01',
        fiatTransactionTotal: '1.000021',
        ethTransactionAmount: '1',
        ethTransactionFee: '0.000021',
        ethTransactionTotal: '469.27',
        hexGasTotal: '0x1319718a5000',
        nonce: '0x0',
        fetchingMethodData: false,
      },
    }

    it('should initialize state', () => {
      assert.deepEqual(
        ConfirmTransactionReducer({}),
        initialState
      )
    })

    it('should return state unchanged if it does not match a dispatched actions type', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: 'someOtherAction',
          value: 'someValue',
        }),
        { ...mockState.confirmTransaction },
      )
    })

    it('should set txData when receiving a UPDATE_TX_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TX_DATA,
          payload: {
            id: 2,
          },
        }),
        {
          ...mockState.confirmTransaction,
          txData: {
            ...mockState.confirmTransaction.txData,
            id: 2,
          },
        }
      )
    })

    it('should clear txData when receiving a CLEAR_TX_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: CLEAR_TX_DATA,
        }),
        {
          ...mockState.confirmTransaction,
          txData: {},
        }
      )
    })

    it('should set tokenData when receiving a UPDATE_TOKEN_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TOKEN_DATA,
          payload: {
            name: 'defToken',
          },
        }),
        {
          ...mockState.confirmTransaction,
          tokenData: {
            ...mockState.confirmTransaction.tokenData,
            name: 'defToken',
          },
        }
      )
    })

    it('should clear tokenData when receiving a CLEAR_TOKEN_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: CLEAR_TOKEN_DATA,
        }),
        {
          ...mockState.confirmTransaction,
          tokenData: {},
        }
      )
    })

    it('should set methodData when receiving a UPDATE_METHOD_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_METHOD_DATA,
          payload: {
            name: 'transferFrom',
          },
        }),
        {
          ...mockState.confirmTransaction,
          methodData: {
            ...mockState.confirmTransaction.methodData,
            name: 'transferFrom',
          },
        }
      )
    })

    it('should clear methodData when receiving a CLEAR_METHOD_DATA action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: CLEAR_METHOD_DATA,
        }),
        {
          ...mockState.confirmTransaction,
          methodData: {},
        }
      )
    })

    it('should update transaction amounts when receiving an UPDATE_TRANSACTION_AMOUNTS action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TRANSACTION_AMOUNTS,
          payload: {
            fiatTransactionAmount: '123.45',
            ethTransactionAmount: '.5',
          },
        }),
        {
          ...mockState.confirmTransaction,
          fiatTransactionAmount: '123.45',
          ethTransactionAmount: '.5',
        }
      )
    })

    it('should update transaction fees when receiving an UPDATE_TRANSACTION_FEES action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TRANSACTION_FEES,
          payload: {
            fiatTransactionFee: '123.45',
            ethTransactionFee: '.5',
          },
        }),
        {
          ...mockState.confirmTransaction,
          fiatTransactionFee: '123.45',
          ethTransactionFee: '.5',
        }
      )
    })

    it('should update transaction totals when receiving an UPDATE_TRANSACTION_TOTALS action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TRANSACTION_TOTALS,
          payload: {
            fiatTransactionTotal: '123.45',
            ethTransactionTotal: '.5',
          },
        }),
        {
          ...mockState.confirmTransaction,
          fiatTransactionTotal: '123.45',
          ethTransactionTotal: '.5',
        }
      )
    })

    it('should update hexGasTotal when receiving an UPDATE_HEX_GAS_TOTAL action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_HEX_GAS_TOTAL,
          payload: '0x0',
        }),
        {
          ...mockState.confirmTransaction,
          hexGasTotal: '0x0',
        }
      )
    })

    it('should update tokenProps when receiving an UPDATE_TOKEN_PROPS action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_TOKEN_PROPS,
          payload: {
            tokenSymbol: 'DEF',
            tokenDecimals: '1',
          },
        }),
        {
          ...mockState.confirmTransaction,
          tokenProps: {
            tokenSymbol: 'DEF',
            tokenDecimals: '1',
          },
        }
      )
    })

    it('should update nonce when receiving an UPDATE_NONCE action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: UPDATE_NONCE,
          payload: '0x1',
        }),
        {
          ...mockState.confirmTransaction,
          nonce: '0x1',
        }
      )
    })

    it('should set fetchingMethodData to true when receiving a FETCH_METHOD_DATA_START action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: FETCH_METHOD_DATA_START,
        }),
        {
          ...mockState.confirmTransaction,
          fetchingMethodData: true,
        }
      )
    })

    it('should set fetchingMethodData to false when receiving a FETCH_METHOD_DATA_END action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer({ confirmTransaction: { fetchingMethodData: true } }, {
          type: FETCH_METHOD_DATA_END,
        }),
        {
          fetchingMethodData: false,
        }
      )
    })

    it('should clear confirmTransaction when receiving a FETCH_METHOD_DATA_END action', () => {
      assert.deepEqual(
        ConfirmTransactionReducer(mockState, {
          type: CLEAR_CONFIRM_TRANSACTION,
        }),
        {
          ...initialState,
        }
      )
    })
  })

  describe('Single actions', () => {
    it('should create an action to update txData', () => {
      const txData = { test: 123 }
      const expectedAction = {
        type: UPDATE_TX_DATA,
        payload: txData,
      }

      assert.deepEqual(
        actions.updateTxData(txData),
        expectedAction
      )
    })

    it('should create an action to clear txData', () => {
      const expectedAction = {
        type: CLEAR_TX_DATA,
      }

      assert.deepEqual(
        actions.clearTxData(),
        expectedAction
      )
    })

    it('should create an action to update tokenData', () => {
      const tokenData = { test: 123 }
      const expectedAction = {
        type: UPDATE_TOKEN_DATA,
        payload: tokenData,
      }

      assert.deepEqual(
        actions.updateTokenData(tokenData),
        expectedAction
      )
    })

    it('should create an action to clear tokenData', () => {
      const expectedAction = {
        type: CLEAR_TOKEN_DATA,
      }

      assert.deepEqual(
        actions.clearTokenData(),
        expectedAction
      )
    })

    it('should create an action to update methodData', () => {
      const methodData = { test: 123 }
      const expectedAction = {
        type: UPDATE_METHOD_DATA,
        payload: methodData,
      }

      assert.deepEqual(
        actions.updateMethodData(methodData),
        expectedAction
      )
    })

    it('should create an action to clear methodData', () => {
      const expectedAction = {
        type: CLEAR_METHOD_DATA,
      }

      assert.deepEqual(
        actions.clearMethodData(),
        expectedAction
      )
    })

    it('should create an action to update transaction amounts', () => {
      const transactionAmounts = { test: 123 }
      const expectedAction = {
        type: UPDATE_TRANSACTION_AMOUNTS,
        payload: transactionAmounts,
      }

      assert.deepEqual(
        actions.updateTransactionAmounts(transactionAmounts),
        expectedAction
      )
    })

    it('should create an action to update transaction fees', () => {
      const transactionFees = { test: 123 }
      const expectedAction = {
        type: UPDATE_TRANSACTION_FEES,
        payload: transactionFees,
      }

      assert.deepEqual(
        actions.updateTransactionFees(transactionFees),
        expectedAction
      )
    })

    it('should create an action to update transaction totals', () => {
      const transactionTotals = { test: 123 }
      const expectedAction = {
        type: UPDATE_TRANSACTION_TOTALS,
        payload: transactionTotals,
      }

      assert.deepEqual(
        actions.updateTransactionTotals(transactionTotals),
        expectedAction
      )
    })

    it('should create an action to update hexGasTotal', () => {
      const hexGasTotal = '0x0'
      const expectedAction = {
        type: UPDATE_HEX_GAS_TOTAL,
        payload: hexGasTotal,
      }

      assert.deepEqual(
        actions.updateHexGasTotal(hexGasTotal),
        expectedAction
      )
    })

    it('should create an action to update tokenProps', () => {
      const tokenProps = {
        tokenDecimals: '1',
        tokenSymbol: 'abc',
      }
      const expectedAction = {
        type: UPDATE_TOKEN_PROPS,
        payload: tokenProps,
      }

      assert.deepEqual(
        actions.updateTokenProps(tokenProps),
        expectedAction
      )
    })

    it('should create an action to update nonce', () => {
      const nonce = '0x1'
      const expectedAction = {
        type: UPDATE_NONCE,
        payload: nonce,
      }

      assert.deepEqual(
        actions.updateNonce(nonce),
        expectedAction
      )
    })

    it('should create an action to set fetchingMethodData to true', () => {
      const expectedAction = {
        type: FETCH_METHOD_DATA_START,
      }

      assert.deepEqual(
        actions.setFetchingMethodData(true),
        expectedAction
      )
    })

    it('should create an action to set fetchingMethodData to false', () => {
      const expectedAction = {
        type: FETCH_METHOD_DATA_END,
      }

      assert.deepEqual(
        actions.setFetchingMethodData(false),
        expectedAction
      )
    })

    it('should create an action to clear confirmTransaction', () => {
      const expectedAction = {
        type: CLEAR_CONFIRM_TRANSACTION,
      }

      assert.deepEqual(
        actions.clearConfirmTransaction(),
        expectedAction
      )
    })
  })

  describe('Thunk actions', done => {
    it('updates txData and gas on an existing transaction in confirmTransaction', () => {
      const mockState = {
        metamask: {
          conversionRate: 468.58,
          currentCurrency: 'usd',
        },
        confirmTransaction: {
          ethTransactionAmount: '1',
          ethTransactionFee: '0.000021',
          ethTransactionTotal: '1.000021',
          fetchingMethodData: false,
          fiatTransactionAmount: '469.26',
          fiatTransactionFee: '0.01',
          fiatTransactionTotal: '469.27',
          hexGasTotal: '0x1319718a5000',
          methodData: {},
          nonce: '',
          tokenData: {},
          tokenProps: {
            tokenDecimals: '',
            tokenSymbol: '',
          },
          txData: {
            estimatedGas: '0x5208',
            gasLimitSpecified: false,
            gasPriceSpecified: false,
            history: [],
            id: 2603411941761054,
            loadingDefaults: false,
            metamaskNetworkId: '3',
            origin: 'faucet.metamask.io',
            simpleSend: true,
            status: 'unapproved',
            time: 1530838113716,
          },
        },
      }

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore(mockState)
      const expectedActions = [
        'metamask/confirm-transaction/UPDATE_TX_DATA',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_AMOUNTS',
        'metamask/confirm-transaction/UPDATE_HEX_GAS_TOTAL',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_FEES',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_TOTALS',
      ]

      store.dispatch(actions.updateGasAndCalculate({ gasLimit: '0x2', gasPrice: '0x25' }))

      const storeActions = store.getActions()
      assert.equal(storeActions.length, expectedActions.length)
      storeActions.forEach((action, index) => assert.equal(action.type, expectedActions[index]))
    })

    it('updates txData and updates gas values in confirmTransaction', () => {
      const txData = {
        estimatedGas: '0x5208',
        gasLimitSpecified: false,
        gasPriceSpecified: false,
        history: [],
        id: 2603411941761054,
        loadingDefaults: false,
        metamaskNetworkId: '3',
        origin: 'faucet.metamask.io',
        simpleSend: true,
        status: 'unapproved',
        time: 1530838113716,
        txParams: {
          from: '0xc5ae6383e126f901dcb06131d97a88745bfa88d6',
          gas: '0x33450',
          gasPrice: '0x2540be400',
          to: '0x81b7e08f65bdf5648606c89998a9cc8164397647',
          value: '0xde0b6b3a7640000',
        },
      }
      const mockState = {
        metamask: {
          conversionRate: 468.58,
          currentCurrency: 'usd',
        },
        confirmTransaction: {
          ethTransactionAmount: '1',
          ethTransactionFee: '0.000021',
          ethTransactionTotal: '1.000021',
          fetchingMethodData: false,
          fiatTransactionAmount: '469.26',
          fiatTransactionFee: '0.01',
          fiatTransactionTotal: '469.27',
          hexGasTotal: '0x1319718a5000',
          methodData: {},
          nonce: '',
          tokenData: {},
          tokenProps: {
            tokenDecimals: '',
            tokenSymbol: '',
          },
          txData: {
            ...txData,
            txParams: {
              ...txData.txParams,
            },
          },
        },
      }

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore(mockState)
      const expectedActions = [
        'metamask/confirm-transaction/UPDATE_TX_DATA',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_AMOUNTS',
        'metamask/confirm-transaction/UPDATE_HEX_GAS_TOTAL',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_FEES',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_TOTALS',
      ]

      store.dispatch(actions.updateTxDataAndCalculate(txData))

      const storeActions = store.getActions()
      assert.equal(storeActions.length, expectedActions.length)
      storeActions.forEach((action, index) => assert.equal(action.type, expectedActions[index]))
    })

    it('updates confirmTransaction transaction', done => {
      const mockState = {
        metamask: {
          conversionRate: 468.58,
          currentCurrency: 'usd',
          network: '3',
          unapprovedTxs: {
            2603411941761054: {
              estimatedGas: '0x5208',
              gasLimitSpecified: false,
              gasPriceSpecified: false,
              history: [],
              id: 2603411941761054,
              loadingDefaults: false,
              metamaskNetworkId: '3',
              origin: 'faucet.metamask.io',
              simpleSend: true,
              status: 'unapproved',
              time: 1530838113716,
              txParams: {
                from: '0xc5ae6383e126f901dcb06131d97a88745bfa88d6',
                gas: '0x33450',
                gasPrice: '0x2540be400',
                to: '0x81b7e08f65bdf5648606c89998a9cc8164397647',
                value: '0xde0b6b3a7640000',
              },
            },
          },
        },
        confirmTransaction: {},
      }

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore(mockState)
      const expectedActions = [
        'metamask/confirm-transaction/UPDATE_TX_DATA',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_AMOUNTS',
        'metamask/confirm-transaction/UPDATE_HEX_GAS_TOTAL',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_FEES',
        'metamask/confirm-transaction/UPDATE_TRANSACTION_TOTALS',
      ]

      store.dispatch(actions.setTransactionToConfirm(2603411941761054))
        .then(() => {
          const storeActions = store.getActions()
          assert.equal(storeActions.length, expectedActions.length)
          storeActions.forEach((action, index) => assert.equal(action.type, expectedActions[index]))
          done()
        })
    })
  })
})
