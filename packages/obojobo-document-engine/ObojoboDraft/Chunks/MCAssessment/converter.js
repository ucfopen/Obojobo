import Common from 'Common'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	let correct = 0

	node.nodes.forEach(child => {
		switch (child.type) {
			case CHOICE_LIST_NODE:
				child.nodes.forEach(choice => {
					json.children.push(Common.Store.getItemForType(choice.type).slateToObo(choice))
					if (choice.data.get('content').score === 100) correct++
				})
				break
			case SETTINGS_NODE:
				json.content.responseType = child.nodes.first().data.get('current')
				json.content.shuffle = child.nodes.last().data.get('checked')
				break
		}
	})

	if (correct > 1 && json.content.responseType === 'pick-one') {
		json.content.responseType = 'pick-one-multiple-correct'
	}
	if (correct === 1 && json.content.responseType === 'pick-one-multiple-correct') {
		json.content.responseType = 'pick-one'
	}

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	const choiceList = {
		object: 'block',
		type: CHOICE_LIST_NODE,
		nodes: []
	}

	node.children.forEach(child => {
		choiceList.nodes.push(Common.Store.getItemForType(child.type).oboToSlate(child))
	})

	json.nodes.push(choiceList)

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'responseType',
			value: node.content.responseType,
			display: 'Response Type',
			options: ['pick-one', 'pick-all']
		})
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'shuffle',
			value: node.content.shuffle,
			display: 'Shuffle',
			checked: true
		})
	)

	json.nodes.push(settings)

	return json
}

export default { slateToObo, oboToSlate }
