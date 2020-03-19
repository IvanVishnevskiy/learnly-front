
let watcherId = 0

class Store {
  constructor(init) {
    this.store = {...init}
    this.watchers = {}
    this.binds = {}
    this.actions = {}
    this._updatingStore = undefined
  }
  remove(key) {
    delete(this.store[key])
  }
  update(items) {
    this._updatingStore = true
    this.store = {...this.store, ...items}
    const watchers = {}
    for(let key in items) {
      if(this.watchers[key]) {
        this.watchers[key].forEach(item => {
          const { id, watcher } = item
          watchers[id] = watchers[id] || { watcher }
          watchers[id].changed = watchers[id].changed || []
          watchers[id].changed.push({[key]: items[key]})
        })
      }
    }
    for(let key in watchers) {
      const { watcher, changed } = watchers[key]
      const newKeys = changed.reduce((obj, item) => ({...obj, ...item}), {})
      watcher.setState(newKeys)
    }
    this._updatingStore = false
  }
  addAction(name = '', fn) {
    if(!name) throw new Error('You should specify action name')
    if(!fn) throw new Error('You should set action function')
    this.actions[name] = fn
  }
  action(name) {
    return this.actions[name] || (() => { throw new Error(`Function ${name} is not defined.`) })
  }
  watchState(watcher, params) {
    const id = watcherId++
    let infoToAdd = {}
    params.forEach(k => {
      this.watchers[k] = this.watchers[k] || []
      this.watchers[k].push({watcher, id})
      if(this.store[k]) {
        infoToAdd = {...infoToAdd, [k]: this.store[k]}
      }
    })
    watcher.setState(infoToAdd)
    const unmount = watcher.componentWillUnmount
    watcher.componentWillUnmount = () => {
      if(typeof unmount === 'function') {
        unmount()
      }
      for(let key in this.watchers) {
        if( params.includes(key) ) this.watchers[key] = this.watchers[key].filter(watcher => watcher.id !== id)
      }
    }
    return {detach: () => {
      for(let key in this.watchers) {
        const arr = this.watchers[key]
        if(params.includes(key)) this.watchers[key] = arr.filter(watcher => watcher.id !== id)
      }
    }}
  }
}
let store = new Store
Object.defineProperty(store, 'heightDetectors', {
  enumerable: true,
  configurable: true,
  writable: true,
})

export default new Proxy(store, {
  get: (target, key) => target[key] ? target[key] : target.actions[key] ? target.actions[key] : target.store[key],
  set: (target, key, value) => {
    if(key === 'store') target[key] = value
    else target.store[key] = value
    return true
  }
})

store.update({
  
})
