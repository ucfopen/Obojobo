import Common from 'Common'

import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		switch (child.type) {
			case QUESTION_BANK_NODE:
				json.children.push(slateToObo(child))
				break
			case QUESTION_NODE:
				json.children.push(Common.Store.getItemForType(child.type).slateToObo(child))
				break
			case SETTINGS_NODE:
				json.content.choose = child.nodes.first().text
				json.content.select = child.nodes.last().data.get('current')
				break
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	///json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'choose',
			value: node.content.choose + '',
			display: 'Choose'
		})
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'select',
			value: node.content.select,
			display: 'Select',
			options: ['sequential', 'random', 'random-unseen']
		})
	)

	json.nodes.push(settings)

	node.children.forEach(child => {
		// If the current Node is a registered OboNode, use its custom converter
		if (child.type === QUESTION_BANK_NODE) {
			json.nodes.push(oboToSlate(child))
		} else {
			json.nodes.push(Common.Store.getItemForType(child.type).oboToSlate(child))
		}
	})

	return json
}

export default { slateToObo, oboToSlate }
