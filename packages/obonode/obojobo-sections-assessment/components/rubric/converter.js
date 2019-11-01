const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

const slateToObo = node => {
	const content = Object.assign({}, node.data.get('content'))
	if(content.passedType !== 'set-value') content.passedResult = content.passedType
	if(content.failedType !== 'set-value') content.failedResult = content.failedType
	if(content.unableToPassType !== 'set-value') content.unableToPassResult = content.unableToPassType
	if(content.unableToPassResult === 'no-value') content.unableToPassResult = null

	return content
}

const oboToSlate = node => {
	if(node.passedResult === '$attempt_score') {
		node.passedType = '$attempt_score'
		node.passedResult = 100
	} else {
		node.passedType = 'set-value'
	}

	switch(node.failedResult) {
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

	switch(node.unableToPassResult) {
		case '$highest_attempt_score':
			node.unableToPassType = '$highest_attempt_score'
			node.unableToPassResult = 0
			break
		case 'no-score':
			node.unableToPassType = 'no-score'
			node.unableToPassResult = 0
			break
		case null: 
			node.unableToPassType = 'no-value'
			node.unableToPassResult = 0
			break
		default:
			node.unableToPassType = 'set-value'
			break
	}

	return {
		object: 'block',
		type: RUBRIC_NODE,
		data: { content: node },
		isVoid: true
	}
}

export default { slateToObo, oboToSlate }
