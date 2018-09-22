import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'

import formStyles from '../styles/form.css'

export default class Login extends React.PureComponent {
  state = {
    email: '',
    password: '',
  }

  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
  }

  _handleEmailChange = (value) => {
    this.setState({ email: value })
  }

  _handlePasswordChange = (value) => {
    this.setState({ password: value })
  }

  _handleLoginLink = (e) => {
    e.preventDefault()

    this.context.apiManager.login(this.state)

    if (this.props.afterLoginRequest) {
      this.props.afterLoginRequest()
    }
  }

  render() {
    return (
      <div className='login'>
        <form className={formStyles.form}>
          <Input
            id='email'
            label='Email'
            type='email'
            className={formStyles.input}
            onChange={this._handleEmailChange}
            value={this.state.email}
          />
          <Input
            type='password'
            id='Password'
            className={formStyles.input}
            label='Password'
            onChange={this._handlePasswordChange}
            value={this.state.password}
          />
          <Button
            raised
            primary
            onClick={this._handleLoginLink}
          >
            Login
          </Button>
        </form>
      </div>
    )
  }
}
