import React, { Component } from 'react'

import css from './item.module.css'
import store from 'fg-store'

import { Link, Redirect } from 'react-router-dom'

import settings from '../../../icons/settings.svg'
import exit from '../../../icons/exit.png'

export default class Header extends Component {
  state = {
    exited: false
  }
  handleExit = () => {
    localStorage.removeItem('session')
    this.setState({ exited: true })
    store.update({ loggedIn: false })
  }
  render = () => {
    const { exited } = this.state
    return (
      <div className={css.main + ' ' + this.props.className} >
        { exited ? <Redirect to="/learnly/login" /> : '' }
        <ul className={css.contents}>
          <Link to="/learnly/settings">
            <li>
              <img src={settings} alt="Settings"/> Настройки
            </li>
          </Link>
          <li onClick={this.handleExit}>
            <img src={exit} alt="Exit"/> Выйти
          </li>
        </ul>
      </div>
    )
  }
}