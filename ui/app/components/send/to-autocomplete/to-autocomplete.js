const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const Tooltip = require('../../tooltip')

ToAutoComplete.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect()(ToAutoComplete)


inherits(ToAutoComplete, Component)
function ToAutoComplete () {
  Component.call(this)
}

ToAutoComplete.prototype.render = function () {
  const {
    to,
    inError,
    onChange,
    qrScanner,
  } = this.props

  return h('div.send-v2__to-autocomplete', {}, [

    h(`input.send-v2__to-autocomplete__input${qrScanner ? '.with-qr' : ''}`, {
      placeholder: this.context.t('recipientAddress'),
      className: inError ? `send-v2__error-border` : '',
      value: to,
      onChange: event => onChange(event.target.value),
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
  ])
}
