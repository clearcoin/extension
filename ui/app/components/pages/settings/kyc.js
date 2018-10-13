import React, { Component } from 'react'
const PropTypes = require('prop-types')
const h = require('react-hyperscript')

import TextField from '../../text-field'

class Kyc extends Component {
  constructor (props) {
    super(props)
  }

  state = {
    firstname: '',
    lastname: '',
    email: ''
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
          onClick={submitKYCForm}>
            Submit
        </button>
    </div>
    )}

  render () {
    return (
      h('div.settings__content', [
        this.renderKYCInput(),
      ])
    )}
}

Kyc.propTypes = {
  tab: PropTypes.string,
  metamask: PropTypes.object,
  setCurrentCurrency: PropTypes.func,
  setRpcTarget: PropTypes.func,
  displayWarning: PropTypes.func,
  revealSeedConfirmation: PropTypes.func,
  warning: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  t: PropTypes.func,
}

Kyc.contextTypes = {
  t: PropTypes.func,
}

module.exports = Kyc 
