import React, { Component } from 'react'
import './css/normalize.css'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './Components/Home'
import Login from './Components/Login'
import Loading from './Components/Loading'
import Register from './Components/Register'
import Settings from './Components/Settings'
import Popup from './Components/Popup'
import Header from './Components/Header'
import Dictionary from './Components/Dictionary'

import store from 'fg-store'
import authFetch from './lib/authFetch'

class App extends Component {
  state = {
    shouldRedirectToLogin: false,
    loggedIn: 'first_load'
  }

  renderAuthorize = (Render) => {
    const { state, sentLoginRequestLastTime } = this
    const { loggedIn } = state;
    // return
    if(!sentLoginRequestLastTime) {
      (async () => {
        this.sentLoginRequestLastTime = false
        const { error, errorname, ...user } = await authFetch('shared/checkLogin')
        store.update({ loggedIn: error ? false : true })
        if(!error) store.update({ user })
      })()
    }
    this.sentLoginRequestLastTime = true
    if(loggedIn === 'first_load') return () => <Loading />
    if(!loggedIn) {
      return () => <Login />
    }
    return props => {
      const params = props.match ? props.match.params : {}
      return <>
        <Header />
        <Render params={params} />
      </>
    }
  }

  componentDidMount = async () => store.watchState(this, ['loggedIn'])

  render = () => {
    const { state, renderAuthorize } = this
    const { shouldRedirectToLogin } = state
    return (
      <div>
        <Popup />
        <Router>
          { shouldRedirectToLogin ? <Redirect to="/learnly/login" /> : ''}
          <Route render={({ location }) => {
            const loc = { location, key: location.key }
            return (
              <Switch {...loc}>
                <Route 
                  {...loc}
                  exact path="/"
                  render={() => <Redirect to="/learnly" />}
                />
                <Route
                  {...loc}
                  exact path="/learnly/login"
                  render={renderAuthorize(Home)}
                />
                <Route 
                  {...loc}
                  exact path="/learnly/register"
                  render={() => <Register />}
                />
                <Route
                  {...loc}
                  exact path="/learnly/home"
                  render={renderAuthorize(Home)}
                />
                <Route
                  {...loc}
                  exact path="/learnly"
                  render={renderAuthorize(Home)}
                />
                <Route
                  {...loc}
                  exact path="/learnly/settings"
                  render={renderAuthorize(Settings)}
                />
                <Route 
                  {...loc}
                  path="/learnly/dictionary/:id"
                  render={renderAuthorize(Dictionary)}
                />
              </Switch>
            )
          }} />
        </Router>
      </div>
    )
  }
}

export default App
