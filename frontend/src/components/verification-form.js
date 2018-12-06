import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Input,
} from 'react-toolbox/lib'

export default class VerificationForm extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
  }

  state = {
    verificationCode: '',
  }

  _onVerificationSubmit = () => {
    this.context.apiManager.verifyUser(this.state)
  }

  _handleVerificationInputChange = (value) => {
    this.setState({
      verificationCode: value,
    })
  }

  render() {
    return (
      <div>
        <p>Please verify your account. Verification code was sent to your email, please put it here:</p>
        <p>
          <Input
            type="text"
            value={this.state.verificationCode}
            onChange={this._handleVerificationInputChange}
          />
          <Button
            primary
            raised
            onClick={this._onVerificationSubmit}
          >
            Submit
          </Button>
        </p>
        <p>Your code did not arrive? <a>Send verification email again</a></p>
      </div>
    )
  }
}
