import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'

import { API_IDS } from '../actions/constants'
import formStyles from '../styles/form.css'

export default class Login extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
    requestStore: PropTypes.object.isRequired,
  }

  state = {
    email: '',
    password: '',
    passwordConfirmation: '',
    registerFormVisible: false,
    registrationRequest: null,
  }

  componentDidMount() {
    this.context.requestStore.listen(this._handleRequestStoreChange)
  }

  componenWillUnmount() {
    this.context.requestStore.unlisten(this._handleRequestStoreChange)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.registrationRequest && !this.state.registrationRequest) {
      this.setState({ registerFormVisible: false })
    }
  }

  _handleRequestStoreChange = () => {
    this.setState(this._getRequestState())
  }

  _getRequestState() {
    const registrationRequest = this.context.requestStore.getRequest(API_IDS.REGISTER_IDS.REGISTER_IDS_REGISTER)

    return {
      registrationRequest,
    }
  }

  _handleEmailChange = (value) => {
    this.setState({ email: value })
  }

  _handlePasswordChange = (value) => {
    this.setState({ password: value })
  }

  _handlePasswordConfirmationChange = (value) => {
    this.setState({ passwordConfirmation: value })
  }

  _handleLoginLink = (e) => {
    e.preventDefault()

    this.context.apiManager.login(this.state)

    if (this.props.afterLoginRequest) {
      this.props.afterLoginRequest()
    }
  }

  _handleRegistrationLink = (e) => {
    e.preventDefault()

    this.context.apiManager.registerUser(this.state)
  }

  _handleToggleRegisterForm = () => {
    this.setState((prevState) => {
      return {
        registerFormVisible: !prevState.registerFormVisible,
      }
    })
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
          {this.state.registerFormVisible &&
            <Input
              type='password'
              id='PasswordConfirmation'
              className={formStyles.input}
              label='Password confirmation'
              onChange={this._handlePasswordConfirmationChange}
              value={this.state.passwordConfirmation}
            />
          }
          {!this.state.registerFormVisible &&
            <Button
              raised
              primary
              onClick={this._handleLoginLink}
            >
              Login
            </Button>
          }
          {this.state.registerFormVisible &&
            <Button
              raised
              primary
              onClick={this._handleRegistrationLink}
            >
              Submit
            </Button>
          }
          {!this.state.registerFormVisible &&
            <Button
              raised
              onClick={this._handleToggleRegisterForm}
            >
              Register
            </Button>
          }
          {this.state.registerFormVisible &&
            <Button
              raised
              onClick={this._handleToggleRegisterForm}
            >
              Go back
            </Button>
          }
        </form>
      </div>
    )
  }
}
