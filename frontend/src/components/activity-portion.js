import React from 'react'
import {
  Card,
  CardTitle,
} from 'react-toolbox/lib/card'
import {
  Dropdown,
  FontIcon,
  Input,
} from 'react-toolbox/lib'

import formStyles from '../styles/form.css'
import styles from '../styles/activity-portion.css'

export default class ActivityPortion extends React.PureComponent {
  _handlePortionSizeChange = (value) => {
    this.props.onChange(this.props.id, 'portionSizeId', value)
  }

  _handlePortionHealthinessChange = (value) => {
    this.props.onChange(this.props.id, 'portionHealthinessId', value)
  }

  _handleCaloriesChange = (value) => {
    this.props.onChange(this.props.id, 'calories', value)
  }

  _handleNoteChange = (value) => {
    this.props.onChange(this.props.id, 'note', value)
  }

  _handlePortionDelete = () => {
    this.props.onDeletePortionRequest(this.props.id)
  }

  render() {
    return (
      <Card
        className={styles.activity_card}
      >
        <div className={styles.activity_card_header}>
          <CardTitle
            title={`Portion #${this.props.index + 1}`}
          />
          <FontIcon
            value='delete'
            onClick={this._handlePortionDelete}
            className={styles.activity_card_delete}
          />
        </div>
        <form className={styles.activity_form}>
          <Dropdown
            disabled={this.props.disabled}
            className={formStyles.input}
            label='Size'
            onChange={this._handlePortionSizeChange}
            value={Number.isFinite(this.props.portionSizeId) ? this.props.portionSizeId : ''}
            source={this.props.sizeOptions} 
            // TODO: This below is hack: https://github.com/react-toolbox/react-toolbox/issues/1870
            key={`dropdown-size-${this.props.id}-${this.props.portionSizeId}`}
          />
          <Dropdown
            disabled={this.props.disabled}
            className={formStyles.input}
            label='Healthiness'
            onChange={this._handlePortionHealthinessChange}
            value={Number.isFinite(this.props.portionHealthinessId) ? this.props.portionHealthinessId : ''}
            source={this.props.healthinessOptions}
            // TODO: This below is hack: https://github.com/react-toolbox/react-toolbox/issues/1870
            key={`dropdown-healthiness-${this.props.id}-${this.props.portionHealthinessId}`}
          />
          <Input
            disabled={this.props.disabled}
            className={formStyles.input}
            type="number"
            label='Calories'
            value={this.props.calories || ''}
            onChange={this._handleCaloriesChange}
          />
          <Input
            disabled={this.props.disabled}
            className={formStyles.input}
            multiline
            label='Note'
            value={this.props.note || ''}
            onChange={this._handleNoteChange}
          />
        </form>
      </Card>
    )
  }
}
