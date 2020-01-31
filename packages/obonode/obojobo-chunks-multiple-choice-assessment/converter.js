import Common from 'obojobo-document-engine/src/scripts/common'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => {
	const content = node.data.get('content') || {}
	let correct = 0

	const children = node.nodes.map(child => {
		if (child.data.get('content').score === 100) correct++

		return Common.Registry.getItemForType(child.type).slateToObo(child)
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
		children,
		content: withoutUndefined(content)
	}
}

const oboToSlate = node => {
	// Need to get the question type from the Question parent
	// This is done to render elements correctly
	const oboModel = OboModel.models[node.id]
	const questionModel = oboModel.parent
	const questionType = questionModel.attributes.content.type

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes: node.children.map(child => Common.Registry.getItemForType(child.type).oboToSlate(child)),
		data: {
			content: node.content,
			questionType: questionType
		}
	}
}

export default { slateToObo, oboToSlate }
