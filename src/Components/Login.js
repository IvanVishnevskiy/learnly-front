import React, { Component } from 'react'
// import { css, StyleSheet } from 'aphrodite/no-important'
import { Link, Redirect } from 'react-router-dom'
import store from 'fg-store' 

import loginCss from '../css/login.module.css'

class Login extends Component {
  state = {
    redirectToApp: false
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { target } = e
    const body = JSON.stringify([...target.querySelectorAll('input')].reduce((data, input) => {
      const { name, value } = input
      data[name] = value
      return data
    }, {}))
    const req = await fetch('https://forgetable.ru/api/shared/login', {
      method: 'POST',
      body,
      credentials: 'include'
    })
    const { error, errorname, session, ...user } = await req.json()
    if(!error) {
      store.update({ _session: session })
      localStorage.setItem('session', session)
      return store.update({ loggedIn: true, user })
    }
    if(this.errorTimeout) clearTimeout(this.errorTimeout)
    this.setState({ error, errorname })
    this.errorTimeout = setTimeout(() => this.setState({ error: 0 }), 2000) 
  }

  render() {
    const { error, errorname, redirectToApp } = this.state

    return (
      <>
        {
          redirectToApp ? <Redirect to="/learnly/home" /> : ''
        }
        <div className={loginCss.main}>
          <div>
            <h1>Вход</h1>
            <div>
              <form className={loginCss.form} action="" onSubmit={this.handleSubmit}>
                <input required className={loginCss.formItem} type="text" name="email" placeholder="E-mail" />
                <input required className={loginCss.formItem} type="password" name="password" placeholder="Пароль" />
                <button className={loginCss.formItem}>Войти</button>
              </form>
            </div>
            <Link to="/learnly/register" className={loginCss.registerLink}>Регистрация</Link>
            <p className={loginCss.error} style={{ opacity: error ? 1 : 0 }}>{ errorname }</p>
          </div>
        </div>
      </>
      
    )
  }
}

export default Login