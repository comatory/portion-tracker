import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Drawer,
  Layout,
  Navigation
} from 'react-toolbox/lib'
import {
  HashRouter as Router,
  Link
} from 'react-router-dom'

import RoutesContainer from './routes-container'
import Login from './login'
import UiOverlayContainer from './ui-overlay-container'
import UserInfoGuard from './user-info-guard'
import ProgressContainer from './progress-container'

import styles from '../styles/app-container.css'

export default class AppContainer extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
  }

  state = this._getState() 

  _getState() {
    return {
      ...this._getUserInfo(),
      drawerActive: false,
    }
  }

  _handleUserStoreChange = () => {
    this.setState(this._getUserInfo())
  }

  _getUserInfo() {
    const state = this.context.userStore.getState()
    const userInfo = state.get('userInfo') || null

    return {
      userInfo,
    }
  }

  componentWillMount() {
    this.context.userStore.listen(this._handleUserStoreChange)
  }

  componentDidMount() {
    if (!this.state.userInfo) {
      this.context.apiManager.getUserData()
    }
  }

  componentWillUnmount() {
    this.context.userStore.unlisten(this._handleUserStoreChange)
  }

  _triggerDrawer = () => {
    this.setState({
      drawerActive: !this.state.drawerActive,
    })
  }

  render() {
    return (
      <div className={styles.app_container}>
        <UiOverlayContainer />
          <ProgressContainer userInfo={this.state.userInfo} />
          <UserInfoGuard userInfo={this.state.userInfo}>
          <Drawer
            active={this.state.drawerActive}
            onOverlayClick={this._triggerDrawer}
          >
            <div className={styles.app_container__drawer_content}>
              <Router>
                <React.Fragment>
                  <div className={styles.drawer_nav_links}>
                    <Link to='/' className={styles.nav_link}>Home</Link>
                    <Link to="/portions" className={styles.nav_link}>Portions</Link>
                  </div>
                  <Link to="/settings" className={styles.nav_link}>Settings</Link>
                  <Link to='/logout' className={styles.nav_link}>Logout</Link>
                </React.Fragment>
              </Router>
            </div>
          </Drawer>
          <AppBar
            title="Portion Tracker"
            leftIcon='menu'
            onLeftIconClick={this._triggerDrawer}
          >
            <Navigation type='horizontal'>
                <Router>
                  <div className={styles.nav_links}>
                    <Link to='/' className={styles.nav_link}>Home</Link>
                    <Link to="/portions" className={styles.nav_link}>Portions</Link>
                  </div>
              </Router>
            </Navigation>
          </AppBar>
          <div className={styles.app_layout}>
            <Layout>
              <RoutesContainer userInfo={this.state.userInfo} redirectCallback={this._triggerDrawer} />
            </Layout>
          </div>
        </UserInfoGuard>
      </div>
    )
  }
}
