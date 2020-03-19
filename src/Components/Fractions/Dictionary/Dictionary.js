import React, { Component } from 'react'
import css from './item.module.css'
import LoadingText from '../LoadingText/LoadingText'
import addIcon from '../../../icons/add.png'
import store from 'fg-store'
import { Redirect } from 'react-router-dom'

import deleteIcon from '../../../icons/delete.svg'

console.log(store.action('dictionary.delete'))

class Default extends Component {
  state = {
    user: {},
    open: false
  }

  componentDidMount = () => store.watchState(this, ['user'])

  handleOpenDictionary = () => this.setState({ open: true })

  render() {
    const { open } = this.state
    const { loading, name, description, empty, id, wordCount } = this.props
    return (
      <div onClick={empty ? store.action('dictionary.create') : () => {}} className={[css.main, loading ? css.loading : ''].join(' ')}>
        { open ? <Redirect push to={`/learnly/dictionary/${id}`} /> : ''}
        {
          empty ? (
            <div className={css.add}>
              <img src={addIcon} alt="Add a dictionary"/>
              <p>Добавить словарь</p>
            </div>
          ) : (
            <>
              <div className={css.clickable} onClick={this.handleOpenDictionary} />
              <h5>{ loading ? <LoadingText length={8} /> : name }</h5>
              <p>{ loading ? <LoadingText length={12} /> : description }</p>
              <img onClick={() => store.action('dictionary.delete')(id)} className={css.delete} src={deleteIcon} alt="Delete" />
              <span className={css.wordCount}>Слов: { wordCount }</span>
            </>
          )
        }
      </div>
    
    )
  }
}

export default Default