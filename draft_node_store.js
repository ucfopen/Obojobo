let DraftNode = global.oboRequire('models/draft_node')
let draftNodeStorage = new Map()

let init = (nodeConfigs) => {
	nodeConfigs.forEach( item => { add(item.name, item.path) })
}

let add = (nodeName, nodeFile) => {
	if(draftNodeStorage.has(nodeName)) return
	console.log('Registering draft node type', nodeName, nodeFile)
	draftNodeStorage.set(nodeName, require(nodeFile))
}

let get = (nodeName) => {
	if(draftNodeStorage.has(nodeName)){
		return draftNodeStorage.get(nodeName)
	}

	// default to a generic draft node
	return DraftNode;
}

module.exports = {
	init:init,
	get:get,
	add:add
}
