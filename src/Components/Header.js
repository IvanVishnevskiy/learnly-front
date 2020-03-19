import React, { Component } from 'react'

import css from '../css/Components/header.module.css'
import store from 'fg-store'

import LikeLink from './Fractions/LikeLink/LikeLink'
import DropDownSettings from './Fractions/DropDownSettings/DropDownSettings'

import dropdownCss from './Fractions/DropDownSettings/item.module.css'

import { Link } from 'react-router-dom'

export default class Header extends Component {
  state = {
    user: {},
    dropdownMenu: false
  }

  componentDidMount() {
    store.watchState(this, ['user'])
  }

  toggleDropDownMenu = () => {
    this.setState({ dropdownMenu: !this.state.dropdownMenu })
  }

  render = () => {
    const { user, dropdownMenu } = this.state
    return (
      <div className={css.main}>
        <div className={css.content}>
          <Link to="/learnly/home">
            <LikeLink>
              <h3 onClick={this.toggleDropDownMenu} className={css.name}>Learnly</h3>
            </LikeLink>
          </Link>
          {/* z-index 1000 so that dropdown menu is never obstructed by any other block */}
          <div style={{ position: 'relative', zIndex: 1000 }}> 
            <LikeLink>
              <h4 onClick={this.toggleDropDownMenu} className={css.name}>{ user.nickname }</h4>
            </LikeLink>
            <DropDownSettings className={dropdownMenu ? dropdownCss.show : ''} />
          </div>
        </div>
      </div>
    )
  }
}