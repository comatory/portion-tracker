import React from 'react'

export default class Settings extends React.PureComponent {
  componentDidMount() {
    if (this.props.mountCallback) {
      this.props.mountCallback()
    }
  }

  render() {
    return (
      <div>
        <h1>Settings view</h1>
      </div>
    )
  }
}