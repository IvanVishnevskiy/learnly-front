import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import loginCss from '../css/login.module.css'

class Register extends Component {
  state = {
    redirectToLogin: false,
    stage: 'email',
    code: ['', '', '', ''], // state code
    codeButtonDisabled: true
  }
  code = [] // ref code
  handleSubmit = async e => {
    e.preventDefault()
    const { target } = e
    const body = [...target.querySelectorAll('input')].reduce((data, input) => {
      const { name, value } = input
      data[name] = value
      return data
    }, {})
    this.email = body.email
    const req = await fetch('https://forgetable.ru/api/shared/register', {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const { error, errorname, keyToken } = await req.json()
    if(!error) this.setState({ stage: 'code', keyToken })
    if(this.errorTimeout) clearTimeout(this.errorTimeout)
    this.setState({ error, errorname })
    this.errorTimeout = setTimeout(() => this.setState({ error: 0 }), 2000) 
  }

  handleSubmitCode = async e => {
    e.preventDefault()
  }

  codeUp = (i, value, e) => {
    if(/\D/.test(value)) {      
      return e.preventDefault()
    }
    if(value > 9 || String(value).length > 1) value = String(value)[1]
    const code = this.state.code
    code[i - 1] = value
    let codeButtonDisabled = true
    console.log(code.length === 4 && code.join('').length === 4)
    if(code.length === 4 && code.join('').length === 4) {
      codeButtonDisabled = false
      console.log('ENABLING')
    }
    else codeButtonDisabled = true
    this.setState({ code, codeButtonDisabled })
    setTimeout(() => {
      console.log(this.state)
    }, 1000)
    if(value && this.code[i + 1]) this.code[i + 1].focus()
  }

  codeMoveDown = (i, value) => {
    if(this.code[i - 1]) this.code[i - 1].focus()
  }

  approveEmail = async () => {
    const code = this.state.code.join('')
    const { keyToken } = this.state
    const { email } = this
    const body = {
      code, keyToken, email
    }
    const req = await fetch('https://forgetable.ru/api/shared/approveEmail', {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const res = await req.json()
    const { error, errorname } = res
    if(error) {
      if(this.errorTimeout) clearTimeout(this.errorTimeout)
      this.setState({ error, errorname })
      this.errorTimeout = setTimeout(() => this.setState({ error: 0 }), 2000) 
    }
    else this.setState({ redirectToLogin: true })
  }

  render() {
    const { error, errorname, redirectToLogin, stage, code, codeButtonDisabled } = this.state

    return (
      <>
        { redirectToLogin ? <Redirect to="/learnly/login" /> : ''}
        <div className={loginCss.main}>
          <div>
            <h1>Регистрация</h1>
            <div>
              {
                stage === 'email' ? (
                  <form className={loginCss.form} action="" onSubmit={this.handleSubmit}>
                    <input required className={loginCss.formItem} type="text" name="email" placeholder="E-mail" />
                    <input required className={loginCss.formItem} type="password" name="password" placeholder="Пароль" />
                    <input required className={loginCss.formItem} type="text" name="nickname" placeholder="Никнейм" />
                    <button className={loginCss.formItem}>Зарегистрироваться</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p>Мы прислали вам секретный ключ.<br/>Введите его полностью:</p>
                    <form action="" className={loginCss.codeForm} onSubmit={this.handleSubmitCode}>
                      {
                        [1,2,3,4].map(i => 
                          <input key={i} 
                            type="text" 
                            value={code[i - 1]} 
                            onChange={e => this.codeUp(i, e.target.value, e)}
                            onKeyDown={e => (e.key === 'Backspace' && !e.target.value) ? this.codeMoveDown(i) : ''}
                            ref={elem => this.code[i] = elem}
                          />
                        )
                      }
                    </form>
                    <button disabled={codeButtonDisabled} onClick={this.approveEmail} style={{ width: 95, alignSelf: 'flex-end', margin: '7px 0' }}>Готово</button>
                  </div>
                )
              }
            </div>
            <Link to="/learnly/login" className={loginCss.registerLink}>Вход</Link>
            <p className={loginCss.error} style={{ opacity: error ? 1 : 0 }}>{ errorname }</p>
          </div>
        </div>
      </>
      
    )
  }
}

export default Register