const DraftNode = global.oboRequire('server/models/draft_node')
const draftNodeStorage = new Map()

const add = nodeClass => {
	if (!nodeClass.nodeName) {
		throw new Error('Unable to add node class to store, object is missing nodeName property')
	}

	if (draftNodeStorage.has(nodeClass.nodeName)) {
		throw new Error(
			`Unable to add node class to store, ${nodeClass.nodeName} is already registered`
		)
	}

	draftNodeStorage.set(nodeClass.nodeName, nodeClass)
}

const get = nodeName => {
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
