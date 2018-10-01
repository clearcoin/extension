import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AccountListItem from '../send/account-list-item/account-list-item.component'


export default class ToAutoComplete extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    to: PropTypes.string,
    inError: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    const {
      to,
      dropdownOpen,
      onChange,
      inError,
    } = this.props

    return (
      <div className={'send-v2__to-autocomplete'}>
        <input
          className={classnames('send-v2__to-autocomplete__input', {
            'send-v2__error-border': inError,
          })}
          placeholder={this.context.t('recipientAddress')}
          value={to}
          onChange={event => onChange(event.target.value)}
          style={{
            borderColor: inError ? 'red' : null,
          }}
        />
      </div>
    )
  }

}
