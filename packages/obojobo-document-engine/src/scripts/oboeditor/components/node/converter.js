import Common from 'Common'

const COMPONENT_NODE = 'oboeditor.component'

const slateToObo = node => {
	let json = {}

	node.nodes.forEach(child => {
		json = Common.Store.getItemForType(child.type).slateToObo(child)
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = COMPONENT_NODE
	json.nodes = []

	const editorModel = Common.Store.getItemForType(node.type)
	json.nodes.push(editorModel.oboToSlate(node))
	return json
}

export default { slateToObo, oboToSlate }
