import Common from 'Common'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

const slateToObo = node => {
	const content = node.data.get('content') || {}
	const children = []
	let correct = 0

	node.nodes.forEach(child => {
		switch (child.type) {
			case CHOICE_LIST_NODE:
				child.nodes.forEach(choice => {
					children.push(Common.Store.getItemForType(choice.type).slateToObo(choice))
					if (choice.data.get('content').score === 100) correct++
				})
				break

			case SETTINGS_NODE:
				content.responseType = child.nodes.first().data.get('current')
				content.shuffle = child.nodes.last().data.get('checked')
				break
		}
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

const oboToSlate = node => {
	const choiceList = {
		object: 'block',
		type: CHOICE_LIST_NODE,
		nodes: node.children.map(child => Common.Store.getItemForType(child.type).oboToSlate(child))
	}

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: [
			ParameterNode.helpers.oboToSlate({
				name: 'responseType',
				value: node.content.responseType,
				display: 'Response Type',
				options: ['pick-one', 'pick-all']
			}),
			ParameterNode.helpers.oboToSlate({
				name: 'shuffle',
				value: node.content.shuffle,
				display: 'Shuffle',
				checked: true
			})
		]
	}

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes: [choiceList, settings],
		data: {
			content: node.content
		}
	}
}

export default { slateToObo, oboToSlate }
