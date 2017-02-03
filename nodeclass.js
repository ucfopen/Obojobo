// let createChildSet = (nodeClass) => {
//   return getChildSet(nodeClass, new Set(), true)
// }

let getChildSet = (nodeClass, set, recur) => {
  for(let i in nodeClass.children)
  {
    set.add(nodeClass.children[i].node.id)
    if(recur) getChildSet(nodeClass.children[i], set, true)
  }

  return set
}

module.exports = class NodeClass {
  constructor(draftTree, node, listeners, app, db, initFn) {
    this.draftTree = draftTree
    this.node = Object.assign({}, node)
    delete this.node.children
    this.app = app
    this.db = db
    this.init = initFn
    this.children = []
    // this.childSet = createChildSet(this.node)
    // this.immediateChildrenSet = getChildSet(this.node, new Set(), false)
    this._listeners = new Map()

    // console.log('CONSTRUCT NODE CLASS', node.type, this._listeners)


    let i = 0
    for(let event in listeners)
    {
      // app.removeAllListeners(event)
      // console.log('CREATING A LISTENER FOR', event, this.node.id, app.listeners(event))
      // if(this._listeners.get(event)) {
      //   // console.log('REMOVING OLD')
      //   app.removeListener(event, this._listeners.get(event))
      // }

      this._listeners.set(event, listeners[event].bind(this))
      // this[event] = this._listeners.get(event)
      // app.on(event, this._listeners.get(event))
      // console.log('RESULT', app.listeners(event))
      // console.log('')
      i++
    }
  }

  get childrenSet() {
    return getChildSet(this, new Set(), true)
  }

  get immediateChildrenSet() {
    return getChildSet(this, new Set(), false)
  }

  contains(oboNode) {
    return this.childrenSet.has(oboNode.id)
  }

  yell(event) {
    // console.log(this.node.id, 'yells', event)

    let eventListener = this._listeners.get(event)
    if(eventListener) eventListener.apply(this, Array.prototype.slice.call(arguments, 1))

    for(let i in this.children)
    {
      this.children[i].yell.apply(this.children[i], arguments)
    }
  }

  init() {
    this.init()
  }

  toObject() {

    // console.log('toObject', this.node.id, this.node.type, this.children)
    let o = Object.assign({}, this.node)
    o.children = []

    for(let i in this.children)
    {
      o.children.push(this.children[i].toObject())
    }

    return o
  }
}