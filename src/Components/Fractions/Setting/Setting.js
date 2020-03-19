import React, { Component } from 'react'
import css from './item.module.css'
import LikeLink from '../LikeLink/LikeLink'

import edit from '../../../icons/edit.svg'
import save from '../../../icons/save.png'

class Setting extends Component {
  state = {
    name: '',
    value: ''
  }

  handleEdit=() => {
    const { editable } = this.state
    if(editable) {

      return this.setState({ editable: false })
    }
    this.setState({ editable: true })
    setTimeout(() => this.editable.focus())
  }

  render() {
    const { editable } = this.state
    const { name, value, canChange, id } = this.props
    return (
      <tr className={css.main}>
        <td className={css.name}>{ name }{value ? ':' : ''}</td>
        <td ref={elem => this.editable = elem} contentEditable={editable} className={css.value}><b>{ value }</b></td>
        { canChange ? <td onClick={this.handleEdit} className={css.edit}>
        <LikeLink>
          { editable ? 'Сохранить' : 'Изменить'} 
          <img src={editable ? save : edit} alt={ editable ? 'Save' : 'Edit'}/>
        </LikeLink>
        </td> : <></>}
      </tr>
    )
  }
}

export default Setting