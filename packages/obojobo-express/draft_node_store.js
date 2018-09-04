let DraftNode = global.oboRequire('models/draft_node')
let draftNodeStorage = new Map()

let add = (nodeName, nodeFile) => {
	if (draftNodeStorage.has(nodeName)) return
	draftNodeStorage.set(nodeName, require(nodeFile))
}

let get = nodeName => {
	if (draftNodeStorage.has(nodeName)) {
		return draftNodeStorage.get(nodeName)
	}

	// default to a generic draft node
	return DraftNode
}

module.exports = {
	get: get,
	add: add
}
