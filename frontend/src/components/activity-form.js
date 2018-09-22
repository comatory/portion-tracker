import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-toolbox/lib/button'

import styles from '../styles/activity-form.css'
import ActivityPortion from './activity-portion'

export default class ActivityForm extends React.PureComponent {
  static contextTypes = {
    enumerationStore: PropTypes.object.isRequired,
    formStore: PropTypes.object.isRequired,
    formManager: PropTypes.object.isRequired,
  }

  state = this._getState()

  componentWillMount() {
    this.context.enumerationStore.listen(this._handleEnumerationStoreChange)
    this.context.formStore.listen(this._handleFormStoreChange)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.newActivityRequest &&
      !nextProps.newActivityRequest &&
      !nextProps.newActivityRequestError
    ) {
      this.context.formManager.clearActivityForm()
      this.props.onSubmitCallback()
    }
  }

  componentWillUnmount() {
    this.context.enumerationStore.unlisten(this._handleEnumerationStoreChange)
    this.context.formStore.unlisten(this._handleFormStoreChange)
  }

  _getState() {
    return {
      ...this._getEnumerationState(),
      ...this._getFormState(),
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

  _getFormState() {
    const activityForm = this.context.formStore.getRootValues('portions')
    const activityFormValid = this._validateActivityForm(activityForm)

    return {
      activityForm,
      activityFormValid,
    }
  }

  _validateActivityForm(activityForm) {
    const validations = activityForm.map((portion) => {
      return (
        Number.isFinite(portion.get('portionHealthinessId')) &&
        Number.isFinite(portion.get('portionSizeId'))
      )
    })

    if (!validations.size) {
      return false
    }

    return !validations.some(validation => !validation)
  }

  _handleEnumerationStoreChange = () => {
    this.setState(this._getEnumerationState())
  }

  _handleFormStoreChange = () => {
    this.setState(this._getFormState())
  }

  _handleAddPortion = () => {
    this.context.formManager.addPortion()
    this._validateActivityForm(this.state.activityForm)
  }

  _handleSubmit = (e) => {
    e.preventDefault()

    if (!this.props.userInfo) {
      return
    }

    this.context.formManager.submitActivityForm(
      this.state.activityForm,
      this.props.userInfo
    )
  }

  _handleFormChange = (id, attribute, value) => {
    let portion = this.state.activityForm.find((portion) => {
      return portion.get('id') === id
    })

    if (portion) {
      portion = portion.set(attribute, value)
      this.context.formManager.updatePortion(id, portion)
    }
  }

  _handleDeletePortionRequest = (id) => {
    this.context.formManager.removePortion(id)
  }

  render() {
    const healthinessOptions = this.state.portionHealthinesses.map((portionHealthiness) => {
      return {
        value: portionHealthiness.get('id'),
        label: portionHealthiness.get('name'),
      }
    }).toArray()

    const sizeOptions = this.state.portionSizes.map((portionSize) => {
      return {
        value: portionSize.get('id'),
        label: portionSize.get('name'),
      }
    }).toArray(0)

    const newActivityRequestProgress = this.props.newActivityRequest && !this.props.newActivityRequestError

    return (
      <div className={styles.activityForm}>
        <div className={styles.activity_container}>
          {this.state.activityForm.map((portion, index) => {
            return (
              <div
                key={`portion-card-${portion.get('id')}`}
                className={styles.activity_portion_wrapper}
              >
                <ActivityPortion
                  id={portion.get('id')}
                  disabled={newActivityRequestProgress}
                  index={index}
                  onChange={this._handleFormChange}
                  onDeletePortionRequest={this._handleDeletePortionRequest}
                  healthinessOptions={healthinessOptions}
                  sizeOptions={sizeOptions}
                  portionSizeId={portion.get('portionSizeId')}
                  portionHealthinessId={portion.get('portionHealthinessId')}
                  calories={portion.get('calories')}
                  note={portion.get('note')}
                />
              </div>
            )
          })}
        </div>
        <div className={styles.activity_container_divider}>
          <Button
            disabled={newActivityRequestProgress}
            className={styles.add_portion_button}
            floating
            accent
            icon='add'
            onClick={this._handleAddPortion}
          />
        </div>
        <Button
          disabled={!this.state.activityFormValid || newActivityRequestProgress}
          raised
          primary
          onClick={this._handleSubmit}
        >
          Submit
        </Button>
      </div>
    )
  }
}
