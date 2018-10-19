import React, { Component } from 'react'
const { connect } = require('react-redux')
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const actions = require('../../../actions')
const PropTypes = require('prop-types')
const h = require('react-hyperscript')

import TextField from '../../text-field'

class Kyc extends Component {
  constructor (props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
    }
  }

  handleFirstNameChange(firstname){
    this.setState({ firstname })
  }

  handleLastNameChange(lastname){
    this.setState({ lastname })
  }

  handleEmailChange(email){
    this.setState({ email })
  }

  isValid () {
    const { firstname, lastname, email } = this.state

    if (!firstname || !lastname || !email) {
      return false
    }

    return true 
  }


  submitKYCForm(){
    const { submitKYC } = this.props
    let firstname = this.state.firstname
    let lastname = this.state.lastname
    let email = this.state.email

    submitKYC()
  }


  renderKYCInput(){
    return(
      <div className="settings__kyc-container">
        <div className="settings__field-title">
          KYC Registration 
        </div>
        <div className="settings__field-subtitle">
          Please fill out the following form to begin the KYC process.
        </div>
        <TextField
          id="firstname-field"
          label={'Firstname:'}
          type="text"
          className="settings__field-input"
          value={this.state.firstname}
          onChange={event => this.handleFirstNameChange(event.target.value)}
          margin="normal"
          fullWidth
          largeLabel
        />
        <TextField
          id="lastname-field"
          label={'Lastname:'}
          type="text"
          className="settings__field-input"
          value={this.state.lastname}
          onChange={event => this.handleLastNameChange(event.target.value)}
          margin="normal"
          fullWidth
          largeLabel
        />
        <TextField
          id="email-field"
          label={'Email:'}
          type="text"
          className="settings__field-input"
          value={this.state.email}
          onChange={event => this.handleEmailChange(event.target.value)}
          margin="normal"
          fullWidth
          largeLabel
        />
        <button
          className="settings__kyc--button"
          disabled={!this.isValid()}
          onClick={event => this.submitKYCForm()}>
            Submit
        </button>
    </div>
    )}

  renderKYCInfo() {
    const { isKYCApproved, isKYCUnapproved } = this.props

    let statusMsg

    let styleSheet

    if (!isKYCApproved && !isKYCUnapproved) {
      statusMsg = <p className="settings__field-subtitle">Current Status: Pending</p>
    }
    else if (isKYCApproved) {
      styleSheet = { color: '#00e639' }
      statusMsg = <tr>
        <td>
          <p className="settings__field-subtitle">Current Status:&#160;</p>
        </td>
        <td>
          <div  className="settings__field-subtitle" style={styleSheet}>Approved</div>
        </td>
      </tr>
    }
    else if (isKYCUnapproved) {
      styleSheet = { color: '#e60000' }
      statusMsg = <tr>
        <td>
          <p className="settings__field-subtitle">Current Status:&#160;</p>
        </td>
        <td>
          <div  className="settings__field-subtitle" style={styleSheet}>Unapproved</div>
        </td>
      </tr>
    }

    return (
      <div className="settings__kyc-container">
        <div className="settings__field-title">
          KYC Registration
        </div>
        <div className="settings__field-subtitle">
          <p className="settings__field-subtitle">
            Thank you for beginning your KYC application. An email from Onfido will
            arrive in your inbox shortly detailing steps on how to continue.
          </p>
          <p className="settings__field-subtitle">
            Upon completion, please allow 3-4 business days for your application to be processed.
            Please note that if you already have an approved application on file, you will be
            automatically approved.
          </p>
          <table>
            {statusMsg}
          </table>
        </div>
      </div>
    )
  }

  render () {
    const { isKYCSubmitted, isKYCApproved, isKYCUnapproved } = this.props
    if (isKYCSubmitted) {
      return (
        h('div.settings__content', [
          this.renderKYCInfo()
        ])
      )
    }
    else {
      return (
        h('div.settings__content', [
          this.renderKYCInput()
        ])
      )
    }
  }
}

Kyc.propTypes = {
  updateMetamaskState: PropTypes.func,
  isKYCApproved: PropTypes.bool,
  isKYCUnapproved: PropTypes.bool,
  isKYCSubmitted: PropTypes.bool,
  t: PropTypes.func,
}

const mapDispatchToProps = dispatch => {
  return {
    submitKYC: () => dispatch(actions.submitKYC()),
    approveKYC: () => dispatch(actions.approveKYC()),
    unapproveKYC: () => dispatch(actions.unapproveKYC()),
  }
}


const mapStateToProps = state => {
  return {
    isKYCSubmitted: state.metamask.isKYCSubmitted,
    isKYCApproved: state.metamask.isKYCApproved,
    isKYCUnapproved: state.metamask.isKYCUnapproved, 
  }
}

Kyc.contextTypes = {
  t: PropTypes.func,
}

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Kyc)
