import React from 'react'
import PropTypes from 'prop-types'
import { Set } from 'immutable'
import {
  Button,
  Dialog,
} from 'react-toolbox/lib'

import ActivityPortion from '../components/activity-portion'
import PortionList from './portion-list'
import FormUtils from '../utils/form-utils'
import style from '../styles/portion-container.css'
import formStyle from '../styles/form.css'

export default class PortionContainer extends React.PureComponent {
  static contextTypes = {
    activityStore: PropTypes.object.isRequired,
    enumerationStore: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    uiStore: PropTypes.object.isRequired,
  }

  static defaultProps = {
    selectable: true,
  }

  state = this._getState()

  componentWillMount() {
    this.context.activityStore.listen(this._handleActivityStoreChange)
    this.context.enumerationStore.listen(this._handleEnumerationStoreChange)
    this.context.userStore.listen(this._handleActivityStoreChange)
  }

  componentWillUnmount() {
    this.context.activityStore.unlisten(this._handleActivityStoreChange)
    this.context.enumerationStore.unlisten(this._handleEnumerationStoreChange)
    this.context.userStore.unlisten(this._handleActivityStoreChange)
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.updateRequest && !nextProps.updateRequest) ||
        (this.props.deleteRequest && !nextProps.deleteRequest)
    ) {
      if (nextProps.filter) {
        this.props.onActivityPortionsRequest(nextProps.filter.get('page'))
      }
      this._handleDialogClose()
    }
  }

  _handleActivityStoreChange = () => {
    this.setState(this._getPortionState())
  }

  _handleEnumerationStoreChange = () => {
    this.setState(this._getEnumerationState())
  }

  _getState() {
    return {
      ...this._getPortionState(),
      ...this._getEnumerationState(),
      activePortion: null,
    }
  }

  _getPortionState() {
    const userActivitesPortions = this.context.activityStore.getUserActivitiesPortions(this.props.filter)

    return {
      portions: userActivitesPortions,
    }
  }

  _getEnumerationState() {
    const portionHealthinesses = this.context.enumerationStore.getEnumeration('portion-healthinesses')
    const portionSizes = this.context.enumerationStore.getEnumeration('portion-sizes')

    return {
      portionHealthinesses,
      portionSizes,
    }
  }

  _handlePageChange = (pageNumber) => {
    const nextPage = pageNumber.selected

    if (!Number.isFinite(nextPage)) {
      return
    }

    this.props.onPageChange(nextPage + 1)
  }

  _handleRowSelect = (indices) => {
    const ids = indices.reduce((set, index) => {
      const portion = this.state.portions.get(index)

      if (!portion) {
        return set
      }

      return set.add(portion.get('id'))
    }, Set())

    this.props.onRowSelect(ids)
  }

  _handleUpdateActivity = () => {
    const activePortionId = this.props.filter.get('selectedRows').first()

    if (!activePortionId) {
      return
    }

    const activePortion = this.state.portions.find((portion) => portion.get('id') === activePortionId)

    this.setState({
      activePortion,
    })
  }

  _handleChange = (id, attribute, value) => {
    if (!this.state.activePortion) {
      return
    }

    this.setState({
      activePortion: this.state.activePortion.update((nextPortion) => {
        return nextPortion.set(attribute, value)
      }),
    })
  }

  _handleDialogClose = () => {
    this.setState({
      activePortion: null,
    })
  }

  _handleSubmit = () => {
    this.props.onSubmit(this.state.activePortion)
  }

  _handleDeleteActivity = () => {
    const ids = this.props.filter.get('selectedRows')

    this.props.onDelete(ids)
  }

  render() {
    const selectedRows = this.props.filter.get('selectedRows')
    const requestPending = Boolean(this.props.updateRequest || this.props.deleteRequest)

    let buttonContainer = null

    if (selectedRows.size > 0) {
      buttonContainer = (
        <div>
          {selectedRows.size === 1 &&
            <Button
              primary
              label='update'
              onClick={this._handleUpdateActivity}
              disabled={requestPending}
            />
          }
          {selectedRows.size >= 1 &&
            <Button
              primary
              label={`delete ${selectedRows.size} item(s)`}
              onClick={this._handleDeleteActivity}
              disabled={requestPending}
            />
          }
        </div>
      )
    }

    const healthinessOptions = this.state.portionHealthinesses.map((portionHealthiness) => {
      return FormUtils.extractOptionsForSelect(portionHealthiness, 'id', 'name')
    }).toArray()

    const sizeOptions = this.state.portionSizes.map((portionSize) => {
      return FormUtils.extractOptionsForSelect(portionSize, 'id', 'name')
    }).toArray(0)

    return (
      <div className='activity-container'>
        {this.state.activePortion &&
          <Dialog
            active
            onOverlayClick={this._handleDialogClose}
            onEscKeyDown={this._handleDialogClose}
          >
            <ActivityPortion
              editing
              index={0}
              portionSizeId={this.state.activePortion.get('portionSizeId')}
              portionHealthinessId={this.state.activePortion.get('portionHealthinessId')}
              calories={this.state.activePortion.get('calories')}
              note={this.state.activePortion.get('note')}
              sizeOptions={sizeOptions}
              healthinessOptions={healthinessOptions}
              onChange={this._handleChange}
            />
            <div className={style.portion_container_dialog_buttons}>
              <Button
                onClick={this._handleDialogClose}
                label='Close'
                className={formStyle.input}
              />
              <Button
                primary
                raised
                label='Submit'
                className={formStyle.input}
                onClick={this._handleSubmit}
                disabled={Boolean(this.props.updateRequest)}
              />
            </div>
          </Dialog>}
        <PortionList
          selectable={this.props.selectable}
          showPagination={this.props.showPagination}
          portions={this.state.portions}
          filter={this.props.filter}
          onPageChange={this._handlePageChange}
          onRowSelect={this._handleRowSelect}
        />
        {buttonContainer}
      </div>
    )
  }
}
