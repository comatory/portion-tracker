import React from 'react'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'

import PortionList from './portion-list'

export default class PortionContainer extends React.PureComponent {
  static contextTypes = {
    activityStore: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    uiStore: PropTypes.object.isRequired,
  }

  state = this._getPortionState()

  componentWillMount() {
    this.context.activityStore.listen(this._handleActivityStoreChange)
    this.context.userStore.listen(this._handleActivityStoreChange)
  }

  componentWillUnmount() {
    this.context.activityStore.unlisten(this._handleActivityStoreChange)
    this.context.userStore.unlisten(this._handleActivityStoreChange)
  }

  _handleActivityStoreChange = () => {
    this.setState(this._getPortionState())
  }


  _getPortionState() {
    const userActivitesPortions = this.context.activityStore.getUserActivitiesPortions(this.props.filter)

    return {
      portions: userActivitesPortions,
    }
  }

  _handlePageChange = (pageNumber) => {
    const nextPage = pageNumber.selected

    if (!Number.isFinite(nextPage)) {
      return
    }

    this.props.onPageChange(nextPage + 1)
  }

  render() {
    return (
      <div className='activity-container'>
        <PortionList
          showPagination={this.props.showPagination}
          portions={this.state.portions}
          filter={this.props.filter}
          onPageChange={this._handlePageChange}
        />
      </div>
    )
  }
}
