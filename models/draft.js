let obojoboDraftExpress = require('../obojobo_draft_express');
let db = require('../db');

// Collects all children DraftNodes into a Set() object
// optionally recursive
collectChildrenNodes = (draftNode, set, recurse) => {
  for(let i in draftNode.children){
    set.add(draftNode.children[i].node.id)
    if(recurse) collectChildrenNodes(draftNode.children[i], set, true)
  }
  return set
}

// Generic class that represents each node in a Draft Document
class DraftNode {
  constructor(draftTree, node, listeners, initFn) {
    this.draftTree = draftTree
    this.node = Object.assign({}, node)
    delete this.node.children
    this.init = initFn
    this.children = []
    this._listeners = new Map()

    let i = 0
    for(let event in listeners){
      this._listeners.set(event, listeners[event].bind(this))
      i++
    }
  }

  get childrenSet() {
    return collectChildrenNodes(this, new Set(), true)
  }

  get immediateChildrenSet() {
    return collectChildrenNodes(this, new Set(), false)
  }

  contains(oboNode) {
    return this.childrenSet.has(oboNode.id)
  }

  yell(event) {
    let eventListener = this._listeners.get(event)
    if(eventListener) eventListener.apply(this, Array.prototype.slice.call(arguments, 1))

    for(let i in this.children){
      this.children[i].yell.apply(this.children[i], arguments)
    }
  }

  init() {
    this.init()
  }

  toObject() {
    let o = Object.assign({}, this.node)
    o.children = []

    for(let i in this.children){
      o.children.push(this.children[i].toObject())
    }

    return o
  }
}


class Draft {
  constructor(rawDraft) {
    this.instances = new Map()
    this.nodesById = new Map()
    this.nodesByType = new Map()
    this.processRawNode(rawDraft)
    this.root = this.findNodeClass(rawDraft.id)
  }

  processRawNode(node){
    let initFn = () => {}
    let listeners = {}
    let registration = obojoboDraftExpress.getDraftModule(node.type)

    if(registration){
      let instApi = registration.inst
      initFn = instApi.init
      listeners = instApi.listeners
    }

    let draftNode = new DraftNode(this, node, listeners, initFn)
    this.instances.set(node.id, draftNode)

    draftNode.init()

    this.nodesById.set(draftNode.node.id, draftNode)

    let nodesByType = this.nodesByType.get(node.type)
    if(!nodesByType) nodesByType = []
    nodesByType.push(draftNode)
    this.nodesByType.set(node.type, nodesByType)

    for(let i in node.children){
      let childNode = this.processRawNode(node.children[i])
      draftNode.children.push(childNode)
    }

    return draftNode
  }

  static fetchById(id) {
    return db
      .one(`
        SELECT
          drafts.id AS id,
          drafts.created_at AS draft_created_at,
          drafts_content.created_at AS content_created_at,
          drafts_content.content AS content
        FROM drafts
        JOIN drafts_content
        ON drafts.id = drafts_content.draft_id
        WHERE drafts.id = $1
        ORDER BY drafts_content.created_at DESC
        LIMIT 1
      `, id)
      .then( result => {
        result.content._id = result.id
        result.content._rev = result.revision
        return new Draft(result.content)
      })
  }

  get document(){
    return this.root.toObject()
  }

  findNodeClass(id) {
    return this.nodesById.get(id)
  }

  findNodesWithType(type) {
    return this.nodesByType.get(type)
  }

}

module.exports = Draft
