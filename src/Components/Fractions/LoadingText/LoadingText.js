import React, { Component } from 'react'
import css from './item.module.css'


export default ({ length = 5 }) => (
  <span className={css.main}>
    { Array(length).fill('b').join('') }
  </span>
)
