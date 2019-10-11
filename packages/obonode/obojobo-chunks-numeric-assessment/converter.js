import Common from 'obojobo-document-engine/src/scripts/common'

import {
	SCORE_RULE_NODE,
	NUMERIC_FEEDBACK_NODE,
	NUMERIC_ANSWER,
	EXACT_ANSWER,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	MARGIN_OF_ERROR
} from './constant'

const complexifiedNumericRule = numericRule => {
	switch (numericRule.requirement) {
		case 'exact':
			return {
				requirement: EXACT_ANSWER,
				answerInput: numericRule.answer,
				score: numericRule.score
			}
		case 'range':
			return {
				requirement: WITHIN_A_RANGE,
				startInput: numericRule.start,
				endInput: numericRule.end,
				score: numericRule.score
			}
		case 'precise':
			return {
				requirement: PRECISE_RESPONSE,
				type: numericRule.precisionType == 'sig-figs' ? 'Significant digits' : 'Decimal places',
				answerInput: numericRule.answer,
				precisionInput: numericRule.precision,
				score: numericRule.score
			}
		case 'margin':
			return {
				requirement: MARGIN_OF_ERROR,
				type: numericRule.marginType == 'absolute' ? 'Absolute' : 'Percent',
				answerInput: numericRule.answer,
				marginInput: numericRule.margin,
				score: numericRule.score
			}
		default:
			return {
				requirement: EXACT_ANSWER,
				score: numericRule.score
			}
	}
}

const simplifedNumericRule = numericRule => {
	switch (numericRule.requirement) {
		case EXACT_ANSWER:
			return {
				requirement: 'exact',
				answer: numericRule.answerInput,
				score: numericRule.score
			}
		case WITHIN_A_RANGE:
			return {
				requirement: 'range',
				start: numericRule.startInput,
				end: numericRule.endInput,
				score: numericRule.score
			}
		case PRECISE_RESPONSE:
			return {
				requirement: 'precise',
				type: numericRule.precisionType == 'Significant digits' ? 'sig-figs' : 'dec',
				answer: numericRule.answerInput,
				precision: numericRule.precisionInput,
				score: numericRule.score
			}
		case MARGIN_OF_ERROR:
			return {
				requirement: 'margin',
				type: numericRule.marginType == 'Absolute' ? 'absolute' : 'percent',
				answer: numericRule.answerInput,
				margin: numericRule.marginInput,
				score: numericRule.score
			}
		default:
			return {
				requirement: 'exact',
				score: numericRule.score
			}
	}
}

const slateToObo = node => {
	const NumericRules = []

	// Parse each scoreRule node
	node.nodes.forEach(child => {
		switch (child.type) {
			case NUMERIC_ANSWER:
				// const numericRule = simplifedNumericRule(child[0].data.get('numericRule'))

				// Parse feedback node
				let numericRule = {}
				child.nodes.forEach(component => {
					if (component.type === SCORE_RULE_NODE) {
						numericRule = simplifedNumericRule(component.data.get('numericRule'))
					}
					if (component.type === NUMERIC_FEEDBACK_NODE) {
						numericRule.feedback = Common.Registry.getItemForType(component.type).slateToObo(
							component
						)
					}
				})
				NumericRules.push(numericRule)

				break
		}
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: { NumericRules }
	}
}

const oboToSlate = node => {
	// Parse each scoreRule node
	const nodes = node.content.numericRules.map(numericRule => {
		const node = {
			object: 'block',
			type: NUMERIC_ANSWER,
			nodes: [
				{
					object: 'block',
					type: SCORE_RULE_NODE,
					data: { numericRule: complexifiedNumericRule(numericRule) }
				}
			]
		}

		// Parse feedback node
		if (numericRule.feedback) {
			const feedbackNode = Common.Registry.getItemForType(numericRule.feedback.type).oboToSlate(
				numericRule.feedback
			)

			node.nodes.push(feedbackNode)
		}

		return node
	})

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content: node.content
		}
	}
}

export default { slateToObo, oboToSlate }
