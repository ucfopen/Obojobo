import Component from '../../../../src/scripts/oboeditor/components/editor-component'

const slateToObo = node => {
	const json = {}
	console.log(node)
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		json.children.push(Component.helpers.slateToObo(child))
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	node.children.forEach(child => {
		json.nodes.push(Component.helpers.oboToSlate(child))
	})

	return json
}

export default { slateToObo, oboToSlate }
