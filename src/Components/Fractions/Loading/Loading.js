import React, { Component } from 'react'
import css from './item.module.css'

class Loading extends Component {
  state = {
    
  }

  render() {
    
    return (
      <div className={css.wrapper}>
        <div className={css.profileMainLoader}>
          <div className={css.loader}>
            <svg className={css.circularLoader} viewBox="25 25 50 50" >
              <circle className={css.loaderPath} cx="50" cy="50" r="20" fill="none" stroke="var(--red)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    
    )
  }
}

export default Loading