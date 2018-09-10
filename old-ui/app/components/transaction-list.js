const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits

const TransactionListItem = require('./transaction-list-item')

module.exports = TransactionList


inherits(TransactionList, Component)
function TransactionList () {
  Component.call(this)
}

TransactionList.prototype.render = function () {
  const { transactions, network, unapprovedMsgs, conversionRate } = this.props

  var shapeShiftTxList
  if (network === '1') {
    shapeShiftTxList = this.props.shapeShiftTxList
  }
  const txsToRender = !shapeShiftTxList ? transactions.concat(unapprovedMsgs) : transactions.concat(unapprovedMsgs, shapeShiftTxList)
  .sort((a, b) => b.time - a.time)

  return (

    h('section.transaction-list.full-flex-height', {
      style: {
        justifyContent: 'center',
      },
    }, [

      h('style', `
        .transaction-list .transaction-list-item:not(:last-of-type) {
          border-bottom: 1px solid #D4D4D4;
        }
        .transaction-list .transaction-list-item .ether-balance-label {
          display: block !important;
          font-size: small;
        }
      `),

      h('.tx-list', {
        style: {
          overflowY: 'auto',
          height: '100%',
          padding: '0 25px 0 15px',
          textAlign: 'center',
        },
      }, [

        txsToRender.length
          ? txsToRender.map((transaction, i) => {
            let key
            switch (transaction.key) {
              case 'shapeshift':
                const { depositAddress, time } = transaction
                key = `shift-tx-${depositAddress}-${time}-${i}`
                break
              default:
                key = `tx-${transaction.id}-${i}`
            }
            return h(TransactionListItem, {
              transaction, i, network, key,
              conversionRate, transactions,
              showTx: (txId) => {
                this.props.viewPendingTx(txId)
              },
            })
          })
        : h('.flex-center.full-flex-height', {
          style: {
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }, [
          h('p', {
            style: {
              marginTop: '50px',
            },
          }, 'No transaction history.'),
        ]),
      ]),
    ])
  )
}

