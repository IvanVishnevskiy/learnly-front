import React, { Component } from 'react'

import css from './item.module.css'
import store from 'fg-store'

export default (props) => (
  <div className={css.main} {...props}>
    <div className={css.contents}>
      { props.children }
    </div>
  </div>
)