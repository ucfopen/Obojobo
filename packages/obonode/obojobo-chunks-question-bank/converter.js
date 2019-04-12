import Common from 'obojobo-document-engine/src/scripts/common'
import TextParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter'
import SelectParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/select-parameter'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const SELECT_TYPES = ['sequential', 'random', 'random-unseen']

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

			case SETTINGS_NODE:
				content.choose = child.nodes.first().text
				content.select = child.nodes.last().data.get('current')
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
	const nodes = [
		{
			object: 'block',
			type: SETTINGS_NODE,
			nodes: [
				TextParameter.helpers.oboToSlate(
					'choose',
					'' + (node.content.choose || Infinity),
					'Choose'
				),
				SelectParameter.helpers.oboToSlate(
					'select',
					node.content.select,
					'Select',
					SELECT_TYPES
				)
			]
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
