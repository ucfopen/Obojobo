import Common from 'obojobo-document-engine/src/scripts/common'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

import { NUMERIC_ANSWER_NODE, NUMERIC_FEEDBACK_NODE, NUMERIC_CHOICE_NODE } from './constants'

import { CHOICE_NODE, FEEDBACK_NODE } from 'obojobo-chunks-abstract-assessment/constants'

// TODO - refactor converter when viewer is abstracted

const slateToObo = node => {
	// const numericChoices = []

	// // Parse each numericChoice node
	// node.children.forEach(numericChoiceNode => {
	// 	const [answer, feedback] = numericChoiceNode.children

	// 	if (feedback) {
	// 		numericChoices.push({
	// 			...answer.content,
	// 			...numericChoiceNode.content,
	// 			feedback: Common.Registry.getItemForType(feedback.type).slateToObo(
	// 				feedback,
	// 				NUMERIC_FEEDBACK_NODE
	// 			)
	// 		})
	// 	} else {
	// 		numericChoices.push({
	// 			...answer.content,
	// 			...numericChoiceNode.content
	// 		})
	// 	}
	// })

	// return {
	// 	id: node.key,
	// 	type: node.type,
	// 	children: [],
	// 	content: { numericChoices }
	// }

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
	const nodes = []

	// Parse each numericChoice node
	// if (node.content && node.content.numericChoices) {
	// 	node.content.numericChoices.forEach(numericChoice => {
	// 		const node = {
	// 			type: CHOICE_NODE,
	// 			content: { score: numericChoice.score },
	// 			children: [
	// 				{
	// 					type: NUMERIC_ANSWER_NODE,
	// 					content: { ...numericChoice },
	// 					children: [{ text: '' }]
	// 				}
	// 			]
	// 		}

	// 		// Parse feedback node
	// 		if (numericChoice.feedback) {
	// 			const feedbackNode = Common.Registry.getItemForType(FEEDBACK_NODE).oboToSlate(
	// 				numericChoice.feedback
	// 			)

	// 			node.children.push(feedbackNode)
	// 		}

	// 		nodes.push(node)
	// 	})
	// }

	// return {
	// 	type: node.type,
	// 	children: nodes,
	// 	content: node.content
	// }

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
