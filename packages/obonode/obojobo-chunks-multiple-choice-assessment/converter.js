import Common from 'obojobo-document-engine/src/scripts/common'

const slateToObo = node => {
	const content = node.data.get('content') || {}
	const children = []
	let correct = 0

	node.nodes.forEach(child => {
		children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
		if (child.data.get('content').score === 100) correct++
	})

	if (correct > 1 && content.responseType === 'pick-one') {
		content.responseType = 'pick-one-multiple-correct'
	}
	if (correct === 1 && content.responseType === 'pick-one-multiple-correct') {
		content.responseType = 'pick-one'
	}

	return {
		id: node.key,
		type: node.type,
		children: children,
		content
	}
}

const oboToSlate = node => ({
	object: 'block',
	key: node.id,
	type: node.type,
	nodes: node.children.map(child => Common.Registry.getItemForType(child.type).oboToSlate(child)),
	data: {
		content: node.content
	}
})

export default { slateToObo, oboToSlate }
