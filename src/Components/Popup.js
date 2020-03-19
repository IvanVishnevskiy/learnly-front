import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-regular-svg-icons'
import store from 'fg-store'

import deleteIcon from '../icons/delete.svg'

const style = StyleSheet.create({
  main: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(45, 45, 45, .3)',
    zIndex: 1000,
    display: 'flex',
    transition: 'all .5s ease'
  },
  popup: {
    maxWidth: 500,
    minHeight: 100,
    margin: 'auto',
    padding: 35,
    backgroundColor: '#403D49', // --lightgrayd1
    boxShadow: '2px 2px 0 3px rgba(155, 45, 95, .5)', // --mainshadow
    position: 'relative',
    borderRadius: 3
  },
  mainHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  heading: {
    fontSize: 24,
    marginBottom: 7
  },
  exitIcon: {
    position: 'absolute',
    right: 7,
    top: 7,
    cursor: 'pointer',
    opacity: .5,
    transition: 'opacity .3s ease',
    ':hover': {
      opacity: .8
    },
    width: 20
  },
  clickable: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
})

class Popup extends Component {
  state = {
    questionForm: '',
    title: '',
    description: '',
    active: false
  }

  createPopup = popupState => this.setState({ popup: { ...popupState, active: true } })
  removePopup = delay => (delay && typeof delay === 'number') ? setTimeout(() => this.setState({ popup: { active: false } }), delay) : this.setState({ popup: { active: false } })
  createJSXPopup = jsx => this.setState({ jsx, popup: { active: true } })

  componentDidMount = () => {
    const { createPopup, removePopup, createJSXPopup } = this
    store.addAction('popup.create', createPopup)
    store.addAction('popup.close', removePopup)
    store.addAction('popup.remove', removePopup)
    store.addAction('popup.createJSX', createJSXPopup)
  }

  render = () => {
    const { popup = {}, jsx } = this.state
    const { questionForm = '', title = '', description = '', active = false } = popup
    return (
      <div className={css(style.main, active ? '' : style.mainHidden )}>
        <div className={css(style.clickable)} onClick={this.removePopup}>

        </div>
        <div className={css(style.popup)}>
          <img src={deleteIcon} alt="Exit"className={css(style.exitIcon)} onClick={this.removePopup} />
          {
            jsx ? jsx : <>
              <h1 className={css(style.heading)}>{ title }</h1>
              <p>{ description }</p>
              {
                questionForm ? questionForm : ''
              }
            </>
          }
        </div>
      </div>
    )
  }
}

export default Popup