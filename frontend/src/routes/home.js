import React from 'react'
import PropTypes from 'prop-types'

import ActivityForm from '../components/activity-form'
import PortionContainer from '../components/portion-container'
import { ACTIVITY_IDS_REQUESTS } from '../actions/constants'
import { TableFilter } from '../entities';

export default class Home extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
    requestStore: PropTypes.object.isRequired,
    uiStore: PropTypes.object.isRequired,
  }

  state = this._getState()

  static defaultProps = {
    tableId: 'portions',
    filterId: 'recent-portions'
  }

  componentWillMount() {
    this.context.requestStore.listen(this._handleRequestStoreChange)
    this.context.uiStore.listen(this._handleUiStoreChange)
  }

  componentWillUnmount() {
    this.context.requestStore.unlisten(this._handleRequestStoreChange)
    this.context.uiStore.unlisten(this._handleUiStoreChange)
  }

  componentDidMount() {
    this._fetchUserActivitiesPortions()
  }

  componentWillReceiveProps(nextProps, nextState) {
    if ((this.props.userInfo !== nextProps.userInfo) && !this.state.userActivitiesPortionRequest) {
      this._fetchUserActivitiesPortions()
    }
  }

  _handleRequestStoreChange = () => {
    this.setState(
      {
        ...this._getUserActivitiesPortionRequest(),
        ...this._getCreateNewActivityRequest(),
      }
    )
  }

  _handleUiStoreChange = () => {
    this.setState(this._getFilter())
  }

  _handlePageChange = (pageNumber) => {
    this._fetchUserActivitiesPortions(pageNumber)
  }

  _getState() {
    return {
      ...this._getUserActivitiesPortionRequest(),
      ...this._getFilter()
    }
  }

  _getUserActivitiesPortionRequest() {
    const userActivitiesPortionRequest = this.context.requestStore.getRequest(
      ACTIVITY_IDS_REQUESTS.ACTIVITY_IDS_GET_USER_ACTIVITIES_PORTIONS
    )

    return {
      userActivitiesPortionRequest
    }
  }

  _getFilter() {
    const filter = this.context.uiStore.getTableFilter(this.props.filterId)
      || new TableFilter({
        'id': this.props.filterId,
        'entityId': this.props.tableId,
        'limit': 5,
        'sortColumn': 'createdAt',
        'sortDirection': 'DESC',
      })

    return {
      filter,
    }
  }
    
  _getCreateNewActivityRequest() {
    const newActivityRequest = this.context.requestStore.getRequest(
      ACTIVITY_IDS_REQUESTS.ACTIVITY_IDS_CREATE_NEW_ACTIVITY
    )

    return {
      newActivityRequest,
      newActivityRequestError: Boolean(newActivityRequest ? newActivityRequest.error : null),
    }
  }

  _fetchUserActivitiesPortions = (pageNumber) => {
    this.context.apiManager.getUserActivitiesPortions({
      page: pageNumber || 1,
      filter: this.state.filter,
    })
  }

  render() {
    return (
      <div>
        {this.props.userInfo &&
          <ActivityForm
            userInfo={this.props.userInfo}
            newActivityRequest={this.state.newActivityRequest}
            newActivityRequestError={this.state.newActivityRequestError}
            onSubmitCallback={this._fetchUserActivitiesPortions}
          />
        }
        <h2>Recent activites</h2>
        <PortionContainer
          showPagination={false}
          filter={this.state.filter}
          onPageChange={this._handlePageChange}
        />
      </div>
    )
  }
}