import React, { Component } from 'react'
import css from './item.module.css'
import WordWithTranslation from '../WordWithTranslation/WordWithTranslation'

class TextThumbnail extends Component {
  render() {
    const { name, text, words } = this.props 
    const sortedWords = words.sort((a, b) => (b.word.match(/ /g) || '').length - (a.word.match(/ /g) || '').length)
    let textToRenderFrom = text
    const comps = []
    let i = 0
    sortedWords.forEach(({ word, Перевод }) => {
      let re = new RegExp(word.replace(/(?<! )to/gi, '').trim().split(/ /g).join('(ing| it| that| this| me| the| a|) '), 'gi')
      textToRenderFrom = textToRenderFrom.replace(re, item => {
        let context = '';
        [
          { name: ' it ', tr: 'это' }, 
          { name: ' this ', tr: 'это' }, 
          { name: ' that ', tr: 'это' },
          { name: ' me ', tr: 'меня' },
          { name: ' they ', tr: 'их' },
          { name: ' them ', tr: 'их' }
        ].forEach(phrase => 
          context = context ? context : item.includes(phrase.name) ? ` (${phrase.tr})` : ''
        )
        comps.push(<WordWithTranslation key={`comp${i}`} word={item} translation={Перевод + context} />)
        return `~_|_comp${i++}~_|`
      })
    })
    textToRenderFrom = textToRenderFrom.replace(/\n/gi, '~_|_br~_|')
    console.log(textToRenderFrom)
    const textToRender = textToRenderFrom.split(/(~_\|)/g).filter(item => item !== '~_|').map((item, i) => item === '_br' ? <br key={i} /> : item.startsWith('_comp') ? comps[parseInt(item.replace('_comp', ''))] : <span key={i}>{ item }</span>)

    return (
      <div className={css.main}>
        <h3>{ name }</h3>
        <p>
          { textToRender }
        </p>
      </div>
    
    )
  }
}

export default TextThumbnail