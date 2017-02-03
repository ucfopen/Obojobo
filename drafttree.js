let NodeClass = require('./nodeclass')



function processNode(draftTree, app, db, node) {
  let initFn = function() {}
  let listeners = {}

  let registration = app.sdom.getRegistration(node.type)
  if(registration)
  {
    let instApi = registration.inst
    initFn = instApi.init
    listeners = instApi.listeners
  }

  let nodeClass = new NodeClass(draftTree, node, listeners, app, db, initFn)
  draftTree.instances.set(node.id, nodeClass)

  nodeClass.init()

  draftTree.nodeClassesById.set(nodeClass.node.id, nodeClass)

  let nodesByType = draftTree.nodeClassesByType.get(node.type)
  if(!nodesByType) nodesByType = []
  nodesByType.push(nodeClass)
  draftTree.nodeClassesByType.set(node.type, nodesByType)

  for(let i in node.children)
  {
    let childNodeClass = processNode(draftTree, app, db, node.children[i])
    nodeClass.children.push(childNodeClass)
  }

  return nodeClass
}

module.exports = class DraftTree {
  constructor(app, db, document) {
    this.instances = new Map()
    this.nodeClassesById = new Map()
    this.nodeClassesByType = new Map()

    // let events = app.eventNames()
    // for(let i in events)
    // {
    //   console.log('REMOVE', events[i])
    //   app.removeAllListeners(events[i])
    // }

    processNode(this, app, db, document)

    this.root = this.findNodeClass(document.id)
  }

  findNodeClass(id) {
    return this.nodeClassesById.get(id)
  }

  findNodesWithType(type) {
    return this.nodeClassesByType.get(type)
  }

  get document() {
    return this.root.toObject()
  }
}