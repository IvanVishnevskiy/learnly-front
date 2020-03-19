import React, { Component } from 'react'
import css from './item.module.css'

class TextThumbnail extends Component {
  render() {
    const { word, translation } = this.props
    return (
      <span>
        <span className={css.main}>
          { word }
          <span className={css.translation}>{ translation }</span>
        </span>
        { ' ' }
      </span>
    
    )
  }
}

export default TextThumbnail