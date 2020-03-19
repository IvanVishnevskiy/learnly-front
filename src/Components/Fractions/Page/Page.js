import React, { Component } from 'react'

import css from './item.module.css'

class Page extends Component {
  state = {
    
  }

  render() {
    const { error, errorname, redirectToChat } = this.state
    
    return (
      <section className={css.main}>
        { this.props.children }
      </section>
    )
  }
}

export default Page