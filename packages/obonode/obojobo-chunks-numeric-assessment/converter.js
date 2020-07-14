import Common from 'obojobo-document-engine/src/scripts/common'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'
import { NUMERIC_CHOICE_NODE } from './constants'
import { CHOICE_NODE } from 'obojobo-chunks-abstract-assessment/constants'

const slateToObo = node => {
	const children = node.children.map(child => {
		return Common.Registry.getItemForType(child.type).slateToObo(child, NUMERIC_CHOICE_NODE)
	})

	return {
		id: node.id,
		type: node.type,
		children,
		content: withoutUndefined({
			triggers: node.content.triggers
		})
	}
}

const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	// Need to get the question type from the Question parent
	// This is done to render elements correctly
	const oboModel = OboModel.models[node.id]
	const questionModel = oboModel.parent
	const questionType = questionModel.attributes.content.type

	slateNode.children = node.children.map(child =>
		Common.Registry.getItemForType(CHOICE_NODE).oboToSlate(child)
	)
	slateNode.questionType = questionType

	return slateNode
}

export default { slateToObo, oboToSlate }
