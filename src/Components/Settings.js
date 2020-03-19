import React, { Component } from 'react'
import Page from './Fractions/Page/Page'
import store from 'fg-store'
// 2px 2px 0 3px rgba(155, 45, 95, .5);
import css from '../css/Components/settings.module.css'

import Setting from './Fractions/Setting/Setting'
import LikeLink from './Fractions/LikeLink/LikeLink'
import add from '../icons/add.png'

import waves from '../images/waves.svg'
import authFetch from '../lib/authFetch'

export default class Settings extends Component {
  state = {
    user: {

    }
  }
  componentDidMount = () => {
    store.watchState(this, ['user'])
    this.fields = ['nickname', 'email', 'password', 'avatar']
  }
    
  
  handleEdit = id => {
    const field = this.fields[id]
    console.log(field)
  }

  handleDragStart = () => this.setState({
    draggingActive: true
  })
  
  handleDragEnd = () => this.setState({
    draggingActive: false
  })

  handleDeleteImage = async () => {
    const { error, errorname, avatar } = await authFetch('/shared/deleteAvatar')
    if(error) return alert(errorname)
    let { user } = this.state
    user = { ...user, avatar: '' }
    this.setState({ user })
  }
  uploadAvatar = async image => {
    const { error, errorname, avatar  } = await authFetch('/shared/changeAvatar', {
      body: { image }
    })
    if(error) return alert(errorname)
    let { user } = this.state
    user = { ...user, avatar }
    this.setState({ user })
  }

  initChangeImage = () => this.setState({ changeImage: true })

  handleChangeImage = e => {
    if(e.dataTransfer) {
      const [ file ] = e.dataTransfer.files
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      if (ext !== 'gif' && ext !== 'png' && ext !== 'jpeg' && ext !== 'jpg') return
      const reader = new FileReader()
        reader.onload = e => {
          this.setState({
            changeImage: false
          })
          this.uploadAvatar(e.target.result)
        }
        reader.readAsDataURL(file)
    }
    else {
      const input = e.target
      const path = input.value
      const ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase()
      if (!input.files && !input.files[0] || (ext !== 'gif' && ext !== 'png' && ext !== 'jpeg' && ext !== 'jpg')) return
      const reader = new FileReader()
        reader.onload = e => {
          this.setState({
            changeImage: false
          })
          this.uploadAvatar(e.target.result)
        }
        reader.readAsDataURL(input.files[0])
    }
  }

  render = () => {
    const { user, changeImage, tempImage } = this.state
    return (
      <Page>
        <div className={css.main}>
          <div className={css.mainBg} style={{ backgroundImage: `url(${waves})` }} />
          <section className={css.avatar}>
            <div className={css.image}>
              
              {(!user.avatar || changeImage) ? (
                <form 
                className={css.addImage}
                onSubmit={this.handleChangeImage}
                action=""
                encType="multipart/form-data"
                onDragOver={this.handleDragStart}
                onDragEnter={this.handleDragStart}
                onDragLeave={this.handleDragEnd}
                onDragEnd={this.handleDragEnd}
                onDrop={e => {
                  e.preventDefault()
                  this.handleDragEnd()
                  this.handleChangeImage(e)
                }}
                >
                  <img src={add} alt="Add an image"/>
                  <input ref={elem => this.imageLoader = elem} onChange={e => this.handleChangeImage(e)} className={css.loadImage} type="file" name="file" id="file" />
                  <p style={{ textAlign: 'center', padding: 20, fontSize: 14 }}>
                    {
                      this.state.draggingActive ?
                        'Отпустите файл, чтобы сохранить' :
                        'Перетащите изображение сюда или нажмите, чтобы выбрать вручную.'
                    }
                  </p>
                </form> ) : ''}
              
              <div className={css.imgBg} style={{backgroundImage: `url(https://forgetable.ru${user.avatar || tempImage})`}}/>
              <div className={css.img} style={{backgroundImage: `url(https://forgetable.ru${user.avatar || tempImage})`}} />
            </div>
          </section>
          <div>
            <table className={css.table}>
              <tbody>
                {[
                  {
                    id: 0,
                    name: 'Ваш ник',
                    value: user.nickname,
                    canChange: true
                  },
                  {
                    id: 1,
                    name: 'Ваша почта',
                    value: user.email,
                    canChange: false
                  },
                  {
                    id: 2,
                    name: 'Ваш пароль',
                    value: '#########',
                    canChange: true
                  }
                ].map(item => <Setting edit={this.handleEdit} key={item.id} {...item} />)}
              </tbody>
            </table>
            {
              user.avatar ? (
                <div className={css.avatarOptions}>
                  <LikeLink><span onClick={this.initChangeImage}>Изменить аватар</span></LikeLink>
                  <br/>
                  <br/>
                  <LikeLink><span onClick={this.handleDeleteImage}>Удалить аватар</span></LikeLink>
                </div>
              ) : ''
            }
          </div>
          <h1 className={css.heading}>Настройки</h1>
        </div>
      </Page>
    )
  }
}