/* eslint-disable no-undefined */

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

const slateToObo = node => {
	const content = Object.assign({}, node.content)
	delete content.showModProperties

	if (content.type !== 'pass-fail') return ''

	if (content.passedType !== 'set-value') content.passedResult = content.passedType
	if (content.failedType !== 'set-value') content.failedResult = content.failedType
	if (content.unableToPassType !== 'set-value') {
		content.unableToPassResult = content.unableToPassType
	}
	if (content.unableToPassResult === 'no-value') content.unableToPassResult = null
	if (content.mods && content.mods.length < 1) delete content.mods

	delete content.passedType
	delete content.failedType
	delete content.unableToPassType
	delete content.attempts

	return content
}

const oboToSlate = node => {
	if (node.passedResult === '$attempt_score') {
		node.passedType = '$attempt_score'
		node.passedResult = 100
	} else {
		node.passedType = 'set-value'
	}

	switch (node.failedResult) {
		case '$attempt_score':
			node.failedType = '$attempt_score'
			node.failedResult = 0
			break
		case 'no-score':
			node.failedType = 'no-score'
			node.failedResult = 0
			break
		default:
			node.failedType = 'set-value'
			break
	}

	switch (node.unableToPassResult) {
		case '$highest_attempt_score':
			node.unableToPassType = '$highest_attempt_score'
			node.unableToPassResult = 0
			break
		case 'no-score':
			node.unableToPassType = 'no-score'
			node.unableToPassResult = 0
			break
		case null:
		case undefined:
			node.unableToPassType = 'no-value'
			node.unableToPassResult = 0
			break
		default:
			node.unableToPassType = 'set-value'
			break
	}

	if (!node.mods) node.mods = []

	return {
		type: RUBRIC_NODE,
		content: node,
		children: [{ text: '' }]
	}
}

export default { slateToObo, oboToSlate }
