const Component = require('react').Component
const { Switch, Route, matchPath, withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const { getNetworkDisplayName } = require('../../../../app/scripts/controllers/network/util')
const { KYC_ROUTE } = require('../../routes')

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => {
      dispatch(actions.hideModal())
    },
    hideWarning: () => {
      dispatch(actions.hideWarning())
    },
  }
}

inherits(HowToKycModal, Component)
function HowToKycModal (props, context) {
  Component.call(this)
}

HowToKycModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = compose(withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(HowToKycModal)

HowToKycModal.prototype.renderRow = function ({
  logo,
  title,
  text,
  buttonLabel,
  onButtonClick,
  hide,
  className,
  hideButton,
  hideTitle,
  onBackClick,
  showBackButton,
}) {
  if (hide) {
    return null
  }

  return h('div', {
      className: className || 'deposit-ether-modal__buy-row',
    }, [

    onBackClick && showBackButton && h('div.deposit-ether-modal__buy-row__back', {
      onClick: onBackClick,
    }, [

      h('i.fa.fa-arrow-left.cursor-pointer'),

    ]),

    h('div.deposit-ether-modal__buy-row__logo-container', [logo]),

      h('div.deposit-ether-modal__buy-row__description', [

        !hideTitle && h('div.deposit-ether-modal__buy-row__description__title', [title]),

        h('div.deposit-ether-modal__buy-row__description__text', [text]),

      ]),

      !hideButton && h('div.deposit-ether-modal__buy-row__button', [
        h('button.btn-primary.btn--large.deposit-ether-modal__deposit-button', {
          onClick: onButtonClick,
        }, [buttonLabel]),
      ]),

  ])
}

HowToKycModal.prototype.render = function () {

  return h('div.page-container.page-container--full-width.page-container--full-height', {}, [

    h('div.page-container__header', [

      h('div.page-container__title', { style: { fontSize: "26px" }}, [this.context.t('howToKycTitle')]),

      h('div.deposit-ether-modal__buy-row__description__text',
        [ this.context.t('howToEarnXCLR'), ]
       ),

      h('div.page-container__header-close', {
        onClick: () => {
          this.props.hideWarning()
          this.props.hideModal()
        },
      }),

    ]),

    h('.page-container__content', {}, [

      h('div.deposit-ether-modal__buy-rows', [

        this.renderRow({
          logo: h('img', {
            src: './images/onfido-logo.png',
            width: "165px",
            height: "40px"
          }),
          title: "Start Your KYC",
          text: this.context.t('describeNeedToKyc'),
          buttonLabel: "Start Your KYC",
          onButtonClick: () => this.goToKycSettingsPage(),
        }),
        
      ]),

    ]),
  ])
}

HowToKycModal.prototype.goToKycSettingsPage = function () {
  this.props.hideWarning()
  this.props.hideModal()
  this.props.history.push(KYC_ROUTE)
}
