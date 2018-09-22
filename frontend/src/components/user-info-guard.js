import React from 'react'
import PropTypes from 'prop-types'

export default class UserInfoGuard extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.userInfo !== this.props.userInfo) && nextProps.userInfo) {
      this._loadRequiredAppData(nextProps.userInfo)
    }
  }

  _loadRequiredAppData(userInfo) {
    this.context.apiManager.loadRequiredAppData(userInfo)
  }

  render() {
    return (
      <div className='user-info-guard'>
        { this.props.children }
      </div>
    )
  }
}
