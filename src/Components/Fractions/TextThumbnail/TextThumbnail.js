import React, { Component } from 'react'
import css from './item.module.css'

class TextThumbnail extends Component {
  render() {
    const { name, onClick } = this.props 
    return (
      <div onClick={onClick} className={css.main}>
        <h3>{ name }</h3>
      </div>
    
    )
  }
}

export default TextThumbnail