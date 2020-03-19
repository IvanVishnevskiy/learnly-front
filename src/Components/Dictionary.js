import React, { Component } from 'react'
import Page from './Fractions/Page/Page'
import authFetch from '../lib/authFetch'
import css from '../css/Components/dictionary.module.css'
import store from 'fg-store'
import Loading from './Fractions/Loading/Loading'
import TextThumbnail from './Fractions/TextThumbnail/TextThumbnail'
import TextViewer from './Fractions/TextViewer/TextViewer'
import WordWithTranslation from './Fractions/WordWithTranslation/WordWithTranslation'
import editIcon from '../icons/edit.svg'
import deleteIcon from '../icons/delete.svg'
import checkIcon from '../icons/checkbox.png'

class Dictionary extends Component {
  state = {
    loading: true,
    empty: false,
    selectedWords: [],
    texts: [],
    description: '',
    name: ''
  }
  
  componentDidMount = async () => {
    const { id } = this.props.params
    const data = await authFetch('/english/getDictionary', { body: { id }})
    if(data.error) return alert(data.errorname)
    this.setState({ ...data, loading: false, id })
  }

  handleSubmitAddWord = async e => {
    e.preventDefault()
    store.action('popup.createJSX')(<Loading />)
    const body = [...e.target.querySelectorAll('input')].map(item => ({ name: item.name, value: item.value })).reduce((obj, next) => {
      obj[next.name] = next.value
      return obj
    }, {})
    body.id = this.state.id
    const { words } = await authFetch('/english/addWord', { body })
    this.setState({ words })
    store.action('popup.close')()
  }

  handleAddWord = () => {
    store.action('popup.createJSX')(
      <form className={css.addForm} onSubmit={this.handleSubmitAddWord}>
        <h3>Добавление слова</h3>
        { this.state.fields.map((field, i) => <input key={i} type="text" required placeholder={field.title} name={field.name || field.title} />) }
        <button>Добавить</button>
      </form>
    )
  }
  
  handleSelectWord = i => {
    let { selectedWords } = this.state
    console.log(selectedWords, selectedWords.find(item => item === i))
    if(selectedWords.find(item => item === i) > -1) selectedWords = selectedWords.filter(item => item !== i)
    else selectedWords.push(i)
    this.setState({ selectedWords })
  }
  
  handleDeleteWord = async i => {
    const word = this.state.words[i]
    const body = {
      id: this.state.id,
      wordId: word.id,
      word: word.word
    }
    const { words, error, errorname } = await authFetch('/english/deleteWord', { body })
    if(error) return alert(errorname)
    this.setState({ words })
  }

  handleEditWord = i => {

  }

  handleSubmitEditDescription = async e => {
    e.preventDefault()
    store.action('popup.createJSX')(<Loading />)
    const body = [...e.target.querySelectorAll('input'), ...e.target.querySelectorAll('textarea')].map(item => ({ name: item.name, value: item.value })).reduce((obj, next) => {
      obj[next.name] = next.value
      return obj
    }, {})
    body.id = this.state.id
    const { name, description, error, errorname } = await authFetch('/english/editDictionaryDescription', { body })
    if(error) return alert(errorname)
    this.setState({ name, description })
    store.action('popup.close')()
  }

  handleEditDescription = () => {
    store.action('popup.createJSX')(
      <form className={css.addForm} onSubmit={this.handleSubmitEditDescription}>
        <h3>Изменить параметры</h3>
        <input type="text" defaultValue={this.state.name} required name="name" placeholder="Название"/>
        Описание словаря:
        <textarea defaultValue={this.state.description} style={{ marginBottom: 14, resize: 'none' }} required name="description" id="" cols="30" rows="10"></textarea>
        <button>Изменить</button>
      </form>
    )
  }

  handleSubmitAddText = async e => {
    e.preventDefault()
    store.action('popup.createJSX')(<Loading />)
    const body = [...e.target.querySelectorAll('input'), ...e.target.querySelectorAll('textarea')].map(item => ({ name: item.name, value: item.value })).reduce((obj, next) => {
      obj[next.name] = next.value
      return obj
    }, {})
    body.id = this.state.id
    const { texts, error, errorname } = await authFetch('/english/addText', { body })
    if(error) return alert(errorname)
    this.setState({ texts })
    store.action('popup.close')()
  }

  handleAddText = () => {
    store.action('popup.createJSX')(
      <form className={css.addForm} onSubmit={this.handleSubmitAddText}>
        <h3>Добавить текст</h3>
        <input type="text" name="name" placeholder="Название" />
        Текст:
        <textarea style={{ marginBottom: 14, resize: 'none' }} required name="text" id="" cols="30" rows="10"></textarea>
        <button>Добавить</button>
      </form>
    )
  }

  handleShowText = ({ name, text }) => {
    store.action('popup.createJSX')(
      <TextViewer name={name} text={text} words={this.state.words} />
    )
  }

  render() {
    let { words, fields, loading, description = '', name = '', selectedWords, texts } = this.state
    if(!description) description = ''
    return (
      <Page>
        {
          loading ? <p>Загружаю словарь...</p> : <>
            <section className={css.wrapper}>
            <div>
              <table className={css.table}>
                <thead>
                  <tr>
                    { fields.map((field, i) => 
                      <th key={i}>{ field.title }</th>
                    ) }
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !words.length ? <tr><td>Dictionary is empty</td><td>Словарь пуст</td><td /></tr> : <tr></tr>
                  }
                  {
                    words.map((word, i) => 
                      <tr className={selectedWords.find(item => item === i) > -1 ? css.selected : ''} key={i}>
                        {
                          fields.map(({ name, title }, i) => 
                            <td key={i}>{word[name || title]}</td>
                          )
                          
                        }
                        <td className={css.controls}>
                          <img src={editIcon} alt="Edit" onClick={() => this.handleEditWord(i)}/>
                          <img src={deleteIcon} alt="Delete" onClick={() => this.handleDeleteWord(i)}/>
                          <img src={checkIcon} className={css.checkbox} alt="Select" onClick={() => this.handleSelectWord(i)}/>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <button onClick={this.handleAddWord} className={css.addButton}>Добавить слово</button>
              <br/>
              <br/>
              { selectedWords.length ? <button>Удалить выбранные слова ({ selectedWords.length })</button> : ''}
            </div>
            <div>
              <h1 className={css.name}>{ name }</h1>
              <img src={editIcon} className={css.editDescription} onClick={this.handleEditDescription} alt="Edit"/>
              <p>{ description.split('\n').map((item, i) => <span key={i}>{ item }<br/></span>) }</p>
              {
                texts.length ? <div>
                  <h2>Ваши тексты</h2>
                  { texts.map((item, i) => <TextThumbnail onClick={() => this.handleShowText(item)} key={i} {...item} />) }
                </div> : <p>У вас нет добавленных текстов.</p>
              }
              
              <div><div><button onClick={this.handleAddText}>Добавить текст</button></div></div>
            </div>
            </section>
          </>
        }
      </Page>
    
    )
  }
}

export default Dictionary