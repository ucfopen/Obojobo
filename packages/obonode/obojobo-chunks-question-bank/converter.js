import Common from 'obojobo-document-engine/src/scripts/common'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const slateToObo = node => {
	let content
	const children = []

	node.nodes.forEach(child => {
		switch (child.type) {
			case QUESTION_BANK_NODE:
				children.push(slateToObo(child))
				break

			case QUESTION_NODE:
				children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
				break

			case SETTINGS_NODE:
				content = { ...(child.data.get('content') || {}) }

				if (content.chooseAll) {
					content.choose = 'all'
				} else if (!Number.isFinite(parseInt(content.choose, 10))) {
					content.choose = '1'
				}
				delete content.chooseAll
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
	const chooseAll = !Number.isFinite(parseInt(node.content.choose, 10))
	const data = { content: { ...node.content, chooseAll } }

	if (chooseAll) data.content.choose = '1'

	const nodes = [
		{
			object: 'block',
			type: SETTINGS_NODE,
			isVoid: true,
			data
		}
	]

	node.children.forEach(child => {
		// If the current Node is a registered OboNode, use its custom converter
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
