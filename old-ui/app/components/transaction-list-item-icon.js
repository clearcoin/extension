const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Tooltip = require('./tooltip')

const Identicon = require('./identicon')

module.exports = TransactionIcon

inherits(TransactionIcon, Component)
function TransactionIcon () {
  Component.call(this)
}

TransactionIcon.prototype.render = function () {
  const { transaction, txParams, isMsg } = this.props
  switch (transaction.status) {
    case 'unapproved':
      return h(!isMsg ? '.unapproved-tx-icon' : 'i.fa.fa-certificate.fa-lg')

    case 'rejected':
      return h('i.fa.fa-exclamation-triangle.fa-lg.warning', {
        style: {
          width: '24px',
        },
      })

    case 'failed':
      return h('i.fa.fa-exclamation-triangle.fa-lg.error', {
        style: {
          width: '24px',
        },
      })

    case 'submitted':
      return h(Tooltip, {
        title: 'Pending',
        position: 'right',
      }, [
        h('i.fa.fa-ellipsis-h', {
          style: {
            fontSize: '27px',
          },
        }),
      ])
  }

  if (isMsg) {
    return h('i.fa.fa-certificate.fa-lg', {
      style: {
        width: '24px',
      },
    })
  }

  if (txParams.to) {
    return h(Identicon, {
      diameter: 24,
      address: txParams.to || transaction.hash,
    })
  } else {
    return h('i.fa.fa-file-text-o.fa-lg', {
      style: {
        width: '24px',
      },
    })
  }
}
