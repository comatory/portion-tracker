import React from 'react'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import { Home, Portions, Logout, Settings } from '../routes'

export default class RoutesContainer extends React.PureComponent {
  render() {
    return (
      <div>
        <Router>
          <React.Fragment>
            <Route exact path='/' render={(props) => <Home userInfo={this.props.userInfo} />} />
            <Route path='/portions' render={(props) => <Portions userInfo={this.props.userInfo} />} />
            <Route path='/settings' render={(props) => <Settings mountCallback={this.props.redirectCallback} />} />
            <Route path='/logout' render={(props) => <Logout mountCallback={this.props.redirectCallback} />} />
          </React.Fragment>
        </Router>
      </div>
    )
  }
}
