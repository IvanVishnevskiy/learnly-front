import React, { Component } from 'react'
import Page from './Fractions/Page/Page'
import css from '../css/Components/home.module.css'
import authFetch from '../lib/authFetch'
import store from 'fg-store'
import Dictionary from './Fractions/Dictionary/Dictionary'

class Home extends Component {
  state = {
    loading: true,
    user: {}
  }

  handleCreateDictionary = async () => {
    const { error, errorname, dictionaries } = await authFetch('english/createDictionary')
    if(error) return alert(errorname)
    const user = { ...this.state.user, dictionaries }
    this.setState({ user })
  }

  handleDeleteDictionary = async id => {
    const { error, errorname, dictionaries } = await authFetch('english/deleteDictionary', { body: { id } })
    if(error) return alert(errorname)
    const user = { ...this.state.user, dictionaries }
    console.log(dictionaries, user)
    this.setState({ user })
  }

  componentDidMount = () => {
    store.watchState(this, ['user'])
    const { error, errorname, dictionaries } = authFetch('english/getDictionaries')
    if(error) alert(errorname)
    this.setState({ loading: false, dictionaries })
    store.addAction('dictionary.create', this.handleCreateDictionary)
    store.addAction('dictionary.delete', this.handleDeleteDictionary)
  }

  render() {
    const { loading, user } = this.state
    const { dictionaries = [] } = user

    const dictionariesToRender = loading ? (
      <>
        <Dictionary loading />
        <Dictionary loading />
        <Dictionary loading />
        <Dictionary loading />
      </>
    ) : dictionaries.map((item, i) => <Dictionary key={i} {...item} />)

    if(!loading) dictionariesToRender.push(<Dictionary key="create" empty />)
    
    return (
      <Page>
        <h1>Главная</h1>
        <br/>
        <br/>
        <section className={css.dictionaries}>
          <h3>Ваши словари</h3>
          <div className={css.dictionaryList}>
            { dictionariesToRender }
          </div>
        </section>
      </Page>
    )
  }
}

export default Home

