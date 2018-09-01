import React from 'react'
import PropTypes from 'prop-types'

import PortionContainer from '../components/portion-container'
import { ACTIVITY_IDS_REQUESTS } from '../actions/constants'
import { TableFilter } from '../entities';

export default class Activities extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
    requestStore: PropTypes.object.isRequired,
    uiStore: PropTypes.object.isRequired,
  }

  state = this._getState()

  static defaultProps = {
    tableId: 'portions',
    filterId: 'portions'
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
    if (this.props.userInfo && !this.state.userActivitiesPortionRequest) {
      this._fetchUserActivitiesPortions()
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if ((this.props.userInfo !== nextProps.userInfo) && !this.state.userActivitiesPortionRequest) {
      this._fetchUserActivitiesPortions()
    }
  }

  _handleRequestStoreChange = () => {
    this.setState(this._getUserActivitiesPortionRequest())
  }

  _handleUiStoreChange = () => {
    this.setState(this._getFilter())
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
        'limit': 10,
        'sortColumn': 'createdAt',
        'sortDirection': 'DESC',
      })

    return {
      filter,
    }
  }

  _handlePageChange = (pageNumber) => {
    this._fetchUserActivitiesPortions(pageNumber)
  }

  _fetchUserActivitiesPortions(pageNumber) {
    this.context.apiManager.getUserActivitiesPortions({
      page: pageNumber,
      filter: this.state.filter,
    })
  }

  render() {
    return (
      <div>
        <h1>Portions view</h1>
        <PortionContainer
          filter={this.state.filter}
          onPageChange={this._handlePageChange}
          showPagination
        />
      </div>
    )
  }
}
