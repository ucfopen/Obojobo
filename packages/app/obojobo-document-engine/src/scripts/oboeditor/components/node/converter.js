import Common from 'Common'

const COMPONENT_NODE = 'oboeditor.component'

const slateToObo = node => {
	let json = {}

	node.nodes.forEach(child => {
		json = Common.Registry.getItemForType(child.type).slateToObo(child)
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = COMPONENT_NODE
	json.nodes = []

	const editorModel = Common.Registry.getItemForType(node.type)
	console.log(node.type)
	if (editorModel && !editorModel.ignore) {
		console.log(editorModel)
		json.nodes.push(editorModel.oboToSlate(node))
	}
	return json
}

export default { slateToObo, oboToSlate }
