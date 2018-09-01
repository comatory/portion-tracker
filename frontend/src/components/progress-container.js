import React from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import PropTypes from 'prop-types'

import styles from '../styles/progress-container.css'
import theme from '../styles/progress-container-theme.css'

export default class ProgressContainer extends React.PureComponent {
  static contextTypes = {
    requestStore: PropTypes.object.isRequired,
  }

  state = {
    ...this._getRequestState(),
  }

  componentDidMount() {
    this.context.requestStore.listen(this._handleRequestStoreChange)
  }

  componenWillUnmount() {
    this.context.requestStore.unlisten(this._handleRequestStoreChange)
  }


  _handleRequestStoreChange = () => {
    this.setState(this._getRequestState())
  }

  _getRequestState() {
    const isRequestPending = this.context.requestStore.isRequestPending()

    return {
      isRequestPending,
    }
  }

  render() {
    return (
      <div className={styles.progress_container}>
        <div className={styles.progress_bar_wrapper}>
          {this.state.isRequestPending && <ProgressBar
            disabled={!this.props.userInfo}
            theme={theme}
          />}
        </div>
      </div>
    )
  }
}
