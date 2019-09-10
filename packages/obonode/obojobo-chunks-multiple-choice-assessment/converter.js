import Common from 'obojobo-document-engine/src/scripts/common'
import ToggleParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/toggle-parameter'
import SelectParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/select-parameter'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

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
					children.push(Common.Registry.getItemForType(choice.type).slateToObo(choice))
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

const convertItemsToArray = (items) => {
	return Array.from(items.values())
}

const oboToSlate = node => {
	const choiceList = {
		object: 'block',
		type: CHOICE_LIST_NODE,
		nodes: node.children.map(child => {
			console.log(child.type)
			const array = Common.Registry.getItems(convertItemsToArray)
			console.log(array)
			return Common.Registry.getItemForType(child.type).oboToSlate(child)
		})
	}

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: [
			SelectParameter.helpers.oboToSlate(
				'responseType',
				node.content.responseType,
				'Response Type',
				['pick-one', 'pick-all']
			),
			ToggleParameter.helpers.oboToSlate('shuffle', node.content.shuffle, 'Shuffle')
		]
	}

	// Need to get the question type from the Question parent
	// This is done to render elements correctly
	const oboModel = OboModel.models[node.id]
	const questionModel = oboModel.parent
	const questionType = questionModel.attributes.content.type

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes: [choiceList, settings],
		data: {
			content: node.content,
			questionType: questionType
		}
	}
}

export default { slateToObo, oboToSlate }
