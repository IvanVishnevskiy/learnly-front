import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const style = StyleSheet.create({
  main: {
    border: 'solid 1px lightgray',
    width: '100%',
    height: 700,
    maxWidth: 1200,
    borderRadius: 2,
    marginTop: 14,
    display: 'flex',
  }
})

class Loading extends Component {
  state = {}

  render() {
    return (
      <div>
        Loading...
      </div>
    )
  }
}

export default Loading