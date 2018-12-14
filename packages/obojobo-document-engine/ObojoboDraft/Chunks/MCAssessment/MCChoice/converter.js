import Common from 'Common'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		json.children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
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
		json.nodes.push(Common.Registry.getItemForType(child.type).oboToSlate(child))
	})

	return json
}

export default { slateToObo, oboToSlate }
