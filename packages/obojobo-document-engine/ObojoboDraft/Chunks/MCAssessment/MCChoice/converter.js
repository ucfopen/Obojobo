import Common from 'Common'

const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: node.nodes.map(child => Common.Store.getItemForType(child.type).slateToObo(child)),
	content: node.data.get('content') || {}
})

const oboToSlate = node => ({
	object: 'block',
	key: node.id,
	type: node.type,
	nodes: node.children.map(child => Common.Store.getItemForType(child.type).oboToSlate(child)),
	data: {
		content: node.content
	}
})

export default { slateToObo, oboToSlate }
