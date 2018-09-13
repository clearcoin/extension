const PropTypes = require('prop-types')
const {PureComponent} = require('react')
const h = require('react-hyperscript')
const actions = require('../../ui/app/actions')

module.exports = class NewUiAnnouncement extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  close = async () => {
    await this.props.dispatch(actions.setFeatureFlag('skipAnnounceBetaUI', true))
  }

  switchToNewUi = async () => {
    const flag = 'betaUI'
    const enabled = true
    await this.props.dispatch(actions.setFeatureFlag(
      flag,
      enabled,
    ))
    await this.close()
    global.platform.openExtensionInBrowser()
  }

  switchToNewUi
}
