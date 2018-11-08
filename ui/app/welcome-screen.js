import EventEmitter from 'events'
import h from 'react-hyperscript'
import { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {closeWelcomeScreen} from './actions'
import { INITIALIZE_CREATE_PASSWORD_ROUTE } from './routes'

class WelcomeScreen extends Component {
  static propTypes = {
    closeWelcomeScreen: PropTypes.func.isRequired,
    welcomeScreenSeen: PropTypes.bool,
    history: PropTypes.object,
    t: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.animationEventEmitter = new EventEmitter()
  }

  componentWillMount () {
    const { history, welcomeScreenSeen } = this.props

    if (welcomeScreenSeen) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
    }
  }

  initiateAccountCreation = () => {
    this.props.closeWelcomeScreen()
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  render () {
    return h('div.welcome-screen', [

      h('div.welcome-screen__info', [

        h('img.app-header__metafox', {
          src: './images/clearybot.svg',
          style: {
            height: 230,
            marginLeft: -7, // because the SVG is off-center
          },
        }),

        h('img', {
          src: "/images/logo-text.png",
          style: {
            width: 185,
            marginTop: 10,
            marginBottom: 30,
          }
        }),

        h('div.welcome-screen__info__copy', this.context.t('welcomeSubtext')),

        h('button.welcome-screen__button', {
          onClick: this.initiateAccountCreation,
        }, [
          this.context.t('getStarted'),
          h('span',
            {style: {
              fontSize: "0.65em",
              position: "relative",
              top: -2,
              left: 10}},
            "►"
           )
        ]),

      ]),

    ])
  }
}

const mapStateToProps = ({ metamask: { welcomeScreenSeen } }) => {
  return {
    welcomeScreenSeen,
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    dispatch => ({
      closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    })
  )
)(WelcomeScreen)
