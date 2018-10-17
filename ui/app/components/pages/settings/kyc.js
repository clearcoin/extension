import React, { Component } from 'react'
const { connect } = require('react-redux')
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
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
    let firstNameField = document.getElementById('firstname-field')
    let firstname = firstNameField.value

    let lastNameField = document.getElementById('lastname-field')
    let lastname = lastNameField.value

    let emailField = document.getElementById('email-field')
    let email = emailField.value
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
          onChange={event => this. handleLastNameChange(event.target.value)}
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
          onClick={this.submitKYCForm}>
            Submit
        </button>
    </div>
    )}

  renderKYCInfo() {
    const { isKYCApproved, isKYCUnapproved } = this.props

    let statusMsg

    if (!isKYCApproved && !isKYCUnapproved) {
      statusMsg = <p className="settings__field-subtitle">Current Status: Pending</p>
    }
    else if (isKYCApproved) {
      statusMsg = <p className="settings__field-subtitle">Current Status: Approved</p>
    }
    else if (isKYCUnapproved) {
      statusMsg = <p className="settings__field-subtitle">Current Status: Unapproved</p>
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
          {statusMsg}
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
  connect(mapStateToProps)
)(Kyc)
