import Common from 'obojobo-document-engine/src/scripts/common'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const slateToObo = node => {
	const content = node.data.get('content') || {}
	const children = []

	node.nodes.forEach(child => {
		switch (child.type) {
			case QUESTION_BANK_NODE:
				children.push(slateToObo(child))
				break

			case QUESTION_NODE:
				children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
				break
		}
	})

	return {
		id: node.key,
		type: node.type,
		children,
		content
	}
}

const oboToSlate = node => {
	const nodes = []

	node.children.forEach(child => {
		if (child.type === QUESTION_BANK_NODE) {
			nodes.push(oboToSlate(child))
		} else {
			nodes.push(Common.Registry.getItemForType(child.type).oboToSlate(child))
		}
	})

	return {
		object: 'block',
		type: node.type,
		nodes,
		data: {
			content: node.content
		}
	}
}

export default { slateToObo, oboToSlate }
