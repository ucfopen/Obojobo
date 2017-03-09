let db = oboRequire('db');
let draftNodeStore = oboRequire('draft_node_store')

class Draft {
	constructor(rawDraft) {
		this.instances = new Map()
		this.nodesById = new Map()
		this.nodesByType = new Map()
		this.root = this.processRawNode(rawDraft)
	}

	processRawNode(node){
		let initFn = () => {}

		let draftClass = draftNodeStore.get(node.type)

		let draftNode = new draftClass(this, node, initFn)
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
		return db.one(`
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
		.catch( error => {
			console.log('fetchById Error', error.message)
			return error
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
